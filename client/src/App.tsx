import axios from "axios";
import { useEffect, useState } from "react";
import Alice from "./assets/Alice.png";
import Bob from "./assets/Bob.png";
import io from "socket.io-client"; //this is for real-time connection and helps connect the backend

// AES + PBKDF2 decryption helpers
async function deriveKey(password: string, saltBase64: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    {
      name: "AES-CBC",
      length: 256
    },
    false,
    ["decrypt"]
  );
}

async function decryptMessage(ciphertextBase64: string, ivBase64: string, saltBase64: string, password: string): Promise<string> {
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0));

  const key = await deriveKey(password, saltBase64);

  const plaintextBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv
    },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintextBuffer);
}


export default function App() {
  const [socket, setSocket] = useState<any>(null); // tracks socket
  const [messages, setMessages] = useState<{ sender: string; plaintext: string; ciphertext: string }[]>([]);
  const [aliceInput, setAliceInput] = useState("");
  const [bobInput, setBobInput] = useState("");


  useEffect(() => {
    const newSocket = io('http://localhost:8080'); // connect to the server
    setSocket(newSocket);

    //listen for incoming messages
    newSocket.on("receive_message", async (data: any) => {
      console.log("Received encrypted message:", data);
    
      const { sender, ciphertext, iv, salt } = data;
      const password = "shared-secret"; // must match the server-side password
    
      try {
        const plaintext = await decryptMessage(ciphertext, iv, salt, password);
        setMessages((prev) => [...prev, { sender, plaintext, ciphertext }]);
      } catch (err) {
        console.error("Decryption failed:", err);
      }
    });
    

    //cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);
  /*
  const sendAlice = () => {
    if (aliceInput.trim() !== ""){
      socket.emit("send_message", {sender: "Alice", message: aliceInput}); // sends the message to the server
      setAliceInput(""); //clears the input field
    }
  };
  */

  const sendAlice = () => {
    if (aliceInput.trim() !== "" && socket) {
      const plaintext = aliceInput;
      console.log("📤 Sending plaintext to server:", plaintext);
      socket.emit("send_message", { sender: "Alice", plaintext }); // Just plaintext!
      setAliceInput("");
    }
  };

  /* const sendBobMessage = () => {
    if (bobInput.trim() !== ""){
      socket.emit("send_message", {sender: "Bob", message: bobInput}); // sends the message to the server
      setBobInput(""); //clears the input field
    }
   
  };
  */


 const sendBobMessage = () => {
  if (bobInput.trim() !== "" && socket) {
    const plaintext = bobInput;
    console.log("📤 Sending plaintext to server:", plaintext);
    socket.emit("send_message", { sender: "Bob", plaintext }); // Just plaintext!
    setBobInput("");
    }
  };


return (
    <div className="flex w-full items-center">
      <div className="bg-[#38a9f5] w-screen h-screen">
        <p className="font-bold text-3xl text-center mt-4">Welcome to Secure Messaging!</p>

        <div className="flex w-full mt-7">
          {/* Alice */}
          <div className="w-1/3 flex flex-col items-center">
            <img src={Alice} alt="Alice" className="w-24 h-24 mb-2 shadow-lg rounded-full" />
            <h2 className="font-bold text-2xl">Alice</h2>
            </div>

          {/*Chatbox */}
          <div className="w-1/3 flex flex-col bg-white w-full h-[650px] rounded-lg shadow-lg p-4 overflow-y-auto ml-auto">
          <div className="flex-1 overflow-y-auto w-full mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-4 ${msg.sender === "Alice" ? "justify-start" : "justify-end"}`}>
                <div className="bg-gray-100 rounded-lg p-2 max-w-xs border border-gray-300">
                  <p className="font-bold">{msg.sender}:</p>
                  <p><strong>Plaintext:</strong> {msg.plaintext}</p>
                  <p><strong>Ciphertext:</strong> {msg.ciphertext}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
            
            {/* Bob */}
          <div className="w-1/3 flex flex-col items-center">
            <img src={Bob} alt="Bob" className="w-24 h-24 mb-2 shadow-lg rounded-full" />
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

