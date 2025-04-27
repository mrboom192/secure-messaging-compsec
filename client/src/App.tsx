import axios from "axios";
import { useEffect, useState } from "react";
import Alice from "./assets/Alice.png";
import Bob from "./assets/Bob.png";


export default function App() {
  const [aliceMessages, setAlice] = useState<string[]>([]);
  const [bobMessages, setBob] = useState<string[]>([]);
  const [aliceInput, setAliceInput] = useState("");
  const [bobInput, setBobInput] = useState("");

  const sendAlice = () => {
    setAlice([...aliceMessages, aliceInput]);
    setBob([...bobMessages, aliceInput]); 
    setAliceInput("");
  };

  const sendBobMessage = () => {
    setBob([...bobMessages, bobInput]);
    setAlice([...aliceMessages, bobInput]);  // Alice receives Bob's message
    setBobInput("");
  };


  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
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
