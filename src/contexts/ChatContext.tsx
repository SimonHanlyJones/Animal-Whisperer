import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  ReactNode,
} from "react";

// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { IMessage, GiftedChat } from "react-native-gifted-chat";
import { animalChat } from "../firebaseServices";
import { AIMessage } from "../interfaces/chatInterfaces";
import { createSignature } from "../utilities/utilities";
import { Keyboard } from "react-native";

interface ChatContextType {
  messages: any[];
  setMessages: (value: any[]) => void;
  addMessage: (msg: any) => void;
  showConvoStarter: boolean;
  setShowConvoStarter: (value: boolean) => void;
  waitingForResponse: boolean;
  setWaitingForResponse: (value: boolean) => void;
  modalUserVisible: boolean;
  setModalUserVisible: (value: boolean) => void;
  firebaseUser: string;
  setFirebaseUser: (user: string) => void;
  isSpeaking: boolean;
  setIsSpeaking: (value: boolean) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  isConversation: boolean;
  setIsConversation: (value: boolean) => void;
  isConversationRef: React.MutableRefObject<boolean>;
  firebaseUserRef: React.MutableRefObject<string>;
  isSpeakingRef: React.MutableRefObject<boolean>;
  isListeningRef: React.MutableRefObject<boolean>;
  onSend: (messages: any) => void;
  messageHistoryAI: any[];
  setMessageHistoryAI: (value: any[]) => void;
  resetMessages: () => void;
  lastMessageRef: React.MutableRefObject<IMessage | undefined>;
  keyboardOffset: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showConvoStarter, setShowConvoStarter] = useState(true);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [modalUserVisible, setModalUserVisible] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConversation, setIsConversation] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const firebaseUserRef = useRef(firebaseUser);
  const isSpeakingRef = useRef(isSpeaking);
  const isListeningRef = useRef(isListening);
  const isConversationRef = useRef(isConversation);
  const lastMessageRef = useRef<IMessage | undefined>(undefined);
  const aiMessageStart: AIMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful animal expert named The Animal Whisperer. Your job is to help the user with all of their animal care questions. Do so in a funny, overenthusiastic, Australian manner like a famous Australian Crocodile Hunter.",
    },
  ];

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardOffset(100); // Adjust according to your footer height
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    lastMessageRef.current =
      messages.length - 1 >= 0 ? messages[messages.length - 1] : undefined;
  }, [messages]);

  const [messageHistoryAI, setMessageHistoryAI] =
    useState<AIMessage[]>(aiMessageStart);

  useEffect(() => {
    isConversationRef.current = isConversation;
  }, [isConversation]);

  // Update the ref whenever firebaseUser changes
  useEffect(() => {
    firebaseUserRef.current = firebaseUser;
  }, [firebaseUser]);

  const addMessage = (msg: any) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  };

  const onSend = async (newMessages: IMessage[] = []) => {
    // Append the user's new message immediately to ensure it shows up without delay.
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    setShowConvoStarter(false);

    if (!newMessages || !newMessages[0] || !newMessages[0].text) {
      return;
    }

    const userMessage = newMessages[0].text;
    const userMessageObj: AIMessage = { role: "user", content: userMessage };
    const updatedMessageHistoryAI = [...messageHistoryAI, userMessageObj];

    // Only update the AI message history here without setting the waitingForResponse yet.
    setMessageHistoryAI(updatedMessageHistoryAI);
    const data = updatedMessageHistoryAI;
    const timestamp = new Date().toISOString();
    const signature = createSignature(data, timestamp);
    // console.log("signature:", signature);

    try {
      // Set waitingForResponse just before making the API call.
      setWaitingForResponse(true);

      const response = await animalChat({
        messages: updatedMessageHistoryAI,
        signature: signature,
        timestamp: timestamp,
      });
      const botResponse: string = response.data;

      console.log("botResponse:", botResponse);

      const botMessageObj: AIMessage = {
        role: "assistant",
        content: botResponse,
      };

      // Batch the bot response update with the AI message history update to reduce re-renders.
      setTimeout(() => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.random().toString(),
              text: botResponse,
              createdAt: new Date(),
              user: {
                _id: 2, // Bot user ID
                name: "Bot",
              },
            },
          ])
        );
        setMessageHistoryAI((prevHistory) => [...prevHistory, botMessageObj]);
        setWaitingForResponse(false);

        // if (isConversationRef.current) {
        //   Tts.getInitStatus().then(() => {
        //     setIsSpeaking(true);
        //     Tts.speak(botResponse);
        //   });
        // }
      }, 20);
    } catch (error) {
      console.error("Error sending message to the chatbot:", error);
      setWaitingForResponse(false); // Ensure waiting indicator is turned off in case of an error
    }
  };

  const resetMessages = () => {
    setMessages([]);
    setMessageHistoryAI(aiMessageStart);
    setShowConvoStarter(true);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        addMessage,
        showConvoStarter,
        setShowConvoStarter,
        waitingForResponse,
        setWaitingForResponse,
        modalUserVisible,
        setModalUserVisible,
        firebaseUser,
        setFirebaseUser,
        isSpeaking,
        setIsSpeaking,
        isListening,
        setIsListening,
        isConversation,
        setIsConversation,
        isConversationRef,
        firebaseUserRef,
        isSpeakingRef,
        isListeningRef,
        onSend,
        messageHistoryAI,
        setMessageHistoryAI,
        resetMessages,
        lastMessageRef,
        keyboardOffset,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
