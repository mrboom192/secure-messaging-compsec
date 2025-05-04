import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { Send } from "lucide-react";

const Input = () => {
  const { sendTextChatMessage } = useChat();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendTextChatMessage(message);
      setMessage("");
      setError(null);
    } catch (error: unknown) {
      console.error("sendTextChatMessage failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  };

  const canSubmit = message.trim().length > 0;

  return (
    <div>
      {error && (
        <p className="font-bold text-pink-500 text-sm mb-2">Error: {error}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-row border-r-2 border-b-2 border-black bg-white"
      >
        <input
          type="text"
          placeholder="Enter your message"
          className="p-3 focus:outline-none w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={`p-3 text-white flex items-center justify-center transition-colors ${
            canSubmit
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Input;
