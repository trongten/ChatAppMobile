import React from "react";
import { HStack, Skeleton } from "native-base";

const ChatLoading = () => {
  return (
    <>
      <HStack opacity="30" mt="2" justifyContent={"center"} alignItems="center">
        <Skeleton m="3" w="12" h="12" rounded="full"></Skeleton>
        <Skeleton px="4" my="4" flex="1" />
      </HStack>
      <HStack opacity="25" mt="2" justifyContent={"center"} alignItems="center">
        <Skeleton m="3" w="12" h="12" rounded="full"></Skeleton>
        <Skeleton px="4" my="4" flex="1" />
      </HStack>
      <HStack opacity="20" mt="2" justifyContent={"center"} alignItems="center">
        <Skeleton m="3" w="12" h="12" rounded="full"></Skeleton>
        <Skeleton px="4" my="4" flex="1" />
      </HStack>

      <HStack opacity="10" mt="2" justifyContent={"center"} alignItems="center">
        <Skeleton m="3" w="12" h="12" rounded="full"></Skeleton>
        <Skeleton px="4" my="4" flex="1" />
      </HStack>
      <HStack opacity="5" mt="2" justifyContent={"center"} alignItems="center">
        <Skeleton m="3" w="12" h="12" rounded="full"></Skeleton>
        <Skeleton px="4" my="4" flex="1" />
      </HStack>
    </>
  );
};

export default ChatLoading;
