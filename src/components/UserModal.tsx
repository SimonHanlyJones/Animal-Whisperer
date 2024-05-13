import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const UserModal = ({isVisible, onClose, onSignIn, onSignOut, onReset}) => {
  const [signedIn, setSignedIn] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        if (onSignIn) {
          onSignIn(firebaseUser);
        }
        setSignedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Google first
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
  
      // Then, sign out from Firebase
      await auth().signOut();
  
      // Update your component's state
      setSignedIn(false);
  
      // Optional: Call onSignOut callback if provided
      if (onSignOut) {
        onSignOut();
      }
  
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.centeredView}>
      <TouchableWithoutFeedback onPress={() => {}}>
      <View style={styles.modalView}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.modalHeading}>Account</Text>

        {signedIn ? (
          <>
            <Text style={styles.thankYouText}>You are signed in</Text>
            <TouchableOpacity onPress={signOut} style={styles.button}>
              <MaterialIcons name="logout" size={20} color="white" />
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.thankYouText}>
              Please sign in to speak to the Animal Whisperer
            </Text>
            <TouchableOpacity onPress={signInWithGoogle} style={styles.button}>
              <MaterialIcons name="login" size={20} color="white" />
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={onReset} style={styles.button}>
          <MaterialIcons name="restore" size={20} color="white" />
          <Text style={styles.buttonText}>Reset Chat History</Text>
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
    paddingTop: 22,
  },
  modalView: {
    width: 400, // Fixed width
    height: 300, // Fixed height, adjust as needed
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    opacity: 0.9,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Ensure text is visible on black background
    marginBottom: 20,
  },
  thankYouText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20, // Add some bottom margin for spacing
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center items vertically within the button
    backgroundColor: '#B89842', // Use a more visible color for buttons
    padding: 10,
    borderRadius: 20,
    marginTop: 10, // Add some top margin for spacing between buttons
  },
  buttonText: {
    color: 'white',
    marginLeft: 10, // Add some space between the icon and the text
  },
});

export default UserModal;
