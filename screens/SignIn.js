import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../providers/ChatProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import "localstorage-polyfill";
import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  KeyboardAvoidingView,
  useToast,
  VStack,
} from "native-base";
const link = "https://zolachatapp-sever.onrender.com";
const SignIn = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [email, setEmail] = useState("trongtrong099@gmail.com");
  const [password, setPassword] = useState("123");
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();
  const toast = useToast();
  //let navigate = useNavigate;
  const [show, setShow] = useState(false);
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast.show({
        title: "Please fill all field!",
        placement: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log("7");
      const { data } = await axios.post(
        `${link}/api/user/login`,
        { email, password },
        config
      );
      toast.show({
        render: () => {
          return (
            <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
              Log in successfully
            </Box>
          );
        },
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setLoading(false);
      setUser(userInfo);
      navigation.navigate("ChatNavigator");
    } catch (error) {
      console.log("3");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={Platform.OS === "ios"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        end={{ x: 0.5, y: 1 }}
        style={{
          flex: 1,
          maxWidth: "100%",
          justifyContent: "center",
          position: "relative",
        }}
        colors={["#0660AB", "#B000CD"]}
      >
        <TouchableOpacity
          className="absolute top-10 left-5 flex flex-row"
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
          <Text className="text-2xl font-bold text-white ml-3">Zola</Text>
        </TouchableOpacity>
        <View className="absolute z-20 top-1/4  w-full">
          <Text className="text-[50px] font-bold text-white w-full text-center">
            Welcome
          </Text>
          <View className="items-center w-[80%] m-auto">
            <Input
              my={5}
              variant="outline"
              className="w-full  "
              h="50px"
              fontSize={"lg"}
              color={"white"}
              placeholder="Email"
              onChangeText={(e) => setEmail(e)}
            />
            <Input
              className="w-full  "
              w="100%"
              h="50px"
              fontSize={"lg"}
              variant="outline"
              onChangeText={(e) => setPassword(e)}
              type={show ? "text" : "password"}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <Feather
                        size={24}
                        color="black"
                        name={show ? "eye-off" : "eye"}
                      />
                    }
                    size={5}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
              placeholder="Password"
            />

            <TouchableOpacity className="w-full my-2">
              <Text className="text-[20px] font-bold text-white text-right">
                forgot password, eh?
              </Text>
            </TouchableOpacity>
            <VStack className="top-[60%] w-full justify-start">
              <View className="flex-row">
                <Button
                  variant={"ghost"}
                  isLoading={loading}
                  padding="0"
                  onPress={submitHandler}
                >
                  <Text className=" text-[30px] font-bold text-white">
                    Sign In
                  </Text>
                  
                </Button>
              </View>
              <HStack alignItems={"center"}>
                <Text>don't have an account ?</Text>
                <Button
                  variant={"ghost"}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  <Text className="text-[15px] font-bold text-blue-700">
                    Sign Up
                  </Text>
                </Button>
              </HStack>
              
              <Text className="text-[30] text-white italic">For demo purpose just hit the "Sign In" button above</Text>
            </VStack>
          </View>
        </View>

        <Box className=" rounded-full -bottom-[70%]  absolute -left-2/3 items-center z-0">
          <LinearGradient
            end={{ x: 1, y: 1 }}
            style={{
              width: "100%",
              justifyContent: "center",
              borderRadius: 9999,
            }}
            colors={["#4158D0", "#C850C0", "#FFCC70"]}
          >
            <Box className="w-[800px] h-[1000px]"></Box>
          </LinearGradient>
        </Box>
        <Box className="absolute -right-1/2  rounded-lg items-center z-0 -bottom-[20%] ">
          <LinearGradient
            end={{ x: 0.5, y: 1 }}
            style={{
              width: "100%",
              justifyContent: "center",
              borderRadius: 9999,
            }}
            colors={["rgba(238,174,202,1)", "rgba(148,187,233,1)"]}
          >
            <Box className="w-[500px] h-[500px]"></Box>
          </LinearGradient>
        </Box>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
