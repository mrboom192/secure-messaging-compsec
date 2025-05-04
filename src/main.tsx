import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import { PeerConnectionProvider } from "./contexts/PeerConnectionContext.tsx";
import { ChatMessagesProvider } from "./contexts/ChatContext.tsx";
import { CryptoProvider } from "./contexts/CryptoContext.tsx";
import { UserProvider } from "./contexts/UsernameContext.tsx";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <CryptoProvider>
        <ChatMessagesProvider>
          <PeerConnectionProvider>
            <App />
          </PeerConnectionProvider>
        </ChatMessagesProvider>
      </CryptoProvider>
    </UserProvider>
  </StrictMode>
);
