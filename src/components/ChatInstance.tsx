import ChatBox from "./ChatBox";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

const ChatInstance = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Header */}
      <ChatHeader />
      <ChatBox />
      <ChatInput />
    </div>
  );
};

export default ChatInstance;
