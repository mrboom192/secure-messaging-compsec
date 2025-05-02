import ChatInstance from "./components/ChatInstance";
import ConnectionDialog from "./components/ConnectionDialog";
import Startup from "./components/Startup";
import { PEER_CONNECTION_MODE } from "./contexts/PeerConnectionContext";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { mode, isConnected } = useChat();

  return (
    <div className="flex w-full h-screen items-center justify-center bg-background font-sans">
      <div className="w-4/5 h-4/5 flex flex-row gap-6">
        {(!mode || !isConnected) && <Startup />}
        {/* {mode === PEER_CONNECTION_MODE.HOST && !isConnected && <Host />} */}
        <ConnectionDialog role={mode as string} />
      </div>
    </div>
  );
}
