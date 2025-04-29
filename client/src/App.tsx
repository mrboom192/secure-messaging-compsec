<<<<<<< HEAD
import { useState } from 'react'

function App() {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<{ciphertext: string; plaintext: string}[]>([]);

  const sendMessage = async () => {
    // later on will we encropt message here and send to backend
    const plaintext = input;
    const ciphertext = btoa(input); //this is just a placeholder for the actual encryption
    //send to sever after setting up the backend
    setMessage([...message, {ciphertext, plaintext}]);
    setInput('');
  };

  return (
    <div className="App">
      <h1>Sercure Messenger </h1>

      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <h2>Messages</h2>
        {message.map((msg, idx) => (
          <div key={idx}>
            <p> <strong>Ciphertext:</strong> {msg.ciphertext}</p>
            <p> <strong>Plaintext:</strong> {msg.plaintext}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
=======
import axios from "axios";
import { useEffect, useState } from "react";
import Alice from "./assets/Alice.png";
import Bob from "./assets/Bob.png";
import io from "socket.io-client"; //this is for real-time connection and helps connect the backend


export default function App() {
  const [aliceMessages, setAlice] = useState<string[]>([]);
  const [bobMessages, setBob] = useState<string[]>([]);
  const [aliceInput, setAliceInput] = useState("");
  const [bobInput, setBobInput] = useState("");
  const socket = io("http://localhost:8080"); //connects to the server

  const sendAlice = () => {
    if (aliceInput.trim() !== ""){
      socket.emit("send_message", {sender: "Alice", message: aliceInput}); // sends the message to the server
      setAliceInput(""); //clears the input field
    }
  };

  const sendBobMessage = () => {
    if (bobInput.trim() !== ""){
      socket.emit("send_message", {sender: "Bob", message: bobInput}); // sends the message to the server
      setBobInput(""); //clears the input field
    }
   
  };


  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
    socket.on("receive_message", (data) => {
      if (data.sender === "Alice") {
        setAlice((prev) => [...prev, data.message]); //adds the message to the alice messages
        setBob((prev) => [...prev, data.message]); //adds the message to the bob messages
      } else if (data.sender === "Bob") {
        setBob((prev) => [...prev, data.message]); //adds the message to the bob messages
        setAlice((prev) => [...prev, data.message]); //adds the message to the alice messages
      }
    });
    return () => {
      socket.off("receive_message"); //cleans up the socket connection
    };

  }, []);

  // prev color #03dffc

  return (
    <div className="flex w-full items-center">
    <div className="bg-[#38a9f5] w-screen h-screen">
       <p className="font-bold text-3xl text-center mt-4">Welcome to secure messaging!</p>

       <div className="flex w-full mt-7">
       <div className="w-1/3 flex flex-col items-center">
        <img src={Alice} alt="Alice" className="w-24 h-24 mb-2 shadow-lg rounded-full" />
        <h2 className="font-bold text-2xl">Alice</h2>
      </div>
      <div className="w-1/3 flex flex-col items-center">
        <div className= "bg-white w-full h-[650px] rounded-lg shadow-lg p-4 overflow-y-auto">
          <p className="text-center text-gray-500" ></p>
        </div>

        <div className="flex w-full mt-4">
          <input 
          type = "text"
          className="flex-1 p-2 rounded-l-lg border border-black bg-white"
          placeholder="Type a message"
          onChange={(e) => setAliceInput(e.target.value)}
          value={aliceInput}
          />
          <button
          onClick = {sendAlice}
          className="bg-blue-500 text-black p-2 rounded-r-lg border border-black hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </div>

        </div>
      <div className="w-1/3 flex flex-col items-center">
        <img src={Bob} alt="Bob" className="w-24 h-24 mb-2 shadow-lg rounded-full" />
        <h2 className="font-bold text-2xl">Bob</h2>
      </div>
    </div>
    </div>
    </div>
  );
}
>>>>>>> 3e135249560344a6ce43510e9867d3ef696a18e8
