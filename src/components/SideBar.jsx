import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, TextField, CircularProgress, Divider } from "@mui/material";
import { query, collection, getDocs, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
import { createChat } from "../firebase/firestoreUtils";

function Sidebar({ chats, onSelectChat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const currentUserId = auth.currentUser?.uid;
      const nameMap = {};

      for (const chat of chats) {
        const otherUserId = chat.participants.find((id) => id !== currentUserId);
        if (!otherUserId) continue;

        if (!nameMap[otherUserId]) {
          const userRef = doc(db, "users", otherUserId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            nameMap[otherUserId] = userSnap.data().name;
          } else {
            nameMap[otherUserId] = "Unknown User";
          }
        }
      }

      setUserNames(nameMap);
    };

    if (chats.length) {
      fetchUserNames();
    }
  }, [chats]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatInitialization = async (userId) => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) throw new Error("User not authenticated");

      const chatId = await createChat([currentUserId, userId]);
      onSelectChat(chatId);
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "25%",
        height: "100%",
        bgcolor: "background.paper",
        overflowY: "auto",
        borderRight: "1px solid",
        borderColor: "divider",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
        Active Chats
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        sx={{ mb: 2 }}
      />
      {loading ? (
        <CircularProgress size={24} sx={{ display: "block", mx: "auto", my: 2 }} />
      ) : (
        <List>
          {searchResults.map((user) => (
            <ListItem
              key={user.id}
              button
              onClick={() => handleChatInitialization(user.id)}
              sx={{
                borderRadius: "10px",
                "&:hover": { bgcolor: "background.default" },
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.profilePicture}>{user.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={user.email}
                primaryTypographyProps={{ color: "text.primary", fontWeight: "bold" }}
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ my: 2 }} />
      <List>
        {chats.map((chat) => {
          const currentUserId = auth.currentUser?.uid;
          const otherUserId = chat.participants.find((id) => id !== currentUserId);
          const otherUserName = userNames[otherUserId] || "Loading...";

          return (
            <ListItem
              key={chat.id}
              button
              onClick={() => onSelectChat(chat.id)}
              sx={{
                borderRadius: "10px",
                "&:hover": { bgcolor: "background.default" },
              }}
            >
              <ListItemAvatar>
                <Avatar>{otherUserName[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={otherUserName}
                secondary={chat.lastMessage || "No messages yet"}
                primaryTypographyProps={{ color: "text.primary", fontWeight: "bold" }}
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default Sidebar;