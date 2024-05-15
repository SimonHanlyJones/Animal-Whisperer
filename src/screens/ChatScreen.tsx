import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

// import UserModal from "../components/UserModal";

import AnimatedMessage from "../components/ChatScreen/AnimatedMessage";
import TypingIndicator from "../components/ChatScreen/TypingIndicator";

import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "../styles/styles";

import { LogBox } from "react-native";
import {
  renderBubble,
  renderFooter,
  renderSend,
  customInputToolbar,
} from "../components/ChatScreen/ChatUIComponents";
// import VoiceTest from "../components/conversation/VoiceTest";

LogBox.ignoreLogs(["new NativeEventEmitter"]);

import { useChatContext } from "../contexts/ChatContext";

import ConvoStarters from "../components/ChatScreen/ConvoStarters";

// TODO iOS FireBase Integration
// TODO waiting for response API timeout

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
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

    onSend,
  } = useChatContext();

  const insets = useSafeAreaInsets();

  // const handleSignIn = (user: string) => {
  //   setFirebaseUser(user);
  //   setModalUserVisible(false); // Optionally close the modal after sign-in
  //   // You can now use the ID token to authenticate API requests
  // };

  const handleSignOut = () => {
    setFirebaseUser("");
  };

  useEffect(() => {
    // This effect ensures that anytime the isSignedIn state changes,
    // the modal visibility is updated accordingly.
    setModalUserVisible(!firebaseUser);
  }, [firebaseUser]);

  // useEffect(() => {
  //   console.log("Message History:", messageHistoryAI);
  // }, [messageHistoryAI]);

  // const isConversationRef = useRef(isConversation);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        ...styles.safeAreaInner,
      }}
    >
      <View style={styles.header}>
        <Image
          source={require("../images/play_store_512.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Animal Whisperer</Text>
        <TouchableOpacity
          onPress={() => setModalUserVisible(true)}
          style={styles.userButton}
        >
          <MaterialIcons name="account-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => {
            onSend(newMessages);
          }}
          user={{ _id: 1 }} // Your User ID
          textInputStyle={styles.textInput}
          isTyping={waitingForResponse}
          renderFooter={renderFooter}
          bottomOffset={100}
          renderInputToolbar={customInputToolbar}
          renderAvatar={() => null}
          renderBubble={renderBubble}
          renderSend={renderSend}
          renderTime={() => null}
          renderDay={() => null}
          renderMessage={(props) => <AnimatedMessage {...props} />}
          // contentContainerStyle={{ paddingBottom: 600 }}
        />
        <ConvoStarters />
        {/* <VoiceTest /> */}
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={50}
        /> */}
        {/* <Text>{isSpeaking ? "Parent Speaking: Yes" : "Parent Speaking: No"}</Text> */}
        {/* <Text>{isListening ? "Parent Listening: Yes" : "Parent Listening: No"}</Text> */}

        {/* <UserModal
        isVisible={modalUserVisible}
        onClose={() => setModalUserVisible(false)}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onReset={resetMessages}
      /> */}
      </View>
    </View>
  );
}
