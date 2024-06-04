import React from "react";
import { View } from "react-native";
import Voice from "@react-native-voice/voice";
import { useChatContext } from "../../contexts/ChatContext";

export function SpeechRecognition() {
  const {
    messages,
    setMessages,
    addMessage,
    showConvoStarter,
    setShowConvoStarter,
    waitingForResponse,
    setWaitingForResponse,
    modalUserVisible,
    setModalUserVisible,
    firebaseUser,
    setFirebaseUser,
    isSpeaking,
    setIsSpeaking,
    isListening,
    setIsListening,
    isConversation,
    setIsConversation,
    isConversationRef,
    firebaseUserRef,
    isSpeakingRef,
    isListeningRef,
    onSend,
    messageHistoryAI,
    setMessageHistoryAI,
    lastMessageRef,
    micLevel,
    setMicLevel,
  } = useChatContext();

  // const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = React.useState("");
  const [partialText, setPartialText] = React.useState("");

  const handleRecognizedText = async (recognizedText: string) => {
    // console.log(recognizedText);
    setIsListening(false);
    isListeningRef.current = false;
    setRecognizedText(recognizedText);
    console.log("Voice recognition result:", recognizedText);
    if (
      (isConversation || isConversationRef.current) &&
      recognizedText.length > 0
    ) {
      await onSend([
        {
          _id: Math.random().toString(),
          text: recognizedText,
          createdAt: new Date(),
          user: {
            _id: 1,
          },
        },
      ]);
      setIsSpeaking(true);
      isSpeakingRef.current = true;
    }
  };

  const onSpeechResults = (e: any) => {
    console.log("Speech results.");
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0];
      handleRecognizedText(recognizedText);
    }
  };

  const onSpeechError = (error: any) => {
    console.log("Speech recognition error:", error);
    if (error && error.error.message === "7/No match") {
      setIsConversation(false);
      isConversationRef.current = false;
    } else {
      console.log("TODO, check if text regonized, if not end conversation");
    }
  };

  // const onSpeechPartialResults = (e: any) => {
  //   // console.log("Partial speech results.");
  //   if (e.value && e.value.length > 0) {
  //     setPartialText(e.value[0]); // Update partial text state
  //     onPartialResult(e.value[0]);
  //   }
  // };
  const onSpeechVolumeChanged = (e: any) => {
    setMicLevel(e.value);
    // console.log("Speech volume changed:", e);
  };

  // const onSpeechStart = (e: any) => {
  //   console.log("onSpeechStart: ", e);
  // };
  const onSpeechEnd = (e: any) => {
    console.log("onSpeechEnd: ", e, " recognizedText:", recognizedText);

    setMicLevel(-5);
    setIsListening(false);
    isListeningRef.current = false;

    // if (recognizedText.length === 0) {
    //   console.log("no speech recognition, end conversation");
    //   setIsConversation(false);
    //   isConversationRef.current = false;
    //   setIsSpeaking(false);
    //   isSpeakingRef.current = false;
    // }
  };
  const onSpeechStart = (e: any) => {
    setRecognizedText("");
  };

  React.useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    // Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;
    // Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechStart = onSpeechStart;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  React.useEffect(() => {
    if (isListening) {
      startListening();
    }
    if (!isListening) {
      stopListening();
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [isListening]);

  async function startListening() {
    // TODO check available
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;

    if (await Voice.isAvailable()) {
      console.log("voice available: true");
      await Voice.start("en-AU");
      if (!Voice.isRecognizing()) {
        await Voice.start("en-AU");
      }
    } else {
      console.log("voice available: false");
    }
    // TODO check success
  }

  async function stopListening() {
    await Voice.stop();
    await Voice.destroy();
    await Voice.removeAllListeners();
    setIsListening(false);
  }

  return <View></View>;
}
