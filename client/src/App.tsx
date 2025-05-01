import { useEffect, useState } from "react";
import Alice from "./assets/Alice.png";
import Bob from "./assets/Bob.png";
import { Message } from "./types/Message";
import { decryptMessage } from "./utils/cryptoHelpers";
import { socket } from "./socket";
import ChatInstance from "./components/ChatInstance";
import ChatBubble from "./components/ChatBubble";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aliceInput, setAliceInput] = useState("");
  const [bobInput, setBobInput] = useState("");

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    async function onRecieveMessage(data: Message) {
      const password = "shared-secret"; // must match the server-side password
      const iv = data.ciphertext.slice(0, 16); // first 16 bytes of ciphertext
      const salt = data.ciphertext.slice(16, 32); // next 16 bytes of ciphertext

      try {
        const plaintext = await decryptMessage(
          data.ciphertext,
          iv,
          salt,
          password
        );
        setMessages((prev) => [
          ...prev,
          { sender: data.sender, plaintext, ciphertext: data.ciphertext },
        ]);
      } catch (err) {
        console.error("Decryption failed:", err);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onRecieveMessage);

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold">Attempting connection to server...</p>
      </div>
    );
  }

  const sendAlice = () => {
    if (aliceInput.trim() === "") return;

    const plaintext = aliceInput;
    const ciphertext = btoa(plaintext); // fake encryption for now
    console.log("Alice's message:", { plaintext, ciphertext });
    socket.emit("send_message", { sender: "Alice", plaintext, ciphertext });
    setAliceInput("");
  };

  const sendBobMessage = () => {
    if (bobInput.trim() === "") return;

    const plaintext = bobInput;
    const ciphertext = btoa(plaintext); // fake encryption for now
    socket.emit("send_message", { sender: "Bob", plaintext, ciphertext });
    setBobInput("");
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-background font-sans">
      <div className="w-4/5 h-4/5 flex flex-row gap-6">
        <ChatInstance user={"Bob"} />
        <div className="w-0.5 h-full bg-white" />
        <ChatInstance user={"Alice"} />
      </div>
    </div>
  );
}
