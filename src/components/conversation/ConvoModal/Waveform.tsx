import React, { useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import Svg, { Rect } from "react-native-svg";

const Waveform = ({ micLevel, isListening, numBars = 5 }) => {
  const [barLevels, setBarLevels] = useState(Array(numBars).fill(0));
  const animatedValues = useRef(barLevels.map(() => new Animated.Value(0)));
  const firstUpdate = useRef(true);

  // Function to normalize mic levels from -2 to 10 to a 0-1 range
  const normalizeMicLevel = (level) => {
    return (level + 2) / 12;
  };

  // Initialize bar heights once on component mount
  useEffect(() => {
    animatedValues.current = barLevels.map(
      (level) => new Animated.Value(normalizeMicLevel(level) * 100)
    );
  }, [numBars]);

  // Effect for updating bar levels
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const newLevels = [normalizeMicLevel(micLevel), ...barLevels.slice(0, -1)];
    setBarLevels(newLevels);
  }, [micLevel]);

  // Effect for handling animations
  useEffect(() => {
    if (!isListening) {
      setBarLevels(Array(numBars).fill(0)); // Reset when not listening
    }

    barLevels.forEach((level, index) => {
      Animated.timing(animatedValues.current[index], {
        toValue: level * 100,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });
  }, [barLevels, isListening]);

  return (
    <View style={styles.container}>
      <Svg height="100" width={40 * numBars}>
        {animatedValues.current.map((value, index) => (
          <AnimatedRect
            key={index}
            x={index * 40} // Position bars from left to right
            y={Animated.subtract(100, value)}
            width="30"
            height={value}
            fill="white"
          />
        ))}
      </Svg>
    </View>
  );
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Optional background color
  },
});

export default Waveform;
