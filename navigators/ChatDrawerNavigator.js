import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "native-base";
import React from "react";
import ChatInfoScreen from "../screens/ChatInfoScreen";
import MembersScreen from "../screens/MembersScreen";
const Stack = createNativeStackNavigator();
export default function ChatDrawerNavigator() {
  return (
    <Stack.Navigator initialRouteName="ChatInfoScreen">
      <Stack.Screen
        name="ChatInfoScreen"
        component={ChatInfoScreen}
        options={{
          headerTitle: "Chat Infomation",
          headerTintColor: "#1E2B6F",
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="MembersScreen"
        component={MembersScreen}
        options={{
          headerTitle: "Members",
          headerTintColor: "#1E2B6F",
          headerTitleAlign: "center",
          headerShadowVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}
