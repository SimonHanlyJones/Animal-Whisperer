import React, { useEffect, useRef } from "react"; // , { Dispatch, useState, useEffect, SetStateAction } from "react";
import { View, LogBox } from "react-native";
import Voice from "@react-native-voice/voice";
import { useChatContext } from "../../contexts/ChatContext";

LogBox.ignoreLogs(["new NativeEventEmitter"]);

function SpeechRecognition() {
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
  const noSpeechTimeoutRef = useRef(null);

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
      clearNoSpeechTimeout();
      handleRecognizedText(recognizedText);
    }
  };

  const onSpeechError = (error: any) => {
    console.log("Speech recognition error:", error);
    if (error && error.error.message === "7/No match") {
      setIsConversation(false);
      isConversationRef.current = false;
    }
  };

  const onSpeechPartialResults = (e: any) => {
    // console.log("Partial speech results.", e.value);
    if (e.value && e.value.length > 0) {
      clearNoSpeechTimeout();
      setPartialText(e.value[0]); // Update partial text state
    }
  };

  const onSpeechVolumeChanged = (e: any) => {
    setMicLevel(e.value);
    // console.log("Speech volume changed:", e);
  };

  const onSpeechStart = (e: any) => {
    console.log("onSpeechStart: ", e);
    setNoSpeechTimeout();
  };

  const handleNoSpeechDetected = () => {
    console.log("No speech detected within the expected timeframe.");
    setIsConversation(false);
    isConversationRef.current = false;
    setIsListening(false);
    isListeningRef.current = false;
  };

  const setNoSpeechTimeout = () => {
    clearNoSpeechTimeout(); // Clear any existing timeout
    noSpeechTimeoutRef.current = setTimeout(handleNoSpeechDetected, 5000); // 5-second timeout
  };

  const clearNoSpeechTimeout = () => {
    if (noSpeechTimeoutRef.current) {
      clearTimeout(noSpeechTimeoutRef.current);
      noSpeechTimeoutRef.current = null;
    }
  };

  React.useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

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
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

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

export default SpeechRecognition;
