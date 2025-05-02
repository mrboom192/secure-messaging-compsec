import { useState } from "react";
import { useCrypto } from "../contexts/CryptoContext";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import ActionInput from "./ActionInput";

const ChatHeader = () => {
  const { currentUserName } = usePeerConnection();
  const { password, setPassword, deriveNewKey } = useCrypto();
  const [previousPassword, setPreviousPassword] = useState<string>("");

  const canEdit = password !== previousPassword;

  const handleSetPassword = async () => {
    setPreviousPassword(password);

    if (!password) return;
    try {
      await deriveNewKey(password);
    } catch (error) {
      console.error("Error deriving key:", error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-2xl text-black">
        You are chatting as: {currentUserName}
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
