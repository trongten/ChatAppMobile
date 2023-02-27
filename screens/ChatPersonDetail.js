import { TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Center,
  FlatList,
  Text,
  Heading,
  IconButton,
  ChevronLeftIcon,
  HStack,
} from "native-base";
import { ImageGallery } from "@georstat/react-native-image-gallery";
import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import { getSenderInfo } from "../logic/ChatLogic";
import { useNavigation } from "@react-navigation/native";
const link = "https://zolachatapp-sever.onrender.com";

export default function ChatPersonDetail({ route }) {
  const [pics, setPics] = useState([]);
  const { selectedChat, user } = ChatState();
  const nav = useNavigation();
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .get(`${link}/api/message/${selectedChat._id}`, config)
      .then((data) => {
        for (const element of data.data.reverse()) {
          if (element.multiMedia) {
            setPics((pics) => [
              ...pics,
              {
                url: element.multiMedia,
                caption: element.sender.username,
                subcaption: element.content,
              },
            ]);
          }
        }
      });
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => setIsOpen(true);
  const closeGallery = () => setIsOpen(false);
  const [index, setIndex] = useState();
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
      <HStack
        position={"relative"}
        justifyContent={"center"}
        alignItems="center"
        h="16"
        px="4"
      >
        <IconButton
          icon={<ChevronLeftIcon color="white" />}
          onPress={() => nav.goBack()}
        ></IconButton>
        <Heading flex="1" textAlign={"center"} color="white">
          User Infomation
        </Heading>
        <IconButton
          opacity={0}
          icon={<ChevronLeftIcon color="white" />}
        ></IconButton>
      </HStack>{" "}
      <Box w="full">
        <Box w="full" mt={100} alignItems="center">
          <Box height="170" w="93%" rounded="lg" bg="white:alpha.20">
            <Center className="mt-12">
              <Text className="text-lg text-white">
                @{route.params?.params.username}
              </Text>
              <Text className="font-bold text-2xl text-white">
                {route.params?.params.fullname}
              </Text>
              <Text className="text-lg text-white">
                {route.params?.params.email}
              </Text>
            </Center>
          </Box>
        </Box>
        <Box style={{ position: "absolute" }} w="full" alignItems="center">
          <Avatar
            size="140"
            source={{
              uri: route.params.params.pic
                ? route.params.params.pic
                : "no-links",
            }}
          >
            <Text className="font-bold text-7xl text-white">
              {route.params.params.fullname.charAt(0)}
            </Text>
          </Avatar>
        </Box>
        <Center w="full" mt={5}>
          <Box
            w="93%"
            rounded="lg"
            bg="white:alpha.5"
            _text={{
              fontSize: 18,
              marginTop: 1,
              marginLeft: 2,
              color: "white:alpha.90",
            }}
          >
            <Heading color="white" m="2">
              Gallery
            </Heading>
            <FlatList
              style={{
                height: 300,
              }}
              data={pics}
              numColumns={3}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setIndex(index);
                    openGallery();
                  }}
                  className="w-1/3 px-1 pb-2"
                >
                  <Image
                    className="w-full h-24 "
                    source={{ uri: item.url }}
                  ></Image>
                </TouchableOpacity>
              )}
            ></FlatList>
            {""}
          </Box>

          <ImageGallery
            close={closeGallery}
            initialIndex={index}
            isOpen={isOpen}
            images={pics}
            renderHeaderComponent={() => (
              <Box alignItems="flex-end" safeAreaTop>
                <TouchableOpacity onPress={() => closeGallery()}>
                  <Text className="text-3xl text-gray-400 mr-2">✕</Text>
                </TouchableOpacity>
              </Box>
            )}
          />
        </Center>
      </Box>
    </Box>
  );
}
