import { useState, ReactNode } from "react";
import ActionInput from "./ActionInput";
import Button from "./Button";
import Modal from "./Modal";
import { createPeerConnection } from "../utils/createPeerConnection";

const iceServers: RTCIceServer[] = [
  {
    urls: "stun:stun.l.google.com:19302",
  },
];

const Startup = () => {
  const [name, setName] = useState("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [sdpOffer, setSdpOffer] = useState<string | null>(null);
  const [sdpAnswer, setSdpAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remoteDescription, setRemoteDescription] = useState<
    string | undefined
  >(null);
  const [sdpInput, setSdpInput] = useState("");
  const [offerInput, setOfferInput] = useState(""); // for pasted offer SDP

  const handleSetName = (value: string) => {
    setName(value);
    setHasSubmittedName(true);
  };

  const closeModal = () => setModalContent(null);

  const renderSdpModalContentHost = (sdp: string | undefined) => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col w-full items-start gap-1">
        <p className="text-sm text-left break-all max-w-md">
          {"1) Send offer to peer"}
        </p>
        <textarea
          readOnly
          className="w-full max-w-md h-48 p-2 focus:outline-none border-black border-b-2 border-r-2 resize-none text-xs bg-white"
          value={sdp || ""}
        />
      </div>

      <div className="flex flex-col w-full items-start gap-1">
        <p className="text-sm text-left break-all max-w-md">
          {"2) Paste answer from peer"}
        </p>
        <ActionInput
          value={name}
          onTextChange={setName}
          onAction={handleSetName}
          buttonText="Set Answer"
          placeholder="Enter your name"
          buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
          disableButton={!name}
        />
      </div>
      <p>Awaiting connection...</p>
      <Button
        onClick={closeModal}
        buttonText="Close"
        buttonColor="bg-rose-400 hover:bg-rose-500"
      />
    </div>
  );

  const renderSdpModalContentJoin = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col w-full items-start gap-1">
        <p className="text-sm text-left break-all max-w-md">
          1) Paste offer from peer
        </p>
        <ActionInput
          value={offerInput}
          onTextChange={setOfferInput}
          onAction={handleSetRemoteDescription}
          buttonText="Connect"
          placeholder="Paste offer SDP here"
          buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
          disableButton={!offerInput}
        />
      </div>

      <Button
        onClick={closeModal}
        buttonText="Close"
        buttonColor="bg-rose-400 hover:bg-rose-500"
      />
    </div>
  );

  const openHostModal = async () => {
    setIsLoading(true);
    setModalContent(<p>Setting up connection...</p>);

    try {
      const onChannelOpen = () => console.log(`Connection ready!`);
      const onMessageReceived = (message: string) =>
        console.log(`Incoming: ${message}`);

      const { localDescription, setAnswerDescription, sendMessage } =
        await createPeerConnection({
          iceServers,
          onMessageReceived,
          onChannelOpen,
        });

      setSdpOffer(localDescription || "No SDP available");

      // You can store or use setAnswerDescription/sendMessage as needed
      setModalContent(renderSdpModalContentHost(localDescription));
    } catch (err) {
      setModalContent(<p>Error setting up connection: {String(err)}</p>);
    } finally {
      setIsLoading(false);
    }
  };

  const openJoinModal = () => {
    setModalContent(renderSdpModalContentJoin());
  };

  const handleSetRemoteDescription = async () => {
    setIsLoading(true);
    setModalContent(<p>Connecting...</p>);

    try {
      const onChannelOpen = () => console.log(`Connection ready!`);
      const onMessageReceived = (message: string) =>
        console.log(`Incoming: ${message}`);

      const remoteSDP = JSON.parse(sdpInput);
      const { localDescription, sendMessage } = await createPeerConnection({
        remoteDescription: JSON.stringify(new RTCSessionDescription(remoteSDP)),
        iceServers,
        onMessageReceived,
        onChannelOpen,
      });

      setSdpAnswer(localDescription || "Error");
      setModalContent(
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-left break-all max-w-md">
            Send answer back to peer:
          </p>
          <textarea
            readOnly
            className="w-full max-w-md h-48 p-2 focus:outline-none border-black border-b-2 border-r-2 resize-none text-xs bg-white"
            value={localDescription || ""}
          />
          <Button
            onClick={closeModal}
            buttonText="Close"
            buttonColor="bg-rose-400 hover:bg-rose-500"
          />
        </div>
      );
    } catch (err) {
      setModalContent(<p>Error connecting: {String(err)}</p>);
    } finally {
      setIsLoading(false);
    }
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
            onClick={openHostModal}
            buttonColor="bg-emerald-400 hover:bg-emerald-500"
          />
          <p>Or</p>
          <Button
            buttonText="Join chat"
            onClick={openJoinModal}
            buttonColor="bg-purple-400 hover:bg-purple-500"
          />
        </div>
      )}

      <Modal isOpen={modalContent !== null} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Startup;
