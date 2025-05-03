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
      await sendTextChatMessage(message); // <== await here
      setMessage(""); // Clear input only if message was sent successfully
      setError(null); // Clear error if message was sent successfully
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
        <div className="text-rose-500 text-sm mb-2">Error: {error}</div>
      )}
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
    </div>
  );
};

export default Input;
