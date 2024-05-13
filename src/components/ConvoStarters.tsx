import { View, TouchableOpacity, Text } from "react-native";
import { useChatContext } from "../contexts/ChatContext";
import { styles } from "../styles/styles";
import React from "react";

export default function ConvoStarters() {
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
    firebaseUserRef,
    isSpeakingRef,
    isListeningRef,
    onSend,
  } = useChatContext();
  const convoStarters = [
    "G'Day Mate! I've got a big problem with some animals and I need your help!",
    "Help! My kangaroo is trying to tell me about something, but I don't understand it!",
    "Why do ostriches look so intimidating?",
    "My dog is acting a bit funny, can you help?",
    "How do I make friends with my local ducks?",
    "I'm really frustrated with my cat, can you help?",
  ];

  return (
    <View>
      {showConvoStarter && (
        <View style={styles.convoStarterContainer}>
          {convoStarters.slice(0, 6).map((starter, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSend([
                  {
                    _id: Math.random().toString(),
                    text: starter,
                    createdAt: new Date(),
                    user: {
                      _id: 1, // Adjust the user ID as needed
                    },
                  },
                ]);
              }}
              style={styles.conversationStarterButton}
            >
              <Text style={styles.conversationStarterButtonText}>
                {starter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
