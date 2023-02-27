import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatProvider from "./providers/ChatProvider";

import { NativeBaseProvider } from "native-base";
import LoginNavigator from "./navigators/LoginNavigator";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const config = {
    dependencies: {
      "linear-gradient": LinearGradient,
    },
  };
  return (
    <NavigationContainer>
      <NativeBaseProvider config={config}>
        <ChatProvider>
          <LoginNavigator />
        </ChatProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
