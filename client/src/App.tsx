import { useState } from "react";
import ChatInstance from "./components/ChatInstance";
import Startup from "./components/Startup";

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  if (!isConnected) {
    return <Startup />;
  }

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
