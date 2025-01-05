import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeContextProvider } from "./ThemeContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </StrictMode>
);
