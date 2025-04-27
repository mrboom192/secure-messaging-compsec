import axios from "axios";
import { useEffect } from "react";

export default function App() {
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className="bg-[#03dffc] w-screen h-screen">
      <p className="font-bold text-3xl">Welcome to secure messaging!</p>
    </div>
  );
}
