import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ConvModal = ({isVisible, onClose, isSpeaking, isListening}) => {
  const rotation = useRef(new Animated.Value(0)).current; // Animated.Value for rotation

  useEffect(() => {
    // Start and stop the animation based on isSpeaking
    if (isSpeaking) {
      startSpeakingAnimation();
    } else {
      Animated.timing(rotation, {
        // Reset rotation when not speaking
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isSpeaking]);

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
      ]),
    ).start();
  };

  const rotationInterpolate = rotation.interpolate({
    // Interpolate rotation values
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'], // Adjust the degree range as needed
  });

  const animatedStyle = {
    // Animated style for the image
    transform: [{rotate: rotationInterpolate}],
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
                source={require('../images/animan512.png')}
                style={[
                  styles.listeningImage,
                  isSpeaking ? animatedStyle : null,
                ]} // Apply rotation when speaking
              />

              {isListening && (
                <Text style={styles.listeningText}>I'm all ears mate</Text>
              )}
              {!isListening && !isSpeaking && (
                <Text style={styles.listeningText}>Thinking</Text>
              )}
              {!isListening && isSpeaking && (
                <Text style={styles.listeningText}> </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1, // Takes up the entire space of the modal
    justifyContent: 'center', // Centers the child vertically
    alignItems: 'center', // Centers the child horizontally
    // marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  convModalView: {
    // Define your modal view styles here
    width: 400, // Fixed width
    height: 400, // Fixed height
    margin: 20,
    backgroundColor: '#262930',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listeningImage: {
    width: 300, // Adjust based on your needs
    height: 300, // Adjust based on your needs
    marginBottom: 10,
  },
  listeningText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#dcd9ae',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
});

export default ConvModal;
