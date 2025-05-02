import { useCallback } from "react";

import { Message } from "../types/Message";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { useChatMessages } from "../contexts/ChatContext";
import { nanoid } from "nanoid";
import { encryptText } from "../utils/cryptoHelpers";
import { useCrypto } from "../contexts/CryptoContext";

export const useChat = () => {
  const { chatMessages, updateChatMessages } = useChatMessages();
  const { currentUserName } = usePeerConnection();
  const { key } = useCrypto();

  const {
    mode,
    isConnected,
    localConnectionDescription,
    startAsHost,
    startAsParticipant,
    setRemoteConnectionDescription,
    sendMessage,
  } = usePeerConnection();

  const sendTextChatMessage = useCallback(
    async (messageText: string) => {
      if (!key) {
        console.warn("Please set a password to encrypt the message.");
        return;
      }

      try {
        const encrypted = await encryptText(messageText, key);

        const message: Message = {
          id: nanoid(),
          sender: currentUserName,
          ciphertext: encrypted.ciphertext,
          iv: encrypted.iv,
          timestamp: Date.now(),
        };

        // Send encrypted message over the peer connection
        sendMessage(message);

        // Add to local chat immediately
        updateChatMessages({ ...message, plaintext: messageText });
      } catch (err) {
        console.error("Encryption failed:", err);
      }
    },
    [key, currentUserName, sendMessage, updateChatMessages]
  );

  return {
    mode,
    isConnected,
    localConnectionDescription,
    chatMessages,
    startAsHost,
    startAsParticipant,
    setRemoteConnectionDescription,
    sendTextChatMessage,
  };
};
