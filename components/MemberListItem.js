import { View } from "react-native";
import React from "react";
import {
  AlertDialog,
  Text,
  Avatar,
  Badge,
  Button,
  Center,
  CloseIcon,
  HStack,
  IconButton,
  useToast,
  VStack,
  Heading,
  Divider,
} from "native-base";
import { Octicons } from "@expo/vector-icons";
import { ChatState } from "../providers/ChatProvider";
const link = "https://zolachatapp-sever.onrender.com";

const MemberListItem = ({
  chat,
  _user,
  isAdmin,
  handleFuction,
  setFetchAgain,
  fecthAgain,
}) => {
  const { selectedChat, user } = ChatState();
  const toast = useToast();
  const cancelRef = React.useRef();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  const [isOpenRemoveDialog, setIsOpenRemoveDialog] = React.useState(false);
  const onCloseRemoveDialog = () => setIsOpenRemoveDialog(false);
  const handleRemove = async () => {
    if (selectedChat.chatAdmin._id !== user._id && _user._id !== user._id) {
      toast({
        title: "Only admins can remove member(s)",
        description: "error",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
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

      const { data } = await axios.put(
        `${link}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: _user._id,
        },
        config
      );
      _user._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
              Failed to remove: {error.message}
            </Box>
          );
        },
      });
      setLoading(false);
    }
  };
  async function handleChangeAdmin(_user) {
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
        .put(
          `${link}/api/chat/changeAdmin`,
          {
            chatId: selectedChat._id,
            userId: _user._id,
          },
          config
        )
        .then((data) => data.data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else
        toast.show({
          render: () => {
            return (
              <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
                Failed to promote: {error.message}
              </Box>
            );
          },
        });
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  }
  return (
    <HStack px="2" py="4" w="full" alignItems={"center"}>
      {/* Promte Dialog */}
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>
              <Heading>Promote {_user.fullname} to be Admin</Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text>
                This will promote {_user.fullname} to become an Admin of group.
              </Text>
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
                  colorScheme="warning"
                  onPress={() => {
                    onClose();
                    handleChangeAdmin(_user);
                  }}
                >
                  Promote
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
      {/* Remove Dialog */}
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpenRemoveDialog}
          onClose={onCloseRemoveDialog}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>
              <Heading>Remove {_user.fullname} to be Admin</Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text>This will remove {_user.fullname} out of group.</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onCloseRemoveDialog}
                  ref={cancelRef}
                >
                  Cancel
                </Button>
                <Button colorScheme="danger" onPress={onCloseRemoveDialog}>
                  Remove
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
      {/* Avatar */}
      <Avatar mx="2" source={{ uri: _user?.pic }} size={"md"} />
      <VStack flex="1">
        {selectedChat?.chatAdmin._id === _user._id ? (
          <Badge colorScheme="warning" width={16}>
            <Text>Admin</Text>
          </Badge>
        ) : (
          <Badge colorScheme="coolGray" width={16}>
            <Text>Member</Text>
          </Badge>
        )}
        <Text color="white" fontSize="12">
          @{_user.username}
        </Text>
        <Text color="white" fontSize="20" flex="1">
          {_user.fullname}
        </Text>
      </VStack>
      {user._id === selectedChat.chatAdmin._id && (
        <>
          <IconButton
            onPress={() => setIsOpen(!isOpen)}
            variant={"ghost"}
            icon={<Octicons name="star-fill" size={24} color="yellow" />}
          ></IconButton>
          <IconButton
            onPress={() => setIsOpenRemoveDialog(!isOpenRemoveDialog)}
            variant={"ghost"}
            icon={<CloseIcon size={5} color="red.500" />}
          ></IconButton>
        </>
      )}
    </HStack>
  );
};

export default MemberListItem;
