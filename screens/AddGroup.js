import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  ChevronLeftIcon,
  HStack,
  IconButton,
  Input,
  Spacer,
} from "native-base";
import axios from "axios";
import UserListItem from "./UserListItem";
const link = "https://zolachatapp-sever.onrender.com";
import "localstorage-polyfill";
import { ChatState } from "../providers/ChatProvider";
import { useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
const AddGroup = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");
  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const nav = useNavigation();
  const handleRemove = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

  const handlerSearch = async (query) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };

      const { data } = await axios.get(
        `${link}/api/user?search=${search}`,
        config
      );
      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else {
        toast.show({
          render: () => {
            return (
              <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                Failed to load search results
              </Box>
            );
          },
        });
      }
    }
    return () => {
      source.cancel();
    };
  };
  const handleGroup = (userToAdd) => {
    console.log("1111111");
    if (selectedUsers.includes(userToAdd)) {
      toast.show({
        render: () => {
          return (
            <Box bg="amber.500" px="2" py="1" rounded="sm" mb={5}>
              User already added
            </Box>
          );
        },
      });

      return;
    }
    console.log("33333333");
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handlerSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.show({
        render: () => {
          return (
            <Box bg="amber.500" px="2" py="1" rounded="sm" mb={5}>
              Please flill all the fields
            </Box>
          );
        },
      });

      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${link}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      //onClose();
      toast.show({
        render: () => {
          return (
            <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
              {`${groupChatName} was successfully created!`}
            </Box>
          );
        },
      });

      console.log("11");
      setLoading(false);
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
              Failed to create the chat
            </Box>
          );
        },
      });
    }
  };
  return (
    <Box
      className=" flex-1 items-center p-4"
      bg={{
        linearGradient: {
          colors: ["lightBlue.600", "violet.900"],
          start: [1, 0],
          end: [0, 1],
        },
      }}
      safeArea
    >
      <HStack pt={5}>
        <IconButton
          icon={<ChevronLeftIcon color="white" />}
          onPress={() => nav.goBack()}
        ></IconButton>
        <Spacer></Spacer>
      </HStack>
      <Text className="text-3xl font-bold text-white pb-5">
        Create group chat
      </Text>
      <Input
        w={"full"}
        bgColor="white"
        fontSize={18}
        variant="filled"
        rounded={"lg"}
        placeholder="Chat Name"
        ml="1"
        mr="0.25"
        onChangeText={(e) => setGroupChatName(e)}
      />
      <Input
        w={"full"}
        bgColor="white"
        fontSize={18}
        variant="filled"
        rounded={"lg"}
        placeholder="Add more than 3 user to the group "
        ml="1"
        mr="0.25"
        mt="2"
        onChangeText={(e) => handlerSearch(e)}
      />
      <Box
        className="mt-2 "
        style={{ display: "flex", flexWrap: "wrap" }}
        w="100%"
        h="50px"
      >
        {selectedUsers.map((u) => (
          <TouchableOpacity
            className="flex-row items-center justify-center"
            onPress={() => handleRemove(u)}
          >
            <Box
              border={"1px solid white"}
              borderRadius="md"
              _hover={{ bg: "red" }}
              className="transition-colors flex-row "
              py="1"
              px="2"
              m={1}
              ml={0}
              key={u._id}
              display="flex"
              justifyContent={"center"}
              alignItems="center"
              cursor="pointer"
            >
              <Avatar size="xs" src={u.pic} />
              <Text>@{u.username}</Text>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
      {loading ? (
        <Text>loading</Text>
      ) : (
        <FlatList
          data={searchResult}
          renderItem={({ item }) => (
            <UserListItem
              key={item._id}
              user={item}
              handleFunction={() => handleGroup(item)}
            />
          )}
        ></FlatList>
      )}
      <TouchableOpacity
        onPress={() => handlerSubmit()}
        className="bg-blue-600 w-[40%] h-[50] items-center justify-center rounded-xl mt-2"
      >
        <Text className="text-xl text-white font-bold">Create</Text>
      </TouchableOpacity>
    </Box>
  );
};

export default AddGroup;
