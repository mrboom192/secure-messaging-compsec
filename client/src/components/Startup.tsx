import { useState, useEffect } from "react";
import ActionInput from "./ActionInput";
import Button from "./Button";
import { createPeerConnection } from "../utils/createPeerConnection";
import { Dialog, DialogPanel } from "@headlessui/react";

const iceServers: RTCIceServer[] = [
  {
    urls: "stun:stun.l.google.com:19302",
  },
];

function Startup() {
  const [name, setName] = useState("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string>("");

  const handleSetName = (value: string) => {
    setName(value);
    setHasSubmittedName(true);
  };

  const openModal = (role: string) => {
    setRole(role);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRole("");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background font-sans">
      <h1 className="text-3xl text-black mb-12">
        Welcome to Secure Messaging!
      </h1>

      <ActionInput
        value={name}
        onTextChange={setName}
        onAction={handleSetName}
        buttonText="Set Name"
        placeholder="Enter your name"
        buttonColor="bg-blue-400 hover:bg-blue-500"
        disableButton={!name}
      />

      {hasSubmittedName && (
        <div className="flex flex-row items-center justify-center gap-4 mt-4">
          <Button
            buttonText="Host chat"
            onClick={() => openModal("host")}
            buttonColor="bg-emerald-400 hover:bg-emerald-500"
          />
          <p>Or</p>
          <Button
            buttonText="Join chat"
            onClick={() => openModal("guest")}
            buttonColor="bg-purple-400 hover:bg-purple-500"
          />
        </div>
      )}

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen bg-black/50 items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 bg-background p-12">
            <DialogContent role={role} closeModal={closeModal} />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default Startup;

const DialogContent = ({
  role,
  closeModal,
}: {
  role: string;
  closeModal: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [offer, setOffer] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const onChannelOpen = () => {
    console.log("Connection ready!");
  };

  const onMessageReceived = (message: string) => {
    console.log(`Incoming: ${message}`);
  };

  useEffect(() => {
    const openChannelAsHost = async () => {
      setIsLoading(true);
      try {
        const { localDescription } = await createPeerConnection({
          iceServers,
          onMessageReceived,
          onChannelOpen,
        });

        setOffer(localDescription || "No SDP available");
      } catch (err) {
        setError(`Error setting up connection: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (role === "host") {
      openChannelAsHost();
    }
  }, [role]);

  const handleSetRemoteDescription = async () => {
    setIsLoading(true);

    try {
      const remoteSDP = JSON.parse(role === "host" ? answer : offer);

      const { localDescription } = await createPeerConnection({
        remoteDescription: JSON.stringify(new RTCSessionDescription(remoteSDP)),
        iceServers,
        onMessageReceived,
        onChannelOpen,
      });

      if (role === "host") {
        // No localDescription needed from host here
      } else {
        setAnswer(localDescription || "Error generating answer");
      }
    } catch (err) {
      setError(`Error setting up connection: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={closeModal}
          buttonText="Close"
          buttonColor="bg-rose-400 hover:bg-rose-500"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {role === "host" ? (
        <>
          <p className="text-sm">1) Send offer to peer:</p>
          <textarea
            readOnly
            className="w-full max-w-md h-48 p-2 border-black border resize-none text-xs bg-white"
            value={offer || ""}
          />
          <p className="text-sm">2) Paste answer from peer:</p>
          <ActionInput
            value={answer}
            onTextChange={setAnswer}
            onAction={handleSetRemoteDescription}
            buttonText="Connect"
            placeholder="Paste peer SDP answer"
            buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
            disableButton={!answer}
          />
        </>
      ) : (
        <>
          <p className="text-sm">1) Paste offer from peer:</p>
          <ActionInput
            value={offer}
            onTextChange={setOffer}
            onAction={handleSetRemoteDescription}
            buttonText="Generate Answer"
            placeholder="Paste peer SDP offer"
            buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
            disableButton={!offer}
          />
          <p className="text-sm">2) Send this answer to the host:</p>
          <textarea
            readOnly
            className="w-full max-w-md h-48 p-2 border-black border resize-none text-xs bg-white"
            value={answer || ""}
          />
        </>
      )}

      <Button
        onClick={closeModal}
        buttonText="Close"
        buttonColor="bg-rose-400 hover:bg-rose-500"
      />
    </div>
  );
};
