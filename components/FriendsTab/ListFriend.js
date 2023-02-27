import * as React from "react";

import {
  Box,
  Text,
  Center,
  Avatar,
  Button,
  AlertDialog,
  useToast,
  Heading,
  Spinner,
  HStack,
  VStack,
} from "native-base";
import { FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { ChatState } from "../../providers/ChatProvider";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getSenderInfo } from "../../logic/ChatLogic";
const link = "https://zolachatapp-sever.onrender.com";
export default function ListFriend() {
  const [friends, setFriends] = React.useState([]);
  const toast = useToast();

  const [isOpen, setIsOpen] = React.useState(false);
  const nav = useNavigation();
  const [loadingUnfriend, setLoadingUnfriend] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    setChats,
    chats,
    fecthAgain,
    setFetchAgain,
  } = ChatState();
  const cancelRef = React.useRef(null);
  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${link}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      nav.navigate("MessageScreen");
    } catch (error) {
      toast.show({
        title: "Error Occured! Cannot load Chat:" + error,
        placement: "bottom",
      });
    }
  };
  const unfriendHandler = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setLoading(true);
    setLoadingUnfriend(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .post(
          `${link}/api/friends/deletefriend/${user._id}`,
          { friendRequestId: user._id },
          config
        )
        .then((data) => {
          setLoading(false);
          setLoadingUnfriend(false);
          onClose();
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else {
        console.log(error);
        setLoading(false);
        setLoadingUnfriend(false);
      }
    } finally {
      setLoading(false);
      setLoadingUnfriend(false);
      onClose();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
      setLoading(false);
      setLoadingUnfriend(false);
    };
  };
  const fecthList = () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .get(`${link}/api/friends`, config)
      .then((data) => {
        setFriends(data.data);
        setLoading(false);
      })
      .then((err) => setLoading(false));
  };
  React.useEffect(() => {
    fecthList();
  }, []);

  React.useEffect(() => {
    fecthList();
  }, [fecthAgain]);

  const FriendItem = ({ item }) => (
    <Box
      key={item._id}
      w="full"
      rounded="lg"
      flexDirection="row"
      justifyContent="space-between"
      mb={1}
      bg="white:alpha.20"
      p={4}
    >
      <Box flexDirection="row" flex={1}>
        <Avatar
          mr={2}
          size="lg"
          bg="green.500"
          source={{
            uri: item.pic ? item.pic : "no-links",
          }}
        >
          {item.fullname.split("")[0]}
        </Avatar>
        <Box>
          <Box>
            <Text color="white" fontWeight={"bold"} fontSize={"lg"}>
              {item.fullname}
            </Text>
            <Text color="white" fontSize={"sm"}>
              @{item.username}
            </Text>
            <Text color="white">{item.email}</Text>
          </Box>
        </Box>
      </Box>
      <Center px="2">
        <TouchableOpacity
          onPress={() => {
            selectedChat
              ? io("https://zolachatapp-sever.onrender.com").emit(
                  "outchat",
                  selectedChat._id
                )
              : console.log("out out out");
            accessChat(item._id);
          }}
        >
          <Center opacity={50}>
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
          </Center>
        </TouchableOpacity>
      </Center>
      <Center>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <Center>
            <MaterialCommunityIcons
              name="close-thick"
              size={24}
              color="darkred"
            />
          </Center>
        </TouchableOpacity>
      </Center>
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>
              <Heading>Unfriend with {item.fullname}</Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>This action cannot be reversed.</AlertDialog.Body>
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
                  isLoading={loadingUnfriend}
                  colorScheme="danger"
                  onPress={() => {
                    unfriendHandler();
                    setFetchAgain(!fecthAgain);
                    onClose();
                  }}
                >
                  Unfriend
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    </Box>
  );

  return (
    <Box mt={1} flex={1} ml={2} mr={2}>
      {loading ? (
        <HStack justifyContent={"center"} alignItems="center">
          <Spinner color={"white"} />
          <Text color={"white"} fontSize="lg">
            Loading list friend...
          </Text>
        </HStack>
      ) : friends.length !== 0 ? (
        <FlatList
          data={friends}
          renderItem={FriendItem}
          keyExtractor={(item) => item._id}
        ></FlatList>
      ) : (
        <VStack opacity={50} justifyContent={"center"} alignItems="center">
          <FontAwesome5 name="clipboard-list" size={120} color="white" />
          <Text color={"white"} fontSize="xl" fontWeight={"bold"}>
            The list is empty
          </Text>
        </VStack>
      )}
    </Box>
  );
}
