import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Center,
  FormControl,
  Box,
  Input,
  Button,
  Heading,
  HStack,
  IconButton,
  ChevronLeftIcon,
  Spacer,
} from "native-base";
import axios from "axios";
import { ChatState } from "../providers/ChatProvider";
import { useNavigation } from "@react-navigation/native";
const link = "https://zolachatapp-sever.onrender.com";
export default function ChangeInfo({ navigation }) {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const { user, setUser } = ChatState();
  useEffect(() => {
    setFullname(user.fullname);
    setUsername(user.username);
  }, []);
  const nav = useNavigation();
  async function validateUserName(value) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let error;
    if (!value) {
      error = "Username must be filled";
    } else if (
      /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/.test(value)
    )
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
          cancelToken: source.token,
        };
        await axios
          .post(
            `${link}/api/user/checkusername/:username`,
            { username: value },
            config
          )
          .then((data) => {
            console.log(data.data.username);
            if (data.data.username) error = "Username already exist";
          });
      } catch (error) {
        if (axios.isCancel(error)) console.log("successfully aborted");
      }
    else
      error =
        "Username is contain 5-18 characters and not include special characters";
    return error;
  }
  function validateFullName(value) {
    let error;
    if (!value.trim()) {
      error = "Full name must be filled";
    }
    return error;
  }

  return (
    <Center flex={1}>
      <Box
        flex={1}
        w="full"
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
        <HStack pt={5} pl="1">
          <IconButton
            icon={<ChevronLeftIcon color="white" />}
            onPress={() => nav.goBack()}
          ></IconButton>
          <Spacer></Spacer>
        </HStack>
        <Heading className="text-white">Change Infomation</Heading>
        <FormControl isRequired w="90%" className="mt-20">
          <FormControl.Label
            _text={{
              bold: true,
              color: "white",
            }}
          >
            Full Name
          </FormControl.Label>
          <Input
            size="xl"
            placeholder="Full name"
            onChangeText={setFullname}
            value={fullname}
            className="text-white"
          />
          <FormControl.HelperText
            _text={{
              fontSize: "xs",
              color: "white",
            }}
          >
            Full name should contain atleast 3 character.
          </FormControl.HelperText>
          <FormControl.ErrorMessage
            _text={{
              fontSize: "xs",
            }}
          >
            Error Full Name
          </FormControl.ErrorMessage>{" "}
          <FormControl.Label
            _text={{
              bold: true,
              color: "white",
            }}
          >
            User Name
          </FormControl.Label>
          <Input
            size="xl"
            placeholder="User name"
            onChangeText={setUsername}
            value={username}
            className="text-white"
          />
          <FormControl.HelperText
            _text={{
              fontSize: "xs",
              color: "white",
            }}
          >
            User name should contain atleast 3 character.
          </FormControl.HelperText>
          <FormControl.ErrorMessage
            _text={{
              fontSize: "xs",
            }}
          >
            User Full Name
          </FormControl.ErrorMessage>
          {"\n"}
          <Button
            variant="subtle"
            _text={{ fontWeight: "bold", fontSize: 15 }}
            onPress={() => {
              axios
                .put(
                  `${link}/api/user/update/`,
                  {
                    _id: user._id,
                    fullname: fullname,
                    username: username,
                    pic: user.pic,
                  },
                  {
                    headers: {
                      "Content-type": "application/json",
                      Authorization: `Bearer ${user.token}`,
                    },
                  }
                )
                .then((res) => {
                  setUser(res.data);
                  localStorage.setItem("userInfo", JSON.stringify(res.data));
                  console.log(res.data);
                });
            }}
          >
            Accept
          </Button>
          {""}
          <Button
            colorScheme="secondary"
            variant="subtle"
            _text={{ fontWeight: "bold", fontSize: 15 }}
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
        </FormControl>
      </Box>
    </Center>
  );
}
