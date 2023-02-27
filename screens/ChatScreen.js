import { Text, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import ChatsList from "../components/ChatsList";
import { Box, IconButton, Input, SearchIcon } from "native-base";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const link = "https://zolachatapp-sever.onrender.com";
import { io } from "socket.io-client";

let socket;
const ChatScreen = () => {
  const nav = useNavigation();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  useEffect(() => {
    fetchChats();
  }, []);
  const fetchChats = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
        cancelToken: source.token,
      };
      const { data } = await axios.get(`${link}/api/chat`, config);
      if (user) setChats(data);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else {
        console.log(error);
      }
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  useEffect(() => {
    socket = io(link);
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", (e) => {
        console.log("first:" + e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box
      className="flex-1"
      safeAreaTop
      bg={{
        linearGradient: {
          colors: ["lightBlue.600", "violet.900"],
          start: [1, 0],
          end: [0, 1],
        },
      }}
    >
      <Box
        style={{
          width: "100%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <ImageBackground
          imageStyle={{
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          source={{ uri: user.pic }}
          resizeMode="cover"
        >
          <LinearGradient
            end={{ x: 0.5, y: 1 }}
            colors={["#1E2B6F", "#193F5F"]}
            style={{
              opacity: 0.75,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Box className="p-5 w-full border-[#1E2B6F] border-[3px] border-t-0 rounded-b-[20]">
              <Box>
                <Text className="text-md text-white">@{user.username}</Text>
                <Text className="text-xl text-white font-bold">
                  {user.fullname}
                </Text>
              </Box>

              <Box
                display={"flex"}
                flexDir="row"
                justifyContent={"center"}
                alignItems="center"
                mt="5"
                mx="2"
              >
                <Input
                  w={"full"}
                  bgColor="white"
                  fontSize={18}
                  variant="filled"
                  rounded={"full"}
                  InputLeftElement={<SearchIcon size={5} ml="2" />}
                  placeholder="Search a chat"
                  ml="1"
                  mr="0.25"
                  onPressIn={() => {
                    nav.navigate("SearchChat");
                  }}
                />
                <IconButton
                  variant={"ghost"}
                  icon={
                    <MaterialIcons name="group-add" size={28} color="white" />
                  }
                  borderRadius="full"
                  onPress={() => {
                    nav.navigate("AddGroup");
                  }}
                ></IconButton>
              </Box>
            </Box>
          </LinearGradient>
        </ImageBackground>
      </Box>
      <ChatsList />
    </Box>
  );
};

export default ChatScreen;
