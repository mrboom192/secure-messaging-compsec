import { useState } from "react";

import { useChatMessages } from "../contexts/ChatContext";
import { useCrypto } from "../contexts/CryptoContext";
import { useUser } from "../contexts/UsernameContext";
import ActionInput from "./ActionInput";

const ChatHeader = () => {
  const { username } = useUser();
  const { setPassword } = useCrypto();
  const { refreshChatMessages } = useChatMessages();
  const [tempPassword, setTempPassword] = useState<string>("");
  const [previousPassword, setPreviousPassword] = useState<string>("");

  // Derived state to see if the password has changed
  const canEdit = tempPassword !== previousPassword;

  const handleSetPassword = async () => {
    setPreviousPassword(tempPassword);

    // Cant save password if its empty
    if (!tempPassword) return;
    try {
      setPassword(tempPassword);
      await refreshChatMessages();
    } catch (error) {
      console.error("Error deriving key:", error);
    }
  };

  return (
    <div className="flex flex-row gap-4 items-center justify-between">
      <span className="text-lg text-black">
        You are chatting as: {username}
      </span>
      <ActionInput
        value={tempPassword}
        onTextChange={(value) => setTempPassword(value)}
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
