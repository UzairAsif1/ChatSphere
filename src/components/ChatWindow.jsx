import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

function ChatWindow({ messages, onSendMessage }) {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <Typography key={index} variant="body1" sx={{ mb: 1, color: "text.primary" }}>
            <strong>{msg.senderId}:</strong> {msg.messageText}
          </Typography>
        ))}
      </Box>
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          sx={{ mr: 2, bgcolor: "background.default", borderRadius: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default ChatWindow;
