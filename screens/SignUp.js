import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import "localstorage-polyfill"; //import { useToast } from "@chakra-ui/react";
import { Box, useToast } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
const link = "https://zolachatapp-sever.onrender.com";
const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [fullname, setName] = useState("");
  const [pic, setPic] = useState("");

  const [loading, setLoading] = useState(false);
  const toast = useToast();
  //let navigate = useNavigate();

  function postDetails(pics) {
    setLoading(true);
    if (pic === undefined) {
      toast.show({
        title: "Please select a picture",
        placement: "bottom",
      });
      console.log("6");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-chit");
      data.append("cloud_name", "voluu");
      fetch("https://api.cloudinary.com/v1_1/voluu/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast.show({
        title: "Please select a (another) picture",
        placement: "bottom",
      });
      console.log("7");
      setLoading(false);
      return;
    }
  }
  const submitHandler = async () => {
    setLoading(true);
    if (!fullname || !email || !password || !confirmpassword || !username) {
      toast.show({
        title: "Please fill all fields",
        placement: "bottom",
      });
      console.log("1");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast.show({
        title: "The passwords do not match",
        placement: "bottom",
      });
      console.log("2");
      return;
    } else {
      toast.show({
        title: "Sign up successfully",
        placement: "bottom",
      });
      console.log("3");
    }

    try {
      console.log("9");
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("10");
      const { data } = await axios.post(
        `${link}/api/user`,
        {
          fullname,
          username,
          email,
          password,
          pic,
        },
        config
      );
      console.log("11");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigation.navigate("SignIn");
    } catch (error) {
      toast.show({
        title: "Sign up failed " + error,
        placement: "bottom",
      });
      console.log("5 5 " + error);
    }
  };
  return (
    <View className="flex-1 bg-blue-700 max-w-full">
      <View className=" mt-[2%] items-center">
        <Text className="text-[50px] font-bold text-white">Sign Up</Text>
      </View>
      <View className="items-center mt-1">
        <TextInput
          className="border-2 w-[300px] h-[50px] p-3 mt-5 rounded-lg bg-white"
          placeholder="FullName"
          onChangeText={(e) => setName(e)}
        />

        <TextInput
          className="border-2 w-[300px] h-[50px] p-3 mt-5 rounded-lg bg-white"
          placeholder="UserName"
          onChangeText={(e) => setUsername(e)}
        />
        <TextInput
          className="border-2 w-[300px] h-[50px] p-3 mt-5 rounded-lg bg-white"
          placeholder="Email"
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          className="border-2 w-[300px] h-[50px] p-3 mt-5 rounded-lg bg-white"
          placeholder="PassWord"
          onChangeText={(e) => setPassword(e)}
        />
        <TextInput
          className="border-2 w-[300px] h-[50px] p-3 mt-5 rounded-lg bg-white"
          placeholder="re-entre Password"
          onChangeText={(e) => setConfirmPassword(e)}
        />
        <TextInput
          className="border-2 w-[300px] h-[50px] p-3 mt-5 rounded-lg bg-white"
          placeholder="Choose your Image"
          onChange={(e) => postDetails(e.target.file[0])}
        />
      </View>
      <View className=" w-[110%] h-[60%] mt-[110%]  absolute right-20 items-center ">
        <TouchableOpacity
          className="w-[120px] h-[50px] items-center mt-7"
          onPress={submitHandler}
        >
          <Text className="text-[30px] font-bold text-blue-700">Sign Up</Text>
        </TouchableOpacity>
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
    </View>
  );
};

export default SignUp;
