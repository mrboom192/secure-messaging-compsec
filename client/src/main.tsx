import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PeerConnectionProvider } from "./contexts/PeerConnectionContext.tsx";
import { ChatMessagesProvider } from "./contexts/ChatContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChatMessagesProvider>
      <PeerConnectionProvider>
        <App />
      </PeerConnectionProvider>
    </ChatMessagesProvider>
  </StrictMode>
);
