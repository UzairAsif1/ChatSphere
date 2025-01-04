import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Navbar from "../components/navBar";
import Sidebar from "../components/SideBar";
import ChatWindow from "../components/ChatWindow";
import { listenToUserChats, listenToMessages, sendMessage } from "../firebase/firestoreUtils";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function ChatDashboard() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToUserChats(user.uid, setChats);
      return unsubscribe;
    }
  }, [user]);

  useEffect(() => {
    if (selectedChatId) {
      const unsubscribe = listenToMessages(selectedChatId, setMessages);
      return unsubscribe;
    }
  }, [selectedChatId]);

  const handleSendMessage = (text) => {
    if (selectedChatId && user) {
      sendMessage(selectedChatId, user.uid, text);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Please log in to access the chat.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <Navbar />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar chats={chats} onSelectChat={setSelectedChatId} />
        <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
      </Box>
    </Box>
  );
}

export default ChatDashboard;
