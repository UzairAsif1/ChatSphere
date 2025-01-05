import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Avatar, Typography, IconButton, CircularProgress } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { getUserDetails } from "../firebase/firestoreUtils";

function ChatWindow({ chat, messages, onSendMessage, currentUserId }) {
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const [otherUser, setOtherUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (chat && chat.participants) {
        const otherUserId = chat.participants.find((id) => id !== currentUserId);
        try {
          const otherUserDetails = otherUserId ? await getUserDetails(otherUserId) : null;
          const currentUserDetails = currentUserId ? await getUserDetails(currentUserId) : null;
          setOtherUser(otherUserDetails || { name: "Unknown User", profilePicture: "" });
          setCurrentUser(currentUserDetails || { name: "You", profilePicture: "" });
        } catch (error) {
          console.error("Error fetching user details:", error);
          setOtherUser({ name: "Error fetching user", profilePicture: "" });
          setCurrentUser({ name: "Error fetching user", profilePicture: "" });
        }
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [chat, currentUserId]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageText((prevText) => prevText + emojiObject.emoji);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!chat) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No chat selected.
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
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {otherUser ? (
          <>
            <Avatar
              src={otherUser.profilePicture}
              alt={otherUser.name}
              sx={{ width: 40, height: 40, marginRight: 2 }}
            />
            <Typography variant="h6" noWrap>
              {otherUser.name}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" noWrap>
            Unknown User
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: msg.senderId === currentUserId ? "row-reverse" : "row",
              alignItems: "flex-end",
              marginBottom: 2,
            }}
          >
            <Avatar
              src={
                msg.senderId === currentUserId
                  ? currentUser?.profilePicture
                  : otherUser?.profilePicture
              }
              alt={
                msg.senderId === currentUserId
                  ? currentUser?.name || "You"
                  : otherUser?.name || "User"
              }
              sx={{ width: 40, height: 40, margin: msg.senderId === currentUserId ? "0 0 0 10px" : "0 10px 0 0" }}
            />
            <Box
              sx={{
                maxWidth: "60%",
                padding: "10px 15px",
                borderRadius: "10px",
                boxShadow: 1,
                backgroundColor:
                  msg.senderId === currentUserId ? "primary.main" : "background.paper",
                color: msg.senderId === currentUserId ? "primary.contrastText" : "text.primary",
                overflowWrap: "break-word",
              }}
            >
              <Typography variant="body2">{msg.messageText}</Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef}></div>
      </Box>
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          padding: 2,
          backgroundColor: "background.paper",
        }}
      >
        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <EmojiEmotionsIcon />
        </IconButton>
        {showEmojiPicker && (
          <Box
            sx={{
              position: "absolute",
              bottom: "70px",
              left: "10px",
              zIndex: 1000,
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
        <TextField
          fullWidth
          variant="outlined"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatWindow;
