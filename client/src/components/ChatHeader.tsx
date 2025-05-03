import { useState } from "react";
import { useCrypto } from "../contexts/CryptoContext";
import ActionInput from "./ActionInput";
import { useChatMessages } from "../contexts/ChatContext";
import { useUser } from "../contexts/UsernameContext";

const ChatHeader = () => {
  const { username } = useUser();
  const { password, setPassword, deriveNewKey } = useCrypto();
  const { refreshChatMessages } = useChatMessages();
  const [previousPassword, setPreviousPassword] = useState<string>("");

  const canEdit = password !== previousPassword;

  const handleSetPassword = async () => {
    setPreviousPassword(password);

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
        buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
        disableButton={!canEdit}
      />
    </div>
  );
};

export default ChatHeader;
