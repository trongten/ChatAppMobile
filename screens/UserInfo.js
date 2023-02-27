import { View, TouchableOpacity } from "react-native";
import React from "react";
import {
  Box,
  HStack,
  Avatar,
  Center,
  ScrollView,
  Text,
  Modal,
  FormControl,
  Input,
  Button,
  VStack,
  Divider,
  AlertDialog,
  useToast,
} from "native-base";
import { ChatState } from "../providers/ChatProvider";
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function UserInfo({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { user } = ChatState();
  const [isOpen, setIsOpen] = React.useState(false);
  const nav = useNavigation();
  const onClose = () => setIsOpen(false);
  const toast = useToast();
  const cancelRef = React.useRef(null);
  return (
    <Box
      flex={1}
      alignItems="center"
      safeAreaTop
      bg={{
        linearGradient: {
          colors: ["lightBlue.600", "violet.900"],
          start: [1, 0],
          end: [0, 1],
        },
      }}
    >
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>
              Do you really want to sign out
            </AlertDialog.Header>

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
                    localStorage.removeItem("userInfo");
                    toast.show({
                      render: () => {
                        return (
                          <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                            Log out successfully
                          </Box>
                        );
                      },
                    });
                    nav.navigate({ name: "SignIn" });

                    onClose();
                  }}
                >
                  Sign Out
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
      <ScrollView w="full">
        <Box height="220" w="full" mt={100} alignItems="center">
          <Box height="220" w="93%" rounded="lg" bg="white:alpha.20">
            <Center className="mt-20">
              <Text className="text-lg text-white">@{user?.username}</Text>
              <Text className="font-bold text-2xl text-white">
                {user?.fullname}
              </Text>
              <Text className="text-lg text-white">{user?.email}</Text>
            </Center>
          </Box>
        </Box>
        <Box style={{ position: "absolute" }} w="full" alignItems="center">
          <Avatar
            size="180"
            bg="green.500"
            source={{
              uri: user?.pic,
            }}
          ></Avatar>
        </Box>
        <Box mt={5} alignItems="center">
          <VStack
            divider={<Divider w="90%" m="auto" />}
            w="93%"
            bg="white:alpha.20"
            borderRadius={"xl"}
          >
            <TouchableOpacity onPress={() => navigation.navigate("ChangeInfo")}>
              <HStack alignItems="center" px={5} py={5}>
                <MaterialCommunityIcons
                  name="account-edit"
                  size={35}
                  color="white"
                />
                <Text fontSize={20} ml="2" className="text-white">
                  Change Profile
                </Text>
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <HStack alignItems="center" px={5} py={5}>
                <MaterialCommunityIcons
                  name="key-change"
                  size={35}
                  color="white"
                />
                <Text fontSize={20} ml="2" className="text-white">
                  Change Pasword
                </Text>
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
              <HStack alignItems={"center"} px={5} py={5}>
                <SimpleLineIcons name="logout" size={35} color="white" />
                <Text fontSize={20} ml="2" className="text-white">
                  Sign Out
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
