import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { styles } from "../../styles/styles";
import { useChatContext } from "../../contexts/ChatContext";

const TypingIndicator = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.thinkingContainer}>
      <Animated.View style={[styles.thinkingDot, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.thinkingDot, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.thinkingDot, { opacity: fadeAnim }]} />
    </View>
  );
};

export default TypingIndicator;
