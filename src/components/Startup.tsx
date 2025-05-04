import { useState } from "react";

import { useUser } from "../contexts/UsernameContext";
import { useChat } from "../hooks/useChat";
import ActionInput from "./ActionInput";
import Button from "./Button";

function Startup() {
  const { startAsHost, startAsParticipant } = useChat();
  const { username, setUsername } = useUser();
  const [offer, setOffer] = useState<string>("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);

  const handleSetName = (value: string) => {
    setUsername(value);
    setHasSubmittedName(true);
  };

  // Start chat as a participant
  const handleParticipantSubmit = () => {
    if (!offer) return;

    try {
      const decodedOffer = JSON.parse(atob(offer)); // Convert the aesthetically pleasing base64 string to a JSON object
      startAsParticipant(decodedOffer); // Creates an answer SDP
    } catch (err) {
      console.error("Invalid offer format:", err);
      alert("The offer you entered is invalid.");
    }
  };

  // Handle changes to the offer input
  const handleOfferChange = (value: string) => {
    setOffer(value);
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-full bg-background font-sans mt-4">
      {/* <img src="/logo.png" alt="Logo" className="w-16 h-auto" /> */}
      <h1 className="text-3xl text-black text-center">
        Welcome to Secure Messaging!
      </h1>

      <div className="w-full">
        <ActionInput
          value={username}
          onTextChange={setUsername}
          onAction={handleSetName}
          buttonText="Set Name"
          placeholder="Enter your name"
          buttonColor="bg-gray-300 hover:bg-gray-400"
          disableButton={!username}
        />
      </div>

      {hasSubmittedName && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
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
