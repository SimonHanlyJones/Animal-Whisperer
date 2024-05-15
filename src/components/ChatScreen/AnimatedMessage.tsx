import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { Message } from 'react-native-gifted-chat';

const AnimatedMessage = (props) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <Message {...props} />
    </Animated.View>
  );
};

export default AnimatedMessage;