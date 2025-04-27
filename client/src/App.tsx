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
    <div className="bg-[#38a9f5] w-screen h-screen">
       <p className="font-bold text-3xl text-center">Welcome to secure messaging!</p>

       <div className="flex w-full">
       <div className="w-1/2 flex flex-col items-center">
        <img src={Alice} alt="Alice" className="w-24 h-24 mb-2 rounded-full" />
        <h2 className="font-bold text-2xl">Alice</h2>
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <img src={Bob} alt="Bob" className="w-24 h-24 mb-2 rounded-full" />
        <h2 className="font-bold text-2xl">Bob</h2>
      </div>
    </div>
    </div>
  );
}
