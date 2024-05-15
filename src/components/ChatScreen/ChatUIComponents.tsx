import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import {
  InputToolbar,
  InputToolbarProps,
  IMessage,
  Bubble,
  BubbleProps,
  SendProps,
} from "react-native-gifted-chat";
import { MaterialIcons } from "@expo/vector-icons";
import TypingIndicator from "./TypingIndicator"; // Ensure correct path
import { styles, inputHeight } from "../../styles/styles"; // Ensure correct path
import { useChatContext } from "../../contexts/ChatContext";
export const customInputToolbar = (props: InputToolbarProps<IMessage>) => {
  return (
    <>
      <View style={styles.spacer} />
      <InputToolbar {...props} containerStyle={styles.inputToolbar} />
    </>
  );
};

// fix colour of user message
export const renderBubble = (props: BubbleProps<IMessage>) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.userBubble, // Using the defined style
        left: styles.botBubble,
      }}
      textStyle={{
        right: styles.userBubbleText, // Using the defined style
        left: styles.botBubbleText,
      }}
    />
  );
};

export const renderFooter = () => {
  const { keyboardOffset, waitingForResponse } = useChatContext();

  if (waitingForResponse) {
    return (
      <View>
        <TypingIndicator />
        <View style={{ height: keyboardOffset + inputHeight + 10 }} />
      </View>
    );
  }
  // console.log(keyboardOffset);
  return <View style={{ height: keyboardOffset + inputHeight + 10 }} />;
};

// make input bar look good with send/ start and stop convo

export const renderSend = (props: SendProps<IMessage>) => {
  const { isConversation, setIsConversation } = useChatContext();
  if (props.text && props.text.trim().length > 0) {
    return (
      <TouchableOpacity
        {...props}
        style={styles.sendButton}
        onPress={() => {
          if (props.text && props.onSend) {
            props.onSend({ text: props.text.trim() }, true);
          }
        }}
      >
        <MaterialIcons
          name="send"
          size={24}
          color="#FFF"
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={styles.conversationButton}
        onPress={() => setIsConversation(!isConversation)}
      >
        <MaterialIcons
          name={!isConversation ? "phone" : "close"}
          size={24}
          color="#FFF"
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    );
  }
};
