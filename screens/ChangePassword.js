import { View, Text } from "react-native";
import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";

export default function ChangePassword({ navigation }) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [password3, setPassword3] = useState("");
  const nav = useNavigation();

  const [passwordVl, setPasswordVl] = useState(false);
  const [password2Vl, setPassword2Vl] = useState(false);
  const [password3Vl, setPassword3Vl] = useState(false);

  const password2V = () => {
    if (password2.length < 8) {
      setPassword2Vl(true);
    } else {
      setPassword2Vl(false);
    }
  };
  const password3V = () => {
    if (password3 != password2) {
      setPassword3Vl(true);
    } else {
      setPassword3Vl(false);
    }
  };

  const acccept = () => {
    password2V();
    password3V();
    if (!password2Vl && !password3Vl) {
    }
  };

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
        <Heading className="text-white">Change Password</Heading>
        <FormControl isRequired w="90%" className="mt-20">
          <FormControl.Label
            _text={{
              bold: true,
              color: "white",
            }}
          >
            Password
          </FormControl.Label>
          <Input
            type="password"
            size="xl"
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
          />
          <FormControl.HelperText
            _text={{
              fontSize: "xs",
              color: "white",
            }}
          ></FormControl.HelperText>{" "}
          <FormControl.Label
            _text={{
              bold: true,
              color: "white",
            }}
          >
            New Password
          </FormControl.Label>
          <Input
            isInvalid={password2Vl}
            size="xl"
            placeholder="New password"
            onChangeText={setPassword2}
            value={password2}
          />
          {!password2Vl ? (
            <FormControl.HelperText
              _text={{
                fontSize: "xs",
                color: "white",
              }}
            >
              New password should contain atleast 8 character.
            </FormControl.HelperText>
          ) : (
            <FormControl.HelperText
              _text={{
                fontSize: "xs",
                color: "danger.500",
              }}
            >
              New password should contain atleast 8 character.
            </FormControl.HelperText>
          )}
          {""}
          <FormControl.Label
            _text={{
              bold: true,
              color: "white",
            }}
          >
            Identity Password
          </FormControl.Label>
          <Input
            isInvalid={password3Vl}
            size="xl"
            placeholder="Identity password"
            onChangeText={setPassword3}
            value={password3}
          />
          {!password3Vl ? (
            <FormControl.HelperText
              _text={{
                fontSize: "xs",
                color: "white",
              }}
            >
              Identity password should contain atleast 8 character.
            </FormControl.HelperText>
          ) : (
            <FormControl.HelperText
              _text={{
                fontSize: "xs",
                color: "danger.500",
              }}
            >
              Identity password should contain atleast 8 character.
            </FormControl.HelperText>
          )}
          {"\n"}
          <Button
            variant="subtle"
            _text={{ fontWeight: "bold", fontSize: 15 }}
            onPress={acccept}
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
