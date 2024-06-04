import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../styles/styles";
import { useChatContext } from "../../../contexts/ChatContext";
// import Waveform from "./Waveform";
const ConvModal = ({ isVisible, onClose }) => {
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

  const rotation = useRef(new Animated.Value(0)).current; // Animated.Value for rotation

  useEffect(() => {
    // Start and stop the animation based on isSpeaking
    if (isSpeaking && !waitingForResponse) {
      startSpeakingAnimation();
    } else {
      Animated.timing(rotation, {
        // Reset rotation when not speaking
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isSpeaking, waitingForResponse]);

  const startSpeakingAnimation = () => {
    // Animation function for speaking
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const rotationInterpolate = rotation.interpolate({
    // Interpolate rotation values
    inputRange: [-1, 1],
    outputRange: ["-10deg", "10deg"], // Adjust the degree range as needed
  });

  const animatedStyle = {
    // Animated style for the image
    transform: [{ rotate: rotationInterpolate }],
  };

  const handleStartChatting = () => {
    setIsConversation(true);

    isConversationRef.current = true; // Assuming you have ensured it's not null
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.convModalView}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              {/* Image is always rendered, but animation and additional text only apply when listening or speaking */}
              <Animated.Image
                source={require("../../../images/animan512.png")}
                style={[
                  styles.listeningImage,
                  isSpeaking ? animatedStyle : null,
                ]} // Apply rotation when speaking
              />

              <Text style={styles.listeningText}>
                {isListening
                  ? "I'm all ears mate"
                  : waitingForResponse
                  ? "Thinking"
                  : !isConversation
                  ? "Press the phone to start chatting mate"
                  : ""}
              </Text>
              {/* <View style={localStyles.micContainer}>
                <MaterialIcons
                  name="mic"
                  size={50}
                  color={isListening ? "white" : "gray"}
                />
                {isListening && <Waveform micLevel={micLevel} />}
              </View> */}
              <TouchableOpacity
                style={styles.conversationButton}
                onPress={() => setIsConversation(!isConversation)}
              >
                <MaterialIcons
                  name={!isConversation ? "phone" : "stop"}
                  size={24}
                  color="#FFF"
                  style={styles.iconStyle}
                />
                {/* <Waveform
                  micLevel={micLevel}
                  isListening={isListening}
                  numBars={5}
                /> */}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  textContainer: {
    height: 30, // Adjust the height as needed to fit your text
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  micContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  micLevelText: {
    fontSize: 20,
    marginLeft: 10,
    color: "black",
  },
});

export default ConvModal;
