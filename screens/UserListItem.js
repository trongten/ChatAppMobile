import { Avatar, Box, Divider, Text, VStack } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";

function UserListItem({ user, handleFunction }) {
  console.log("UserListIem is rendered");
  return (
    <VStack spacing={0} cursor="pointer" opacity={0.8} width="100%">
      <TouchableOpacity onPress={handleFunction}>
        <Box
          className="transition-opacity pullRight flex-row "
          cursor="pointer"
          position="relative"
          display="flex"
          alignItems={"center"}
          justifyContent="space-between"
          flex={1}
          py="7px"
          px="15px"
          w="full"
        >
          <Avatar
            mr={2}
            size="md"
            cursor="pointer"
            name={user.username}
            source={{ uri: user.pic ? user.pic : "no-links" }}
          >
            <Text
              fontSize={35}
              fontWeight="bold"
              color="white"
              textTransform={"uppercase"}
            >
              {user.username.split("")[0]}
            </Text>
          </Avatar>
          <Box flex="1">
            <Text fontWeight={"bold"}>@{user.username}</Text>
            <Text fontSize="xs" className="truncate">
              Email: {user.email}
            </Text>
          </Box>
        </Box>
        <Divider w="95%" p="0" m="0" />
      </TouchableOpacity>
    </VStack>
  );
}

export default UserListItem;
