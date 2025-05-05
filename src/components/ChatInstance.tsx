import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatBox from "./ChatBox";

const ChatInstance = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <ChatHeader />
      <ChatBox />
      <ChatInput />
    </div>
  );
};

export default ChatInstance;
