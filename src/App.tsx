import ChatInstance from "./components/ChatInstance";
import ConnectionDialog from "./components/ConnectionDialog";
import Startup from "./components/Startup";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { mode, isConnected } = useChat();

  return (
    <div className="flex w-full h-screen items-center justify-center bg-background font-sans">
      <div className="w-4/5 h-10/12 max-w-3xl flex flex-row gap-6 items-center justify-center">
        {(!mode || !isConnected) && <Startup />}
        <ConnectionDialog />
        {mode && isConnected && <ChatInstance />}
      </div>
    </div>
  );
}
