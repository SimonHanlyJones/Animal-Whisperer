import * as React from "react";
import { View, StyleSheet, Button } from "react-native";
import * as Speech from "expo-speech";
import { IMessage } from "react-native-gifted-chat";
import { useEffect } from "react";

import { useChatContext } from "../../contexts/ChatContext";

interface VoiceSynthesisProps {
  isConversation: boolean;
  isConverationRef: React.MutableRefObject<boolean>;
  waitingForResponse: boolean;
  isSpeaking: boolean;
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeakingRef: React.MutableRefObject<boolean>;
  lastMessageRef: React.MutableRefObject<IMessage | undefined>;
}
export default function VoiceSynthesis(props: VoiceSynthesisProps) {
  const {
    setIsListening,
    isConversationRef,
    isSpeakingRef,
    isListeningRef,
    messageHistoryAI,
  } = useChatContext();
  const [availableVoice, setAvailableVoice] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(() => {
    checkVoiceAvailability();
  }, []);

  async function checkVoiceAvailability() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const targetVoiceIdentifier = "en-au-x-aub-network";
      // Find the specific voice identifier in the list of available voices.
      const foundVoice = voices.find(
        (voice) => voice.identifier === targetVoiceIdentifier
      );

      // If the voice is found, set it, otherwise set availableVoice to undefined.
      setAvailableVoice(foundVoice ? foundVoice.identifier : undefined);
    } catch (error) {
      console.error("Failed to fetch voices", error);
      setAvailableVoice(undefined); // Set to undefined if there's an error fetching voices
    }
  }
  useEffect(() => {
    if (!isConversationRef.current) {
      Speech.stop();
      handleSpeechDone();
    }
  }, [isConversationRef.current]);

  useEffect(() => {
    if (messageHistoryAI.length === 0) {
      console.log("Nothing to read, ending speech");
      handleSpeechDone();

      return;
    }

    // Condition to start speaking
    if (
      isConversationRef.current &&
      !isListeningRef.current &&
      !props.waitingForResponse &&
      messageHistoryAI[messageHistoryAI.length - 1].role === "assistant" &&
      isSpeakingRef.current
    ) {
      console.log("conditional passed");
      // Start speaking
      // TODO: ADD MISSING VOICE HANDLES
      Speech.speak(messageHistoryAI[messageHistoryAI.length - 1].content, {
        language: "en-AU",
        voice: "en-au-x-aub-network",
        onDone: handleSpeechDone,
        onError: handleSpeechDone, // handle errors similarly to 'onDone'
      });
    }
  }, [
    props.isConversation,
    isListeningRef,
    props.waitingForResponse,
    messageHistoryAI,
    props.setIsSpeaking,
    availableVoice,
  ]);

  const handleSpeechDone = () => {
    // Set isSpeaking to false when speech is done or if an error occurs
    props.setIsSpeaking(false);
    props.isSpeakingRef.current = false;
    if (isConversationRef.current) {
      setIsListening(true);
    }
  };

  useEffect(() => {
    // Stop speaking when component unmounts or conditions change
    return () => {
      if (props.isSpeakingRef.current) {
        Speech.stop();
      }
    };
  }, []);

  return <View></View>;
}
