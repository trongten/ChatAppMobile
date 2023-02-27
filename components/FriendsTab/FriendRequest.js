import * as React from "react";

import {
  Box,
  Text,
  Center,
  Avatar,
  Button,
  AlertDialog,
  Heading,
  Spacer,
  VStack,
  HStack,
  Spinner,
} from "native-base";
import { FlatList, TouchableOpacity } from "react-native";
import { ChatState } from "../../providers/ChatProvider";
import axios from "axios";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const link = "https://zolachatapp-sever.onrender.com";
export default function FriendRequest() {
  const [friends, setFriends] = React.useState([]);

  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => setIsOpen(false);
  const { user, fecthAgain, setFetchAgain } = ChatState();
  const cancelRef = React.useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isAcceptedSuccess, setAcceptedSuccess] = React.useState(false);
  const [isDeniedSuccess, setDeniedSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const acceptFriendRequest = async (friendRequest) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading(true);
    setAcceptedSuccess(false);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .post(
          `${link}/api/friendRequest/accept/${friendRequest.user[0]._id}`,
          { friendRequestId: friendRequest.user[0]._id },
          config
        )
        .then((data) => {
          setIsLoading(false);
          setAcceptedSuccess(false);
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);
      setAcceptedSuccess(false);
    } finally {
      setIsLoading(false);
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  const denyFriendRequest = async (friendRequest) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading(true);
    setDeniedSuccess(false);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .post(
          `${link}/api/friendRequest/denied/${friendRequest.user[0]._id}`,
          { friendRequestId: friendRequest.user[0]._id },
          config
        )
        .then((data) => {
          setIsLoading(false);
          setDeniedSuccess(false);
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);
      setDeniedSuccess(false);
    } finally {
      setIsLoading(false);
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };

  const fecthRequest = () => {
    setLoading(true);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      axios
        .get(`${link}/api/friendRequest/request`, config)
        .then((data) => {
          setFriends(data.data[0].user);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else setLoading(false);
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  React.useEffect(() => {
    fecthRequest();
  }, [fecthAgain]);
  React.useEffect(() => {
    fecthRequest();
  }, []);
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
      <Center flexDirection="row">
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
          <Text color="white" fontWeight={"bold"} fontSize={"lg"}>
            {item.fullname}
          </Text>
          <Text color="white" fontSize={"sm"}>
            @{item.username}
          </Text>
          <Text color="white">{item.email}</Text>
        </Box>
      </Center>
      <Center>
        <TouchableOpacity
          onPress={() => {
            acceptFriendRequest(item);
            setFetchAgain(!fecthAgain);
          }}
        >
          <Center>
            <FontAwesome name="check" size={24} color="teal" />
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
              <Heading>Deny {item.fullname} request</Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>This action cannot be reversed.</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2} w="full">
                <Button
                  variant="unstyled"
                  colorScheme="danger"
                  onPress={onClose}
                  ref={cancelRef}
                >
                  Cancel
                </Button>
                <Spacer />

                <Button
                  colorScheme="danger"
                  onPress={() => {
                    denyFriendRequest(item);
                    onClose();
                    setFetchAgain(!fecthAgain);
                  }}
                >
                  Deny
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
            Loading list request...
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
