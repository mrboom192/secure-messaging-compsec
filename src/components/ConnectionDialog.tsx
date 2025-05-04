import { useEffect, useState } from "react";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useChat } from "../hooks/useChat";
import ActionInput from "./ActionInput";
import Button from "./Button";

import {
  PEER_CONNECTION_MODE,
  usePeerConnection,
} from "../contexts/PeerConnectionContext";

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
        <DialogPanel className="max-w-lg space-y-4 bg-background p-12 flex flex-col gap-8 border-b-2 border-r-2">
          <PendingText />
          {mode == PEER_CONNECTION_MODE.HOST && <DialogContentHost />}
          {mode == PEER_CONNECTION_MODE.PARTICIPANT && (
            <DialogContentParticipant />
          )}
          <Button
            onClick={closeConnectionAttempt}
            buttonText="Cancel"
            buttonColor="bg-rose-400 hover:bg-rose-500"
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConnectionDialog;

const PendingText = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 4) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-gray-700 font-mono">
      Awaiting connection{".".repeat(dotCount - 1)}
    </p>
  );
};

const DialogContentHost = () => {
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
    <div className="flex flex-col items-start gap-4 w-full">
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
    </div>
  );
};

const DialogContentParticipant = () => {
  const { localConnectionDescription } = useChat();

  const encodedAnswer = btoa(JSON.stringify(localConnectionDescription));

  return (
    <div className="flex flex-col items-start gap-4 w-full">
      <p className="text-sm">Send this answer to the host:</p>
      <textarea
        readOnly
        className="w-full max-w-md h-48 p-2 border-black border-r-2 border-b-2 resize-none text-xs bg-white"
        value={encodedAnswer || ""}
      />
    </div>
  );
};
