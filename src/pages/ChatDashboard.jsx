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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden", 
      }}
    >
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden", 
          flexDirection: { xs: "column", sm: "row" }, 
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "300px" }, 
            height: { xs: "40vh", sm: "100%" }, 
            overflowY: "auto", 
            bgcolor: "background.paper",
            borderRight: { sm: "1px solid", xs: "none" },
            borderColor: "divider",
          }}
        >
          <Sidebar chats={chats} onSelectChat={setSelectedChatId} />
        </Box>

       
        <Box
          sx={{
            flexGrow: 1, 
            display: "flex",
            flexDirection: "column",
            height: { xs: "60vh", sm: "100%" },
            overflow: "hidden", 
          }}
        >
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={user?.uid}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ChatDashboard;
