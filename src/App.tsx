import ChatInstance from "./components/ChatInstance";
import ConnectionDialog from "./components/ConnectionDialog";
import Credits from "./components/Credits";
import Startup from "./components/Startup";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { mode, isConnected } = useChat();

  return (
    <div className="fixed inset-0 flex flex-col gap-8 w-dvw h-dvh items-center justify-center bg-background font-sans">
      <div className="w-4/5 h-full max-w-3xl flex flex-row gap-6 items-center justify-center">
        {(!mode || !isConnected) && <Startup />}
        <ConnectionDialog />
        {mode && isConnected && <ChatInstance />}
      </div>
      <Credits />
    </div>
  );
}
