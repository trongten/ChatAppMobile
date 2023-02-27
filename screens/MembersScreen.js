import { View } from "react-native";
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  IconButton,
  CheckIcon,
  CloseIcon,
  ScrollView,
  useToast,
  Badge,
  Button,
  AlertDialog,
  Center,
  Heading,
} from "native-base";
import { ChatState } from "../providers/ChatProvider";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import MemberListItem from "../components/MemberListItem";
const MembersScreen = () => {
  const { selectedChat, fetchAgain, setFetchAgain } = ChatState();
  const toast = useToast();
  const nav = useNavigation();

  return (
    <Box
      flex="1"
      w="full"
      bg={{
        linearGradient: {
          colors: ["lightBlue.600", "violet.900"],
          start: [1, 0],
          end: [0, 1],
        },
      }}
    >
      <ScrollView>
        <VStack>
          <HStack px="2" py="4" w="full" alignItems={"center"}>
            <Avatar
              mx="2"
              source={{ uri: selectedChat.chatAdmin.pic }}
              size={"md"}
            />
            <Text color="white" fontSize="20">
              {selectedChat.chatAdmin.fullname}
            </Text>
            <Badge mx="2" colorScheme="warning" width={16}>
              <Text>Admin</Text>
            </Badge>
          </HStack>
          <Divider />
          {selectedChat.users.map((u, index) => (
            <MemberListItem
              key={u._id}
              _user={u}
              chat={selectedChat}
              isAdmin={selectedChat?.chatAdmin._id === u._id}
              setFetchAgain={setFetchAgain}
              fetchAgain={fetchAgain}
            ></MemberListItem>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default MembersScreen;
