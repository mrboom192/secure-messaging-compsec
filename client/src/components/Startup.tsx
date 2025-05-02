import { useState } from "react";
import ActionInput from "./ActionInput";
import Button from "./Button";
import { useChat } from "../hooks/useChat";

function Startup() {
  const { startAsHost, startAsParticipant } = useChat();
  const [offer, setOffer] = useState<string>("");
  const [name, setName] = useState("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);

  const handleSetName = (value: string) => {
    setName(value);
    setHasSubmittedName(true);
  };

  const handleParticipantSubmit = () => {
    if (!offer) return;

    try {
      const decodedOffer = JSON.parse(atob(offer));
      startAsParticipant(decodedOffer);
    } catch (err) {
      console.error("Invalid offer format:", err);
      alert("The offer you entered is invalid.");
    }
  };

  const handleOfferChange = (value: string) => {
    setOffer(value);
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
            onClick={() => startAsHost()}
            buttonColor="bg-emerald-400 hover:bg-emerald-500"
          />
          <p>Or</p>
          <ActionInput
            value={offer}
            onTextChange={handleOfferChange}
            onAction={handleParticipantSubmit}
            buttonText="Set Offer"
            placeholder="Enter offer here"
            buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
            disableButton={!offer}
          />
        </div>
      )}
    </div>
  );
}

export default Startup;
