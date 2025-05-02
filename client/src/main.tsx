import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PeerConnectionProvider } from "./contexts/PeerConnectionContext.tsx";
import { ChatMessagesProvider } from "./contexts/ChatContext.tsx";
import { CryptoProvider } from "./contexts/CryptoContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CryptoProvider>
      <ChatMessagesProvider>
        <PeerConnectionProvider>
          <App />
        </PeerConnectionProvider>
      </ChatMessagesProvider>
    </CryptoProvider>
  </StrictMode>
);
