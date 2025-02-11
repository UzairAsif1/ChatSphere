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
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
} from "@mui/material";
import { MoreVert, Clear } from "@mui/icons-material";
import { query, collection, getDocs, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
import { createChat, deleteChat } from "../firebase/firestoreUtils";
import debounce from "lodash.debounce"; // Import debounce to optimize search calls

function Sidebar({ chats, onSelectChat, activeChatId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [chatMenuAnchor, setChatMenuAnchor] = useState(null);
  const [chatToDelete, setChatToDelete] = useState(null);

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
        }
      }
      setUserDetails(detailsMap);
    };

    if (chats.length) {
      fetchUserDetails();
    }
  }, [chats]);

  // Debounced search function to optimize performance
  const searchUsers = debounce(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", ">=", term), where("name", "<=", term + "\uf8ff"));
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
  }, 300); 

  useEffect(() => {
    searchUsers(searchTerm);
  }, [searchTerm]);

  const handleChatInitialization = async (userId) => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) throw new Error("User not authenticated");

      // Check if chat already exists
      const existingChat = chats.find((chat) => chat.participants.includes(userId));
      if (existingChat) {
        onSelectChat(existingChat.id);
      } else {
        const chatId = await createChat([currentUserId, userId]);
        onSelectChat(chatId);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const handleDeleteChat = async () => {
    if (chatToDelete) {
      await deleteChat(chatToDelete);
      setChatToDelete(null);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <Box sx={{ width: { xs: "100%", sm: "300px" }, height: "100%", bgcolor: "background.paper", overflowY: "auto", borderRight: { sm: "1px solid", xs: "none" }, borderColor: "divider", p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} size="small">
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
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
                <Avatar src={user.profilePicture} alt={user.name} sx={{ width: 40, height: 40 }}>
                  {!user.profilePicture ? user.name?.[0] : null}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} primaryTypographyProps={{ color: "text.primary", fontWeight: "bold" }} secondaryTypographyProps={{ color: "text.secondary" }} />
            </ListItem>
          ))}
        </List>
      )}

      <Divider sx={{ my: 1 }} />

      <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
        Active Chats
      </Typography>

      <List>
        {chats.map((chat) => {
          const currentUserId = auth.currentUser?.uid;
          const otherUserId = chat.participants.find((id) => id !== currentUserId);
          const otherUser = userDetails[otherUserId] || { name: "Loading...", profilePicture: "", status: "Loading..." };
          const isActive = chat.id === activeChatId;

          return (
            <ListItem key={chat.id} button onClick={() => onSelectChat(chat.id)} sx={{ borderRadius: "10px", bgcolor: isActive ? "primary.light" : "inherit", "&:hover": { bgcolor: isActive ? "primary.light" : "background.default" } }}>
              <ListItemAvatar>
                <Avatar src={otherUser.profilePicture} alt={otherUser.name} sx={{ width: 40, height: 40 }}>
                  {!otherUser.profilePicture ? otherUser.name?.[0] : null}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={otherUser.name} secondary={chat.lastMessage || otherUser.status} primaryTypographyProps={{ color: "text.primary", fontWeight: "bold" }} secondaryTypographyProps={{ color: "text.secondary" }} />

              {/* Three Dots Menu */}
              <IconButton onClick={(e) => setChatMenuAnchor({ anchorEl: e.currentTarget, chatId: chat.id })}>
                <MoreVert />
              </IconButton>

              <Menu anchorEl={chatMenuAnchor?.anchorEl} open={chatMenuAnchor?.chatId === chat.id} onClose={() => setChatMenuAnchor(null)}>
                <MenuItem onClick={() => { setChatToDelete(chat.id); setChatMenuAnchor(null); }}>Delete Chat</MenuItem>
              </Menu>
            </ListItem>
          );
        })}
      </List>

      <Dialog open={!!chatToDelete} onClose={() => setChatToDelete(null)}>
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>Are you sure you want to delete this chat?</DialogContent>
        <DialogActions>
          <Button onClick={() => setChatToDelete(null)}>Cancel</Button>
          <Button onClick={handleDeleteChat} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sidebar;
