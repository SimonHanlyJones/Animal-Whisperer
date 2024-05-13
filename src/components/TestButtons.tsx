import React from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { functions, animalChat } from "../firebaseServices"; // Adjust the path as necessary
import { Button, View } from "react-native";
import VoiceSynthesis from "./conversation/VoiceSynthesis";

const TestButtons = () => {
  const helloWorld = httpsCallable(functions, "helloWorld");
  const callFunctionHelloWorld = () => {
    console.log("hello world called");

    helloWorld({ text: " Text from Frontend" })
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.error("Error calling function:", error);
      });
  };

  const callFunctionAnimalChat = () => {
    console.log("animal chat called");

    animalChat({ messages: [{ role: "user", content: "Say this is a test" }] })
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.error("Error calling function:", error);
      });
  };

  return (
    <View>
      {/* <VoiceSynthesis /> */}
      <Button onPress={callFunctionHelloWorld} title="Call Hello World" />
      <Button onPress={callFunctionAnimalChat} title="Call Animal Chat" />
    </View>
  );
};

export default TestButtons;
