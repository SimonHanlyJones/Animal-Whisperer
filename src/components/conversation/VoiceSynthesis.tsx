import * as React from "react";
import { View, StyleSheet, Button } from "react-native";
import * as Speech from "expo-speech";
import { IMessage } from "react-native-gifted-chat";
import { useEffect } from "react";

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
    if (!props.isSpeakingRef.current) {
      Speech.stop();
    }
  }, [props.isSpeakingRef.current]);

  useEffect(() => {
    if (!props.lastMessageRef.current) return;
    console.log(
      "HERE",
      props.isConversation,
      props.waitingForResponse,
      props.isSpeakingRef.current,
      props.lastMessageRef.current
    );

    // Condition to start speaking
    if (
      props.isConversation &&
      !props.waitingForResponse &&
      props.lastMessageRef.current &&
      props.lastMessageRef.current.user._id === 2 &&
      !props.isSpeakingRef.current
    ) {
      props.setIsSpeaking(true);
      props.isSpeakingRef.current = true;

      // Start speaking
      Speech.speak(lastMessage.text, {
        language: "en-AU",
        voice: availableVoice,
        onDone: handleSpeechDone,
        onError: handleSpeechDone, // handle errors similarly to 'onDone'
      });
    }
  }, [
    props.isConversation,
    props.waitingForResponse,
    props.messages,
    props.setIsSpeaking,
  ]);
  async function speak(message: string) {
    Speech.speak(message, {
      language: "en-AU",
      voice: "en-au-x-aub-network",
    });
  }

  const handleSpeechDone = () => {
    // Set isSpeaking to false when speech is done or if an error occurs
    props.setIsSpeaking(false);
    props.isSpeakingRef.current = false;
  };

  useEffect(() => {
    // Stop speaking when component unmounts or conditions change
    return () => {
      if (props.isSpeakingRef.current) {
        Speech.stop();
      }
    };
  }, []);

  return (
    <View>
      {/* <Button title="Press to hear some words" onPress={speakTest} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});
