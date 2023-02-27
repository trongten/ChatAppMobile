import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import ChatInfoScreen from "../screens/ChatInfoScreen";
import ChatPersonDetail from "../screens/ChatPersonDetail";

import ChatScreen from "../screens/ChatScreen";
import Friends from "../screens/Friends";
import SettingScreen from "../screens/SettingScreen";
import UserInfo from "../screens/UserInfo";

const Tab = createMaterialBottomTabNavigator();
export default function ChatNavigator() {
  const nav = useNavigation();
  useLayoutEffect(() => {
    nav.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="ChatScreen"
      activeColor="white"
      shifting
      barStyle={{
        position: "absolute",
        backgroundColor: "#1E2B6F",
      }}
    >
      <Tab.Screen
        options={{
          tabBarLabel: "Messages",

          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses" size={24} color={color} />
          ),
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "Friend List",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={18} color={color} />
          ),
        }}
        name="Friends"
        component={Friends}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={24} color={color} />
          ),
        }}
        name="UserInfo"
        component={UserInfo}
      />
    </Tab.Navigator>
  );
}
