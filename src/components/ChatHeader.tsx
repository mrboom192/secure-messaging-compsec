import { useState } from "react";
import { useCrypto } from "../contexts/CryptoContext";
import ActionInput from "./ActionInput";
import { useChatMessages } from "../contexts/ChatContext";
import { useUser } from "../contexts/UsernameContext";

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
    <div className="flex items-center justify-between">
      <span className="text-2xl text-black">
        You are chatting as: {username}
      </span>
      <ActionInput
        value={tempPassword}
        onTextChange={(value) => setTempPassword(value)}
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
