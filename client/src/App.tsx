import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function App() {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data: { message: string }) => {
      setReceivedMessage(data.message);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", { message });
    setMessage("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Secure Messenger</h1>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Send
      </button>
      <h2 className="text-xl mt-6">Received Message:</h2>
      <p>{receivedMessage}</p>
    </div>
  );
}
