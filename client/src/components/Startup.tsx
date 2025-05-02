import { useState, useEffect } from "react";
import ActionInput from "./ActionInput";
import Button from "./Button";
import { useChat } from "../hooks/useChat";

function Startup() {
  const { startAsHost, startAsSlave } = useChat();
  const [name, setName] = useState("");
  const [hasSubmittedName, setHasSubmittedName] = useState(false);

  const handleSetName = (value: string) => {
    setName(value);
    setHasSubmittedName(true);
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
          <Button
            buttonText="Join chat"
            onClick={() => {}}
            buttonColor="bg-purple-400 hover:bg-purple-500"
          />
        </div>
      )}
    </div>
  );
}

export default Startup;
