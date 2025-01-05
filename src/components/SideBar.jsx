import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import { query, collection, getDocs, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
import { createChat } from "../firebase/firestoreUtils";

function Sidebar({ chats, onSelectChat, activeChatId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({}); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUserId = auth.currentUser?.uid;
      const detailsMap = { ...userDetails }; 
      for (const chat of chats) {
        const otherUserId = chat.participants.find((id) => id !== currentUserId);
        if (!otherUserId || detailsMap[otherUserId]) continue;

        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          detailsMap[otherUserId] = {
            name: userData.name || "Unknown User",
            profilePicture: userData.profilePicture || "",
            status: userData.status || "Unavailable",
          };
        } else {
          detailsMap[otherUserId] = {
            name: "Unknown User",
            profilePicture: "",
            status: "Unavailable",
          };
        }
      }
      setUserDetails(detailsMap);
    };

    if (chats.length) {
      fetchUserDetails();
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
        width: { xs: "100%", sm: "300px" },
        height: "100%",
        bgcolor: "background.paper",
        overflowY: "auto",
        borderRight: { sm: "1px solid", xs: "none" },
        borderColor: "divider",
        p: 2,
      }}
    >
      
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
                <Avatar
                  src={user.profilePicture}
                  alt={user.name}
                  sx={{ width: 40, height: 40 }}
                >
                  {!user.profilePicture ? user.name?.[0] : null}
                </Avatar>
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

      {/* Divider */}
      <Divider sx={{ my: 1 }} />

      <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
        Active Chats
      </Typography>

      <List>
        {chats.map((chat) => {
          const currentUserId = auth.currentUser?.uid;
          const otherUserId = chat.participants.find((id) => id !== currentUserId);
          const otherUser = userDetails[otherUserId] || {
            name: "Loading...",
            profilePicture: "",
            status: "Loading...",
          };
          const isActive = chat.id === activeChatId;

          return (
            <ListItem
              key={chat.id}
              button
              onClick={() => onSelectChat(chat.id)}
              sx={{
                borderRadius: "10px",
                bgcolor: isActive ? "primary.light" : "inherit",
                "&:hover": { bgcolor: isActive ? "primary.light" : "background.default" },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={otherUser.profilePicture}
                  alt={otherUser.name}
                  sx={{ width: 40, height: 40 }}
                >
                  {!otherUser.profilePicture ? otherUser.name?.[0] : null}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={otherUser.name}
                secondary={chat.lastMessage || otherUser.status}
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
