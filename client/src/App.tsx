import axios from "axios";
import { useEffect, useState } from "react";
import Alice from "./assets/Alice.png";
import Bob from "./assets/Bob.png";
import io, { Socket } from "socket.io-client"; //this is for real-time connection and helps connect the backend
import { Message } from "./types/Message";

export default function App() {
  const [socket, setSocket] = useState<unknown>(null); // tracks socket
  const [messages, setMessages] = useState<Message[]>([]);
  const [aliceInput, setAliceInput] = useState("");
  const [bobInput, setBobInput] = useState("");

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "http://localhost:8080"
    ); // connect to the server
    setSocket(newSocket);

    //listen for incoming messages
    newSocket.on(
      "receive_message",
      (data: { sender: string; plaintext: string; ciphertext: string }) => {
        console.log("Received message:", data);
        setMessages((prev) => [
          ...prev,
          {
            sender: data.sender,
            plaintext: data.plaintext,
            ciphertext: data.ciphertext,
          },
        ]);
      }
    );

    //cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      const response = await axios.get("http://localhost:8080/api");
      console.log(response.data.fruits);
    };
    // Call the fetchAPI function to get data from the server
    fetchAPI();
  }, []);

  const sendAlice = () => {
    if (aliceInput.trim() !== "" && socket) {
      const plaintext = aliceInput;
      const ciphertext = btoa(plaintext); // fake encryption for now
      socket.emit("send_message", { sender: "Alice", plaintext, ciphertext });
      setAliceInput("");
    }
  };

  const sendBobMessage = () => {
    if (bobInput.trim() !== "" && socket) {
      const plaintext = bobInput;
      const ciphertext = btoa(plaintext); // fake encryption for now
      socket.emit("send_message", { sender: "Bob", plaintext, ciphertext });
      setBobInput("");
    }
  };

  return (
    <div className="flex w-full items-center">
      <div className="bg-[#38a9f5] w-screen h-screen">
        <p className="font-bold text-3xl text-center mt-4">
          Welcome to Secure Messaging!
        </p>

        <div className="flex w-full mt-7">
          {/* Alice */}
          <div className="w-1/3 flex flex-col items-center">
            <img
              src={Alice}
              alt="Alice"
              className="w-24 h-24 mb-2 shadow-lg rounded-full"
            />
            <h2 className="font-bold text-2xl">Alice</h2>
          </div>

          {/*Chatbox */}
          <div className="w-1/3 flex flex-col bg-white w-full h-[650px] rounded-lg shadow-lg p-4 overflow-y-auto ml-auto">
            <div className="flex-1 overflow-y-auto w-full mb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex mb-4 ${
                    msg.sender === "Alice" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="bg-gray-100 rounded-lg p-2 max-w-xs border border-gray-300">
                    <p className="font-bold">{msg.sender}:</p>
                    <p>
                      <strong>Plaintext:</strong> {msg.plaintext}
                    </p>
                    <p>
                      <strong>Ciphertext:</strong> {msg.ciphertext}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bob */}
          <div className="w-1/3 flex flex-col items-center">
            <img
              src={Bob}
              alt="Bob"
              className="w-24 h-24 mb-2 shadow-lg rounded-full"
            />
            <h2 className="font-bold text-2xl">Bob</h2>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-4 px-[20%]">
          {/* Alice Input */}
          <div className="flex flex-1 max-w-[50%]">
            <input
              type="text"
              className="flex-1 p-2 rounded-l-lg border border-black bg-white"
              placeholder="Type a message as Alice"
              onChange={(e) => setAliceInput(e.target.value)}
              value={aliceInput}
            />
            <button
              onClick={sendAlice}
              className="bg-blue-500 text-black p-2 rounded-r-lg border border-black hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </div>
          {/*Input for Bob */}
          <div className="flex flex-1 max-w-[50%]">
            <input
              type="text"
              className="flex-1 p-2 rounded-l-lg border border-black bg-white"
              placeholder="Type a message as Bob"
              onChange={(e) => setBobInput(e.target.value)}
              value={bobInput}
            />
            <button
              onClick={sendBobMessage}
              className="bg-blue-500 text-black p-2 rounded-r-lg border border-black hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
