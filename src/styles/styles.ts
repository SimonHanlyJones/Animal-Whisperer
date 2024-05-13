import { StyleSheet } from "react-native";

const headerColour = "#B89842";
const backgroundColour = "#aeab8a";
const titleColour = "#ffffff";
const userBubblesColour = "#262930";
const botBubblesColour = "#d7d2a8";
const footerColour = "#B89842";
const buttonColour1 = "#B89842";
const buttonColour2 = "#262930";
const textParchment = "#dcd9ae";
const textDark = "#602D0D";
export const inputHeight = 10;
const basicTextSize = 16;

export const styles = StyleSheet.create({
  thinkingContainer: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  thinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginHorizontal: 3,
  },
  spacer: {
    padding: 100,
  },
  iconStyle: {
    justifyContent: "center", // Centers children along the main axis (for 'column' direction, which is default)
    alignItems: "center",
  },
  logo: {
    width: 50, // Set your logo's width
    height: 50, // Set your logo's height
    resizeMode: "contain", // Keep the logo's aspect ratio
  },
  safeArea: {
    flex: 1,
    // backgroundColor: "black",
  },
  safeAreaInner: {
    flex: 1,
    // backgroundColor: "black",
  },
  userButton: {
    backgroundColor: buttonColour1,
    padding: 5,
    borderRadius: 30,
  },

  inputToolbar: {
    backgroundColor: footerColour,
    paddingHorizontal: 10,
    // height: 20,
    paddingVertical: inputHeight,
    // position: "relative",
    // bottom: 50,
  },
  textInput: {
    backgroundColor: userBubblesColour,
    borderRadius: 20,
    fontSize: basicTextSize,
    color: textParchment,
    paddingVertical: 10,
    paddingHorizontal: 15,
    lineHeight: 20,
    marginBottom: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    backgroundColor: headerColour,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: titleColour,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: backgroundColour, // Olive for the chat container to focus on the Olive and Tan theme
  },

  userBubble: {
    backgroundColor: userBubblesColour, // Tan for the user's chat bubbles, maintaining the focus on Tan and Olive
  },
  userBubbleText: {
    color: textParchment, // White for the text inside the bubbles for readability
    fontSize: basicTextSize,
  },
  botBubble: {
    backgroundColor: botBubblesColour, // Tan for the user's chat bubbles, maintaining the focus on Tan and Olive
    minWidth: "90%", // Minimum width set to 90% of the screen width
    maxWidth: "90%",
  },
  botBubbleText: {
    color: textDark, // White for the text inside the bubbles for readability
    fontSize: basicTextSize,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    backgroundColor: buttonColour1,
    marginLeft: 5,
  },
  conversationButton: {
    marginRight: 10,
    marginBottom: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    backgroundColor: buttonColour2, // Baby Blue for the conversation button, using the accent color to highlight this feature
    marginLeft: 5,
  },
  convoStarterContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    right: 10,
  },
  conversationStarterButton: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    // paddingVertical: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    backgroundColor: buttonColour2,
  },
  conversationStarterButtonText: {
    color: textParchment,
    fontSize: 16,
    // fontWeight: 'bold',
  },
});
