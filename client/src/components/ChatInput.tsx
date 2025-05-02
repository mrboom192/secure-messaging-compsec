import { useState } from "react";
import { useChat } from "../hooks/useChat";

const Input = () => {
  const { sendTextChatMessage } = useChat();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendTextChatMessage(message);
    setMessage(""); // Clear input after sending
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm w-full p-3 flex flex-col gap-2 border-r-2 border-b-2 border-black bg-white"
    >
      <input
        type="text"
        placeholder="Enter your message"
        className="bg-white focus:outline-none w-72"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
};

export default Input;
