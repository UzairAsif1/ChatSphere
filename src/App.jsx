import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/home';
import AuthPage from './pages/login';
import UserProfile from './pages/userProfilePage';
import ChatDashboard from './pages/ChatDashboard';

const App = () => {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/chats" element={<ChatDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
    </Router>
  );
};

export default App;
