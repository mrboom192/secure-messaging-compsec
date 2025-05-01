import ChatBox from "./ChatBox";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

const ChatInstance = ({ user = "Bob" }: { user: string }) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Header */}
      <ChatHeader user={user} />
      <ChatBox user={user} />
      <ChatInput />
    </div>
  );
};

export default ChatInstance;
