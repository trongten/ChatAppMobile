import { FlatList } from "react-native";
import React, { useState } from "react";

import {
  Box,
  HStack,
  Input,
  Text,
  Pressable,
  SearchIcon,
  StatusBar,
  useToast,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { ChatState } from "../providers/ChatProvider";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
const link = "https://zolachatapp-sever.onrender.com";
import axios from "axios";
import UserListItem from "./UserListItem";
import ChatLoading from "../loading/ChatLoading";

const SearchChat = ({ navigation }) => {
  const nav = useNavigation();
  const toast = useToast();
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${link}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      navigation.navigate("ChatScreen");
    } catch (error) {
      toast.show({
        title: "Error Occured! Cannot load Chat:" + error,
        placement: "bottom",
      });
    }
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${link}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.show({
        title: "Error Occured! Cannot load Chat Result:" + error,
        placement: "bottom",
      });
    }
  };
  return (
    <Box
      className="flex-1"
      bg={{
        linearGradient: {
          colors: ["lightBlue.600", "violet.900"],
          start: [1, 0],
          end: [0, 1],
        },
      }}
      safeAreaTop
    >
      <Box className="">
        <StatusBar />
        <Box className="w-[100%]" shadow="9">
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#1E2B6F", "rgba(0,0,0,0)"]}
            style={{
              opacity: 1,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Box className="p-5 w-full  rounded-b-[20]">
              <HStack alignItems={"center"}>
                <Pressable
                  onPress={() => nav.goBack()}
                  className="absolute p-2"
                >
                  <AntDesign name="left" size={24} color="white" />
                </Pressable>
                <Text
                  color="white"
                  className="text-2xl text-white text-center flex-1"
                >
                  Search chat
                </Text>
              </HStack>

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
                  onChangeText={(e) => handleSearch(e)}
                />
              </Box>
            </Box>
          </LinearGradient>
        </Box>
        <LinearGradient
          end={{ x: 1, y: 0.75 }}
          colors={["#0660AB", "#B000CD"]}
          style={{ borderRadius: 9999 }}
        ></LinearGradient>
      </Box>
      {!search && (
        <Box flex="1">
          <Text color="white" pl="3" fontSize="xl">
            Type some thing to search...
          </Text>
        </Box>
      )}
      {search && searchResult.length === 0 && !loading && (
        <Box flex="1">
          <Text color="white" pl="3" fontSize="xl">
            No results for "{search}"
          </Text>
        </Box>
      )}
      <Box className="items-center">
        {loading ? (
          <ChatLoading />
        ) : (
          <FlatList
            data={searchResult}
            renderItem={({ item }) => (
              <UserListItem
                key={item._id}
                user={item}
                handleFunction={() => accessChat(item._id)}
              />
            )}
          ></FlatList>
        )}
      </Box>
    </Box>
  );
};

export default SearchChat;
