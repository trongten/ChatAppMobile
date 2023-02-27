import * as React from "react";
import { Dimensions, StatusBar, Animated, Pressable } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { Box, useColorModeValue } from "native-base";
import FriendRequest from "./FriendRequest";
import SendedRequest from "./SendedRequest";
import ListFriend from "./ListFriend";
const initialLayout = {
  width: Dimensions.get("window").width,
};
const renderScene = SceneMap({
  first: ListFriend,
  second: FriendRequest,
  third: SendedRequest,
});

export default function FriendTab() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "first",
      title: "List Friend",
    },
    {
      key: "second",
      title: "Requests",
    },
    {
      key: "third",
      title: "Sent Requests",
    },
  ]);

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const color =
            index === i
              ? useColorModeValue("violet", "#e5e5e5")
              : useColorModeValue("white", "#a1a1aa");
          const borderColor =
            index === i
              ? "violet.500"
              : useColorModeValue("coolGray.200", "gray.400");
          return (
            <Box
              key={i}
              borderBottomWidth={1}
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="3"
              cursor="pointer"
            >
              <Pressable
                onPress={() => {
                  console.log(i);
                  setIndex(i);
                }}
              >
                <Animated.Text
                  style={{
                    color,
                    fontSize: 18,
                  }}
                >
                  {route.title}
                </Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{
        marginTop: StatusBar.currentHeight,
      }}
    />
  );
}
