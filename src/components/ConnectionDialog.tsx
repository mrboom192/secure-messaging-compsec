import { Dialog, DialogPanel } from "@headlessui/react";
import Button from "./Button";
import {
  PEER_CONNECTION_MODE,
  usePeerConnection,
} from "../contexts/PeerConnectionContext";
import ActionInput from "./ActionInput";
import { useChat } from "../hooks/useChat";
import { useState } from "react";

const ConnectionDialog = () => {
  const { closeConnectionAttempt } = usePeerConnection();
  const { mode, isConnected } = useChat();

  return (
    <Dialog
      open={!!mode && !isConnected}
      onClose={closeConnectionAttempt}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen bg-black/50 items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-background p-12">
          {mode === PEER_CONNECTION_MODE.HOST ? (
            <DialogContentHost />
          ) : (
            <DialogContentParticipant />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConnectionDialog;

const DialogContentHost = () => {
  const { closeConnectionAttempt } = usePeerConnection();
  const { localConnectionDescription, setRemoteConnectionDescription } =
    useChat();
  const [answer, setAnswer] = useState<string>("");

  const encodedConnectionDescription = btoa(
    JSON.stringify(localConnectionDescription) // Convert JSON to string then to base64 for aesthetics
  );

  const handleConnect = () => {
    if (!answer) return;

    const decodedAnswer = JSON.parse(atob(answer)); // Decode base64 to string then parse JSON
    setRemoteConnectionDescription(decodedAnswer); // Set the remote connection description
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm">1) Send offer to peer:</p>
      <textarea
        className="w-full max-w-md h-48 p-2 border-black border-r-2 border-b-2 resize-none text-xs bg-white"
        readOnly
        value={encodedConnectionDescription || ""}
      />
      <p className="text-sm">2) Input answer from peer:</p>
      <ActionInput
        value={answer}
        onTextChange={handleAnswerChange}
        onAction={handleConnect}
        buttonText="Connect"
        placeholder="Paste here"
        buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
        disableButton={!answer}
      />

      <Button
        onClick={closeConnectionAttempt}
        buttonText="Cancel"
        buttonColor="bg-rose-400 hover:bg-rose-500"
      />
    </div>
  );
};

const DialogContentParticipant = () => {
  const { closeConnectionAttempt } = usePeerConnection();
  const { localConnectionDescription } = useChat();

  const encodedAnswer = btoa(JSON.stringify(localConnectionDescription));

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm">1) Send this answer to the host:</p>
      <textarea
        readOnly
        className="w-full max-w-md h-48 p-2 border-black border resize-none text-xs bg-white"
        value={encodedAnswer || ""}
      />

      <Button
        onClick={closeConnectionAttempt}
        buttonText="Cancel"
        buttonColor="bg-rose-400 hover:bg-rose-500"
      />
    </div>
  );
};
