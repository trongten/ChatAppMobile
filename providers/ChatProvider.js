import React, { createContext, useContext, useState, useEffect } from "react";
import "localstorage-polyfill";
import { useNavigation } from "@react-navigation/native";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [notification, setNotification] = useState([]);
  const [response, setResponse] = useState(null);
  const [message1, setMessage1] = useState([]);
  const nav = useNavigation();
  const [fecthAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    //fecth local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      nav.navigate({ name: "SignIn" });
    } else nav.navigate("ChatNavigator");
  }, [nav]);

  return (
    <ChatContext.Provider
      value={{
        message1,
        fecthAgain,
        setFetchAgain,
        setMessage1,
        notification,
        response,
        setResponse,
        setNotification,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        closeSideBar,
        setCloseSideBar,
        user,
        setUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
