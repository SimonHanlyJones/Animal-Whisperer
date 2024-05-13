import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
} from "react-native";
import { InputToolbar, GiftedChat, Bubble } from "react-native-gifted-chat";
import axios from "axios";
// import UserModal from "../components/UserModal";
// import ConvModal from "../components/ConvModal";
import AnimatedMessage from "../components/AnimatedMessage";
import TypingIndicator from "../components/TypingIndicator";

// import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { MaterialIcons } from "@expo/vector-icons";

// import KeepAwake from 'react-native-keep-awake';
import { styles } from "../styles/styles";

import { LogBox } from "react-native";
import {
  renderBubble,
  renderFooter,
  renderSend,
  customInputToolbar,
} from "../components/ChatUIComponents";

LogBox.ignoreLogs(["new NativeEventEmitter"]);

// import Voice from '@react-native-voice/voice';
// import Voice from "@react-native-community/voice";
// import Tts from "react-native-tts";
import { useChatContext } from "../contexts/ChatContext";

import ConvoStarters from "../components/ConvoStarters";

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
    messageHistoryAI,
    setMessageHistoryAI,
  } = useChatContext();

  const insets = useSafeAreaInsets();

  const handleSignIn = (user: string) => {
    setFirebaseUser(user);
    setModalUserVisible(false); // Optionally close the modal after sign-in
    // You can now use the ID token to authenticate API requests
  };

  const handleSignOut = () => {
    setFirebaseUser("");
  };

  useEffect(() => {
    // This effect ensures that anytime the isSignedIn state changes,
    // the modal visibility is updated accordingly.
    setModalUserVisible(!firebaseUser);
  }, [firebaseUser]);

  // tts config

  // function configureTTS(preferredVoice = "default") {
  //   Tts.getInitStatus()
  //     .then(() => {
  //       Tts.setDefaultLanguage("en-AU");

  //       if (preferredVoice !== "default") {
  //         Tts.setDefaultVoice(preferredVoice);
  //       }

  //       Tts.setDefaultRate(0.5);
  //       // Tts.setDefaultPitch(1.1);

  //       // Add any additional configuration as needed
  //     })
  //     .catch((error) => {
  //       // Handle TTS initialization errors
  //       console.error(error);
  //     });
  // }
  // configureTTS("en-au-x-aub-network");

  // Chat bot stuff

  // const handleTTSend = () => {
  //   setIsSpeaking(false);
  //   if (isConversationRef.current) {
  //     startListening();
  //   }
  // };

  // Tts.addEventListener("tts-finish", handleTTSend);

  // useEffect(() => {
  //   const handleTextRecognized = (
  //     recognizedText: string,
  //     firebaseUser: string
  //   ) => {
  //     console.log(recognizedText);
  //     onSend(
  //       [
  //         {
  //           _id: Math.random().toString(),
  //           text: recognizedText,
  //           createdAt: new Date(),
  //           user: {
  //             _id: 1, // User ID
  //           },
  //         },
  //       ],
  //       firebaseUser
  //     );
  //   };
  //   const onSpeechResults = (e: any) => {
  //     console.log("Speech results.");
  //     if (e.value && e.value.length > 0) {
  //       const recognizedText = e.value[0];
  //       handleTextRecognized(recognizedText, firebaseUser);
  //     }
  //     setIsListening(false);
  //   };

  //   const onSpeechError = (error) => {
  //     console.log("Speech recognition error:", error);
  //     if (error && error.error.message === "7/No match") {
  //       // Handle the timeout
  //       setIsListening(false);
  //       setIsConversation(false);
  //     }
  //   };

  //   // Set event handlers
  //   Voice.onSpeechResults = onSpeechResults;
  //   Voice.onSpeechError = onSpeechError;

  //   return () => {
  //     // Cleanup
  //     Voice.destroy().then(Voice.removeAllListeners);
  //     // speechDetectedRef.current = false;
  //   };
  // }, [firebaseUser]);

  // const requestMicrophonePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //       {
  //         title: "Microphone Permission",
  //         message:
  //           "This app needs access to your microphone for speech recognition.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK",
  //       }
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // };

  // // useEffect for stopping the conversation

  // const startConversation = () => {
  //   console.log("startConversation called");

  // const stopConversation = () => {
  //   setIsConversation(false);
  // };

  // const startListening = async () => {
  //   const hasPermission = await requestMicrophonePermission();
  //   if (hasPermission) {
  //     try {
  //       setIsListening(true);
  //       await Voice.start("en-AU");
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   } else {
  //     console.log("Microphone permission is required to use this feature.");
  //   }
  // };

  // const stopListening = async () => {
  //   try {
  //     await Voice.stop();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  useEffect(() => {
    console.log("Message History:", messageHistoryAI);
  }, [messageHistoryAI]);

  const isConversationRef = useRef(isConversation);

  // Sync the ref with the state
  // useEffect(() => {
  //   isConversationRef.current = isConversation;
  //   if (isConversation) {
  //     console.log("isConversation", isConversation);
  //     startListening(); // This will be called when isConversation becomes true
  //     //   KeepAwake.activate();
  //   }
  //   if (!isConversation) {
  //     console.log(
  //       "stopConversation called, conversation value",
  //       isConversation
  //     );
  //     stopListening(); // This will be called when isConversation becomes false
  //     Tts.stop();
  //     setIsSpeaking(false);
  //     //   KeepAwake.deactivate();
  //   }
  // }, [isConversation]);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        ...styles.safeArea,
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
          // isTyping={waitingForResponse}
          renderFooter={renderFooter}
          // bottomOffset={30}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={40}
        />
      </View>

      {/* <ConvModal
        isVisible={isConversation}
        onClose={stopConversation}
        isSpeaking={isSpeaking}
        isListening={isListening}
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
  );
}
