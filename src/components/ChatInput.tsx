import { useState } from "react";

import { useChat } from "../hooks/useChat";

const Input = () => {
  const { sendTextChatMessage } = useChat();
  const [error, setError] = useState<string | null>(null); // For error handling
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return; // If no message, do nothing

    try {
      await sendTextChatMessage(message);

      // Resets
      setMessage("");
      setError(null);
    } catch (error: unknown) {
      console.error("sendTextChatMessage failed:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to send message");
      }
    }
  };

  return (
    <div>
      {error && (
        <p className="font-bold text-pink-500 text-sm mb-2">Error: {error}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="text-sm w-full flex flex-col gap-2 border-r-2 border-b-2 border-black bg-white"
      >
        <input
          type="text"
          placeholder="Enter your message"
          className="p-3 focus:outline-none w-full "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Input;
