import React from "react";
import { ChatProvider } from "./contexts/ChatContext";
import ChatScreen from "./screens/ChatScreen";
import firebase from "firebase/app";
import TestButtons from "./components/TestButtons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { styles } from "./styles/styles";
import { SafeAreaView } from "react-native";
import { LogBox } from "react-native";
import { StatusBar } from "react-native";
LogBox.ignoreLogs(["Warning: Avatar: Support for defaultProps"]);
import ConversationParent from "./components/conversation/ConversationParent";

const App: React.FC = () => {
  return (
    <ChatProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <SafeAreaView style={styles.safeArea}>
          <ChatScreen />
          {/* <TestButtons /> */}
          <ConversationParent />
        </SafeAreaView>
      </SafeAreaProvider>
    </ChatProvider>
  );
};

export default App;
