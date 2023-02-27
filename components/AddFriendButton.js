import React, { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  Text,
  Badge,
  Box,
  Button,
  IconButton,
  Pressable,
  useToast,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { getSender, getSenderInfo, isExistInArray } from "../logic/ChatLogic";
import axios from "axios";
const link = "https://zolachatapp-sever.onrender.com";
const AddFriendButton = ({ user, selectedChat, friend }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);
  const toast = useToast();
  const fetchFriends = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .get(`${link}/api/friends`, config)
        .then((data) => setFriends(data.data));
    } catch (err) {
      if (axios.isCancel(err)) console.log("successfully aborted");
      else {
        console.log(err);
        toast.show({
          title: "Error Occured!" + err,
          placement: "bottom",
        });
      }
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };

  const sendFriendRequest = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .post(
          `${link}/api/friendRequest/${friend._id}`,
          { friendRequestId: friend._id },
          config
        )
        .then((data) => {
          setIsLoading(false);
          console.log(data.data);
          onClose();
        });
    } catch (err) {
      if (axios.isCancel(err)) console.log("successfully aborted");
      else {
        console.log(err);
        setIsLoading(false);
      }
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  return (
    selectedChat.isGroupChat === false &&
    isExistInArray(getSenderInfo(user, selectedChat.users), friends) ===
      false && (
      <>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialog.Content>
            <AlertDialog.Body>
              <Text>Send Friend Request to @{friend?.username}?</Text>
            </AlertDialog.Body>
            <AlertDialog.CloseButton />
            <AlertDialog.Footer>
              <Button ref={cancelRef} variant="ghost" onPress={onClose}>
                No
              </Button>
              <Button
                variant={"solid"}
                colorScheme="lightBlue"
                ml={3}
                onPress={sendFriendRequest}
                isLoading={isLoading}
              >
                Yes
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>

        <Pressable
          w="full"
          bg="white:alpha.25"
          display={"flex"}
          py="2"
          flexDir="row"
          justifyContent={"center"}
          alignItems="center"
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text color="white" mx="2">
            Add Friend to {getSender(user, selectedChat.users)}
          </Text>
          <FontAwesome name="user-plus" size={12} color="white" />
        </Pressable>
      </>
    )
  );
};

export default AddFriendButton;
