import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import moment from "moment";
import {
  AlertDialog,
  Avatar,
  Box,
  Button,
  DeleteIcon,
  IconButton,
  Image,
  Pressable,
  SunIcon,
  Text,
  useColorMode,
} from "native-base";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import React, { useRef, useState } from "react";

import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUserMargin,
} from "../logic/ChatLogic";
import { ChatState } from "../providers/ChatProvider";

const link = "https://zolachatapp-sever.onrender.com";
function MessageItem({ messages, setMessages, m, i }) {
  const { user, selectedChat, setResponse } = ChatState();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);
  const [display, setDisplay] = useState(false);
  const { colorMode } = useColorMode();
  const { file, setFile } = useState("");
  const fetchMessages = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      const { data } = await axios.get(
        `${link}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setFile(data.multiFile);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  async function handleDelete(messageId) {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
        .put(
          `${link}/api/message/delete`,
          {
            messageId: messageId,
          },
          config
        )
        .then((res) => {
          console.log(user);
          console.log(res.data);
        });
      fetchMessages();
    } catch (e) {
      console.log(e);
    }
  }
  const rightSwipeActions = () => {
    return (
      <Box className="transition-opacity justify-end items-center px-5 h-fit w-full flex-row">
        <IconButton
          variant={"ghost"}
          borderRadius={"full"}
          onPress={() => {
            setResponse(m);
          }}
          icon={<Ionicons name="chatbox" size={24} color="gray" />}
        ></IconButton>
      </Box>
    );
  };
  const leftSwipeActions = () => {
    return (
      <Box className="transition-opacity justify-start items-center px-5 h-fit w-[200px] flex-row">
        <IconButton
          variant={"ghost"}
          borderRadius={"full"}
          onPress={() => {
            setResponse(m);
          }}
          icon={<Ionicons name="chatbox" size={24} color="gray" />}
        ></IconButton>
      </Box>
    );
  };
  const swipeFromRightOpen = (id) => {};
  return (
    <GestureHandlerRootView>
      <Swipeable
        friction={4}
        renderRightActions={m.sender._id !== user._id && rightSwipeActions}
        renderLeftActions={m.sender._id === user._id && leftSwipeActions}
        onSwipeableRightOpen={() => swipeFromRightOpen()}
      >
        <Pressable id={m._id} key={m._id} onPress={() => setDisplay(!display)}>
          {({ isHovered, isFocused, isPressed }) => (
            <Box
              marginBottom={1}
              display="flex"
              flexDirection={"row"}
              alignItems="center"
              position={"relative"}
              zIndex={0}
              shadow="8"
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Avatar
                  size="sm"
                  showBorder={true}
                  my="auto"
                  mx={3}
                  className={`${m.sender._id === user._id && "hidden"}`}
                  justifyContent="center"
                  alignItems={"center"}
                  source={{ uri: m.sender.pic ? m.sender.pic : "no-links" }}
                  marginTop={
                    isSameUserMargin(messages, m, i, user._id) ? 0 : 45
                  }
                />
              )}

              <Box
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.96 : 1,
                    },
                  ],
                }}
                maxWidth="75%"
                minW={"75px"}
                borderRadius="10px"
                className={`
                  transition-transform
                ${display && "border-1 bg-red-400"}
                `}
                backgroundColor={`${
                  m.sender._id === user._id ? "#BEE3F8" : "white"
                }`}
                border="1px solid"
                borderColor={"transparent"}
                padding={m?.content ? 3 : 0}
                marginLeft={isSameSenderMargin(messages, m, i, user._id)}
                marginTop={isSameUserMargin(messages, m, i, user._id) ? 0 : 15}
                position={"relative"}
              >
                {m?.response && (
                  <Box position="relative">
                    <Text
                      fontSize={"xs"}
                      textColor={
                        colorMode === "light"
                          ? "blackAlpha.900"
                          : "whiteAlpha.900"
                      }
                      position="relative"
                      top={0}
                      left={0}
                    >
                      @{m.response?.sender.username}
                    </Text>
                    <Box
                      bg="warmGray.100"
                      p={1}
                      pt={2}
                      rounded="sm"
                      display="flex"
                      opacity="0.8"
                      flexDir={"column"}
                    >
                      <Text
                        textColor={colorMode === "light" ? "black" : "white"}
                        className="truncate"
                        maxW={"150px"}
                      >
                        {m.response?.content}
                      </Text>
                      {m.response?.multiMedia && (
                        <Image
                          source={{
                            uri: m.response?.multiMedia,
                          }}
                          alt="Alternate Text"
                          size="md"
                          alignSelf={"center"}
                        />
                      )}
                    </Box>
                  </Box>
                )}
                {m.content !== "" && (
                  <Text fontSize={"md"} whiteSpace="pre-wrap">
                    {m.content}
                  </Text>
                )}
                {m.multiMedia !== "" && (
                  <Image
                    source={{
                      uri: m.multiMedia,
                    }}
                    rounded="lg"
                    alt="Alternate Text"
                    size="200"
                  />
                )}
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Text fontSize={12} marginLeft={0} textColor={"white"}>
                    {moment(m.createdAt).calendar()}
                  </Text>
                )}
                {display && (
                  <Box
                    className={` 
                w-[70px]
                absolute
                flex-row
                justify-center
                items-center
                top-0
                bottom-0 
                ${m.sender._id === user._id ? "-left-20" : "-right-20"}
                `}
                  >
                    <IconButton
                      borderRadius={"full"}
                      onPress={() => {
                        setResponse(m);
                      }}
                      icon={
                        <Ionicons
                          name="chatbox-outline"
                          size={24}
                          color="black"
                        />
                      }
                    ></IconButton>
                    <IconButton
                      opacity={m.sender._id === user._id ? 1 : 0}
                      onPress={() => setIsOpen(!isOpen)}
                      borderRadius={"full"}
                      icon={<DeleteIcon fontSize={15} />}
                    ></IconButton>
                  </Box>
                )}
                <AlertDialog
                  leastDestructiveRef={cancelRef}
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Delete This Message</AlertDialog.Header>
                    <AlertDialog.Body>
                      This action will cannot undo.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button.Group space={2}>
                        <Button
                          variant="unstyled"
                          colorScheme="coolGray"
                          onPress={onClose}
                          ref={cancelRef}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="danger"
                          onPress={() => {
                            onClose();
                            handleDelete(m._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Button.Group>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog>
              </Box>
            </Box>
          )}
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

export default MessageItem;
