import { View, TouchableOpacity, Text } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useChatContext } from "../../contexts/ChatContext";
import { styles } from "../../styles/styles";

// import SpeechRecognition from "./SpeechRecognitionEXAMPLE";
import SpeechRecognition from "./SpeechRecognition";
import VoiceSynthesis from "./VoiceSynthesis";
import ConvModal from "./ConvoModal/ConvModal";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

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
    micLevel,
    setMicLevel,
  } = useChatContext();

  const [conversationModalVisible, setConversationModalVisible] =
    useState(false);

  // TODO: implement check on permissions

  useEffect(() => {
    isConversationRef.current = isConversation;
    if (!isConversation) {
      deactivateKeepAwake();
      setIsListening(false);
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      isListeningRef.current = false;
    }
    if (isConversation) {
      activateKeepAwakeAsync();
      setIsListening(true);
      setConversationModalVisible(true);
    }
    console.log(
      "converstaion changes made",
      isConversation,
      "ref",
      isConversationRef.current,
      "isListening",
      isListening,
      "isSpeaking",
      isSpeaking
    );
  }, [isConversation]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (isListening !== isListeningRef.current && isListening) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    if (isListening !== isListeningRef.current && !isListening) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    isListeningRef.current = isListening;
  }, [isListening]);

  const handleCloseConversationModal = () => {
    setConversationModalVisible(false);
    setIsConversation(false);
    isConversationRef.current = false;
  };

  // const [partialText, setPartialText] = useState("");

  // const handlePartialResult = (text: string) => {
  //   setPartialText(text); // Update state with partial result
  //   // console.log("Partial voice recognition result:", text); // Log partial result
  // };

  // const toggleListening = () => {
  //   console.log("triggering");
  //   setIsListening(!isListening); // Toggle the listening state
  //   if (!isListening) {
  //     console.log("Starting voice recognition...");
  //     console.log("Partial Text:", partialText); // Log existing partial text if any
  //   } else {
  //     console.log("Stopping voice recognition...");
  //   }
  // };

  return (
    <View>
      <SpeechRecognition />
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
        micLevel={micLevel}
      />
    </View>
  );
}
export default ConversationParent;
