import { View, TouchableOpacity, Text } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useChatContext } from "../../contexts/ChatContext";
import { styles } from "../../styles/styles";

import SpeechRecognition from "./SpeechRecognition";
import VoiceSynthesis from "./VoiceSynthesis";
import ConvModal from "./ConvModal";
// import * as Haptics from "expo-haptics";

import React from "react";

function ConversationParent() {
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
  } = useChatContext();

  const [conversationModalVisible, setConversationModalVisible] =
    useState(false);

  // TODO: implement check on permissions

  useEffect(() => {
    isConversationRef.current = isConversation;
    if (!isConversation) {
      setIsListening(false);
      setIsSpeaking(false);
    }
    if (isConversation) {
      setIsListening(true);
      setConversationModalVisible(true);
    }
  }, [isConversation]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    // Only trigger haptics if the state changes to true
    // if (isListening !== isListeningRef.current && isListening) {
    //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // }
    isListeningRef.current = isListening;
  }, [isListening]);

  const handleCloseConversationModal = () => {
    setConversationModalVisible(false);
    setIsConversation(false);
  };

  const handleVoiceResult = useCallback(
    (text: string) => {
      if (isConversation && text.length > 0) {
        onSend([
          {
            _id: Math.random().toString(),
            text: text,
            createdAt: new Date(),
            user: {
              _id: 1,
            },
          },
        ]);
        setIsSpeaking(true);
        isSpeakingRef.current = true;
      }
      console.log("Voice recognition result:", text);
    },
    [isConversation]
  );

  const [partialText, setPartialText] = useState("");

  const handlePartialResult = (text: string) => {
    setPartialText(text); // Update state with partial result
    // console.log("Partial voice recognition result:", text); // Log partial result
  };

  const handleVoiceError = (error: any) => {
    setIsConversation(false);
  };

  const toggleListening = () => {
    console.log("triggering");
    setIsListening(!isListening); // Toggle the listening state
    if (!isListening) {
      console.log("Starting voice recognition...");
      console.log("Partial Text:", partialText); // Log existing partial text if any
    } else {
      console.log("Stopping voice recognition...");
    }
  };

  return (
    <View>
      <SpeechRecognition
        isListening={isListening}
        setIsListening={setIsListening}
        onResult={handleVoiceResult}
        onPartialResult={handlePartialResult}
        onError={handleVoiceError}
      />
      <VoiceSynthesis
        isConversation={isConversation}
        waitingForResponse={waitingForResponse}
        isSpeaking={isSpeaking}
        setIsSpeaking={setIsSpeaking}
        isSpeakingRef={isSpeakingRef}
        lastMessageRef={lastMessageRef}
      />
      <ConvModal
        isVisible={conversationModalVisible}
        onClose={handleCloseConversationModal}
        isSpeaking={isSpeaking}
        isListening={isListening}
        waitingForResponse={waitingForResponse}
        setIsConversation={setIsConversation}
        isConversation={isConversation}
        isConversationRef={isConversationRef}
      />
    </View>
  );
}
export default ConversationParent;
