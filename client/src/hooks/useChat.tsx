import { useCallback } from "react";

import { Message } from "../types/Message";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { useChatMessages } from "../contexts/ChatContext";
import { nanoid } from "nanoid";
import { encryptText } from "../utils/cryptoHelpers";
import { useCrypto } from "../contexts/CryptoContext";
import { useUser } from "../contexts/UsernameContext";

export const useChat = () => {
  const { chatMessages, updateAsLocal } = useChatMessages();
  const { username } = useUser();
  const { getKey } = useCrypto();

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
      const key = getKey();

      if (!key) {
        throw new Error("Key is not available, so please set a password!");
      }

      try {
        const encrypted = await encryptText(messageText, key);

        const message: Message = {
          id: nanoid(),
          sender: username,
          ciphertext: encrypted.ciphertext,
          iv: encrypted.iv,
          timestamp: Date.now(),
        };

        // Send encrypted message over the peer connection
        sendMessage(message);

        // Add to local chat immediately
        updateAsLocal({ ...message, plaintext: messageText });
      } catch (err) {
        console.error("Encryption failed:", err);
      }
    },
    [getKey, username, sendMessage, updateAsLocal]
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
