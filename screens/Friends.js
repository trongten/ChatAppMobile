import * as React from "react";
import { StatusBar } from "react-native";
import { Box, Center, Heading } from "native-base";
import FriendTab from "../components/FriendsTab/FriendTab";

export default function Friends() {
  return (
    <Box
      bg={{
        linearGradient: {
          colors: ["lightBlue.600", "violet.900"],
          start: [1, 0],
          end: [0, 1],
        },
      }}
      safeAreaY
      flex={1}
    >
      <StatusBar style={"auto"}></StatusBar>
      <Center w="full">
        <Heading fontSize="2xl" className="text-white">
          Friend
        </Heading>
      </Center>

      <FriendTab />
    </Box>
  );
}
