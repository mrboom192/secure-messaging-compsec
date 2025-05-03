import { useState } from "react";

import { useChatMessages } from "../contexts/ChatContext";
import { useCrypto } from "../contexts/CryptoContext";
import { useUser } from "../contexts/UsernameContext";
import ActionInput from "./ActionInput";

const ChatHeader = () => {
  const { username } = useUser();
  const { password, setPassword, deriveNewKey } = useCrypto();
  const { refreshChatMessages } = useChatMessages();
  const [previousPassword, setPreviousPassword] = useState<string>("");

  // Derived state to see if the password has changed
  const canEdit = password !== previousPassword && password;

  const handleSetPassword = async () => {
    setPreviousPassword(password);

    // Cant save password if its empty
    if (!password) return;
    try {
      const decryptionKey = await deriveNewKey(password);
      await refreshChatMessages(decryptionKey);
    } catch (error) {
      console.error("Error deriving key:", error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-2xl text-black">
        You are chatting as: {username}
      </span>
      <ActionInput
        value={password}
        onTextChange={(value) => setPassword(value)}
        onAction={handleSetPassword}
        buttonText="Set password"
        placeholder="Enter shared password"
        buttonColor="bg-emerald-400 hover:bg-emerald-500"
        disableButton={!canEdit}
      />
    </div>
  );
};

export default ChatHeader;
