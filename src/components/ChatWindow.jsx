import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Avatar, Typography, IconButton } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

function ChatWindow({ messages, onSendMessage, currentUserId }) {
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

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
        <Typography variant="h6" noWrap>
          Chat
        </Typography>
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
              flexDirection: "row",
              justifyContent: msg.senderId === currentUserId ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              marginBottom: 2,
            }}
          >
            {msg.senderId !== currentUserId && (
              <Avatar
                src={msg.senderProfileImage}
                alt={msg.senderName || "User"}
                sx={{ width: 40, height: 40, marginRight: 1 }}
              />
            )}
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
            {msg.senderId === currentUserId && (
              <Avatar
                src={msg.senderProfileImage}
                alt="You"
                sx={{ width: 40, height: 40, marginLeft: 1 }}
              />
            )}
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
