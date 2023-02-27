import { View, Text } from "react-native";
import React from "react";
import { ChatState } from "../providers/ChatProvider";
import { Box } from "native-base";

const ChatZone = () => {
  const { selectedChat } = ChatState();
  return (
    <Box flex="1">
      <Text>{selectedChat?.chatName}</Text>
    </Box>
  );
};

export default ChatZone;
