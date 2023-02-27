import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  ChevronLeftIcon,
  HStack,
  Icon,
  Spacer,
  IconButton,
  Input,
  InputGroup,
  StatusBar,
  Text,
  InfoOutlineIcon,
  CloseIcon,
  useToast,
  FormControl,
  Image,
  Spinner,
  VStack,
} from "native-base";
import { io } from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import { ChatState } from "../providers/ChatProvider";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

import MessageItem from "../components/MessageItem";
import { getSender, getSenderInfo } from "../logic/ChatLogic";
import moment from "moment";
import { FontAwesome, Foundation, Octicons } from "@expo/vector-icons";
import { ImageBackground, Keyboard, Pressable, ScrollView } from "react-native";
import MessageLoading from "../loading/MessageLoading";
import "localstorage-polyfill";
import AddFriendButton from "../components/AddFriendButton";
import AttachFileModal from "../components/AttachFileModal";
let socket, selectedChatCompare;
const link = "https://zolachatapp-sever.onrender.com";

const MessageScreen = () => {
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [video, setVideo] = useState("");
  const [file, setFile] = useState("");
  const inputRef = useRef(null);
  const nav = useNavigation();
  const [toggleExpand, setToggleExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPic, setLoadingPic] = useState(false);
  const toast = useToast();
  const [image, setImage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingNewMessage, setLoadingNewMessage] = useState(false);

  const sendMessage = async (e) => {
    if (e === "Send") {
      if (user) socket.emit("stop typing", selectedChat._id);
      //inputRef.current.value = null;
      try {
        setLoadingNewMessage(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        await axios
          .post(
            `${link}/api/message`,
            {
              multiMedia: image,
              multiFile: file,
              multiVideo: video,
              content: newMessage,
              chatId: selectedChat._id,
              response: response,
            },
            config
          )
          .then((data) => {
            setImage("");
            setVideo("");
            setFile("");
            setResponse(null);
            socket.emit("new message", data.data);
            console.log(data.data);
            setMessages([...messages, data.data]);
            setLoadingNewMessage(false);
            //setFetchAgain(!fetchAgain);
          });
      } catch (error) {
        toast.show({
          title: "Error Occured!" + error,
          placement: "bottom",
        });
        setLoadingNewMessage(false);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      setLoading(true);
      await axios
        .get(`${link}/api/message/${selectedChat._id}/${1}`, config)
        .then((data) => {
          setMessages(data.data);
          localStorage.setItem("mess", JSON.stringify(data.data));
        });
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      if (axios.isCancel(err)) console.log("successfully aborted");
      else
        toast.show({
          title: "Error Occured!" + err,
          placement: "bottom",
        });
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    response,
    setResponse,
    message1,
    setMessage1,
  } = ChatState();
  useEffect(() => {
    socket = io(link);
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", (e) => {
        console.log("first:" + e);
      });
      socket.on("typing", () => {
        setIsTyping(true);
        console.log("typing....");
        //onToggle();
      });
      socket.on("stop typing", () => {
        setIsTyping(false);
        //onToggle();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("đã nhận tin nhắn:" + newMessageRecieved.content);
      let mess = JSON.parse(localStorage.getItem("mess"));
      mess.push(newMessageRecieved);
      setMessages(mess);
      localStorage.setItem("mess", JSON.stringify(mess));
    });
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e);
    //if user is typing
    if (typing === false) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timerDiff = timeNow - lastTypingTime;
      if (timerDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <Box flex="1" safeAreaTop>
      <StatusBar></StatusBar>
      <ImageBackground
        className="flex-1 w-full h-full bg-slate-400"
        source={{
          uri: getSenderInfo(user, selectedChat.users).pic
            ? getSenderInfo(user, selectedChat.users).pic
            : "no-links",
        }}
        blurRadius={100}
        loadingIndicatorSource={<Spinner></Spinner>}
      >
        <Box flex="1">
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            //colors={["rgba(238,174,202,1)", "rgba(148,187,233,1)"]}
            colors={["#1E2B6F", "rgba(0,0,0,0)"]}
            style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          >
            <Box
              display={"flex"}
              flexDirection="row"
              alignItems="center"
              zIndex={2}
              w={"100%"}
              p={2}
              opacity={0.95}
              borderRadius={0}
              textColor={"whiteAlpha.900"}
            >
              <IconButton
                mx={1}
                my={2}
                bg="none"
                w="55px"
                h="55px"
                borderRadius="full"
                display={{ base: "flex", md: "none" }}
                icon={<ChevronLeftIcon fontSize={"lg"} color="white" />}
                size="20px"
                colorScheme={"light"}
                onPress={() => {
                  selectedChat
                    ? socket.emit("outchat", selectedChat._id)
                    : console.log("out out out");
                  setSelectedChat(null);
                  nav.navigate("ChatScreen");
                }}
              />
              {selectedChat.isGroupChat ? (
                <Avatar.Group
                  _avatar={{
                    size: "sm",
                  }}
                  max={2}
                  py={0.5}
                  pl={1}
                  marginRight={3}
                  showBorder={true}
                >
                  {selectedChat.users.map((u) => (
                    <Avatar
                      key={u._id}
                      name={u.fullname}
                      source={{ uri: u.pic ? u.pic : "no-links" }}
                    />
                  ))}
                </Avatar.Group>
              ) : (
                <Avatar
                  showBorder={true}
                  size={"md"}
                  marginRight={3}
                  source={{
                    uri: getSenderInfo(user, selectedChat.users).pic
                      ? getSenderInfo(user, selectedChat.users).pic
                      : "no-links",
                  }}
                >
                  <Avatar.Badge
                    boxSize={5}
                    bg={
                      getSenderInfo(user, selectedChat.users).statusOnline
                        ? "green.500"
                        : "red.500"
                    }
                    borderColor={"white"}
                  ></Avatar.Badge>
                </Avatar>
              )}
              <Box
                opacity={0.9}
                justifyContent="center"
                alignItems={"center"}
                flex="1"
                pr="5"
              >
                {selectedChat.isGroupChat ? (
                  <Box display={"flex"} justifyContent={"center"}>
                    <Text fontSize={"lg"} color={"white"} maxWidth="200px">
                      {selectedChat.chatName}
                    </Text>

                    <Text fontWeight={"normal"} color={"white"}>
                      {selectedChat.users.length} members
                    </Text>
                  </Box>
                ) : (
                  <Box display={"flex"} justifyContent={"center"}>
                    <Text
                      fontWeight={"bold"}
                      opacity={0.9}
                      color="white"
                      maxWidth="200px"
                      w="100%"
                      isTruncated
                    >
                      {getSender(user, selectedChat.users)}
                    </Text>
                    <Text
                      fontWeight={"normal"}
                      opacity={0.9}
                      color="white"
                      maxWidth="200px"
                      w="100%"
                      isTruncated
                    >
                      {getSenderInfo(user, selectedChat.users).statusOnline
                        ? "online"
                        : "Online " +
                          moment(
                            getSenderInfo(user, selectedChat.users).updatedAt
                          ).calendar()}
                    </Text>
                  </Box>
                )}
              </Box>
              <HStack>
                <IconButton
                  mx={1}
                  my={2}
                  bg="none"
                  w="55px"
                  h="55px"
                  borderRadius="full"
                  display={{ base: "flex", md: "none" }}
                  icon={<Foundation name="video" size={24} color="white" />}
                  size="20px"
                  colorScheme={"light"}
                />
                <IconButton
                  onPress={() => {
                    if (selectedChat.isGroupChat)
                      nav.navigate("ChatDrawerNavigator");
                    else
                      nav.navigate("ChatPersonDetail", {
                        params: getSenderInfo(user, selectedChat.users),
                      });
                  }}
                  mx={1}
                  my={2}
                  bg="none"
                  w="55px"
                  h="55px"
                  borderRadius="full"
                  display={{ base: "flex", md: "none" }}
                  icon={<InfoOutlineIcon size={"lg"} color={"white"} />}
                  size="20px"
                  colorScheme={"light"}
                />
              </HStack>
            </Box>
          </LinearGradient>

          <AddFriendButton
            user={user}
            friend={getSenderInfo(user, selectedChat.users)}
            selectedChat={selectedChat}
          />

          <ScrollView className={"w-full flex-1 pr-2"}>
            {messages.length === 0 && !loading && (
              <VStack justifyContent={"center"} alignItems={"center"} my="16">
                {selectedChat.isGroupChat ? (
                  <Avatar.Group
                    _avatar={{
                      size: "sm",
                    }}
                    max={2}
                    py={0.5}
                    pl={1}
                    marginRight={3}
                    showBorder={true}
                  >
                    {selectedChat.users.map((u) => (
                      <Avatar
                        key={u._id}
                        name={u.fullname}
                        source={{ uri: u.pic ? u.pic : "no-links" }}
                      />
                    ))}
                  </Avatar.Group>
                ) : (
                  <Avatar
                    showBorder={true}
                    size={"md"}
                    marginRight={3}
                    source={{
                      uri: getSenderInfo(user, selectedChat.users).pic
                        ? getSenderInfo(user, selectedChat.users).pic
                        : "no-links",
                    }}
                  ></Avatar>
                )}
                <Box
                  opacity={0.9}
                  justifyContent="center"
                  alignItems={"center"}
                  flex="1"
                  pr="5"
                >
                  {selectedChat.isGroupChat ? (
                    <Box display={"flex"} justifyContent={"center"}>
                      <Text fontSize={"lg"} color={"white"}>
                        Say hello to {selectedChat.chatName}
                      </Text>
                    </Box>
                  ) : (
                    <Box display={"flex"} justifyContent={"center"}>
                      <Text
                        fontWeight={"bold"}
                        opacity={0.9}
                        color="white"
                        w="100%"
                      >
                        Say hello to {getSender(user, selectedChat.users)}
                      </Text>
                    </Box>
                  )}
                </Box>
              </VStack>
            )}
            {!loading ? (
              messages.map((m, i) => (
                <MessageItem key={i} messages={messages} m={m} i={i} />
              ))
            ) : (
              <MessageLoading />
            )}
          </ScrollView>

          <FormControl
            //on={sendMessage}

            isRequired
            bottom={0}
            left={0}
            pos={"relative"}
          >
            {isTyping ? (
              <HStack
                border={"1px solid black"}
                display="flex"
                posistion="absolute"
                top={0}
              >
                <Text
                  color="white"
                  fontSize={15}
                  bg={"black:alpha.50"}
                  p={2}
                  px={4}
                  borderTopRightRadius="10"
                >
                  {selectedChat.isGroupChat
                    ? "someone "
                    : selectedChat.users[0]._id !== user._id
                    ? selectedChat.users[1].fullname
                    : selectedChat.users[0].fullname}{" "}
                  is typing...
                </Text>
                <Spacer />
              </HStack>
            ) : (
              <></>
            )}
            {loadingNewMessage ? (
              <HStack
                border={"1px solid black"}
                display="flex"
                posistion="absolute"
                top={0}
              >
                <HStack
                  bg={"black:alpha.50"}
                  justifyContent="center"
                  alignItems={"center"}
                  borderTopRightRadius="10"
                  px={2}
                >
                  <Spinner color="white" accessibilityLabel="Loading message" />
                  <Text color="white" fontSize={15} p={2} px={2}>
                    sending message...
                  </Text>
                </HStack>
                <Spacer />
              </HStack>
            ) : (
              <></>
            )}
            <InputGroup w={"full"} alignItems={"center"}>
              {response && (
                <Box
                  position="absolute"
                  colorScheme="dark"
                  justifyContent={"center"}
                  alignItems="center"
                  zIndex={10}
                  flexDir="row"
                  top={-47}
                  right={0}
                  p={2}
                  pr="0"
                  pb="0"
                  borderTopRadius={"xl"}
                >
                  <Box
                    color={"white"}
                    flexDir="row"
                    justifyContent={"center"}
                    alignItems="center"
                  >
                    <Text fontWeight={"bold"}>
                      {(response?.sender._id !== user._id
                        ? "@" + response?.sender.username
                        : "You") + ": "}
                    </Text>
                    <Text className="truncate" maxW={"200px"} mx={1}>
                      {response?.content}
                    </Text>
                    <IconButton
                      zIndex={10}
                      colorScheme="dark"
                      variant="ghost"
                      icon={<CloseIcon fontSize="lg" />}
                      onPress={() => {
                        setImage("");
                        setResponse(null);
                      }}
                    ></IconButton>
                  </Box>
                </Box>
              )}
              {image !== "" && (
                <>
                  <Image
                    position="absolute"
                    top={-120}
                    right={10}
                    borderRadius="sm"
                    borderColor={"black"}
                    w="48"
                    h="48"
                    maxH="100px"
                    maxW="100px"
                    objectFit="cover"
                    alt=""
                    source={{
                      uri: image,
                    }}
                  />
                  <IconButton
                    position="absolute"
                    top={-47}
                    right={0}
                    rounded="full"
                    icon={<CloseIcon />}
                    onClick={() => setImage("")}
                  ></IconButton>
                </>
              )}
              <Input
                isDisabled={loadingNewMessage}
                flex="1"
                value={newMessage}
                variant="filled"
                onSubmitEditing={() => {
                  sendMessage("Send");
                  Keyboard.dismiss();
                }}
                onChangeText={typingHandler}
                bg={"white"}
                placeholder="Type something to your friend..."
                fontSize={"lg"}
                InputLeftElement={
                  <Box mx="2">
                    <AttachFileModal setImage={setImage} image={image} />
                  </Box>
                }
                InputRightElement={
                  <HStack mr="2">
                    <Pressable>
                      <Icon
                        as={<Octicons name="smiley" size={24} color="black" />}
                        size={5}
                        mr="2"
                        color="blue.600"
                      />
                    </Pressable>
                    <Pressable onPress={() => sendMessage("Send")}>
                      <Icon
                        as={<FontAwesome name="send" size={24} color="black" />}
                        size={5}
                        mr="2"
                        color="blue.600"
                      />
                      <Text color="blue.600">Send</Text>
                    </Pressable>
                  </HStack>
                }
              />
            </InputGroup>
          </FormControl>
        </Box>
      </ImageBackground>
    </Box>
  );
};

export default MessageScreen;
