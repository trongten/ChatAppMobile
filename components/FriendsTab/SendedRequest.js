import * as React from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Box,
  Text,
  Center,
  Avatar,
  Button,
  AlertDialog,
  HStack,
  Spinner,
  Heading,
  Spacer,
} from "native-base";
import { FlatList, TouchableOpacity } from "react-native";
import { ChatState } from "../../providers/ChatProvider";
import axios from "axios";
const link = "https://zolachatapp-sever.onrender.com";
export default function SendedRequest() {
  const [friends, setFriends] = React.useState([]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const { user, fecthAgain, setFetchAgain } = ChatState();
  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setLoading(true);
    axios.get(`${link}/api/friendRequest/sended`, config).then((data) => {
      setFriends(data.data[0].user);
      setLoading(false);
    });
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
      <Spacer />
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
              <Heading>Remove Friend's Request to {item.fullname}</Heading>
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
                  colorScheme="danger"
                  onPress={() => {
                    onClose();
                    setFetchAgain(!fecthAgain);
                  }}
                >
                  Remove request
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
            Loading your sent request...
          </Text>
        </HStack>
      ) : (
        <FlatList
          data={friends}
          renderItem={FriendItem}
          keyExtractor={(item) => item._id}
        ></FlatList>
      )}
    </Box>
  );
}
