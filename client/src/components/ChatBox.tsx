import { useChatMessages } from "../contexts/ChatContext";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import ChatBubble from "./ChatBubble";
import { format } from "date-fns";

const ChatBox = () => {
  const { currentUserName } = usePeerConnection();
  const { chatMessages } = useChatMessages();
  const grouped = [];

  // Create groups of messages from consecutive messages
  for (let i = 0; i < chatMessages.length; ) {
    const groupUser = chatMessages[i].sender;
    const group: typeof chatMessages = [];

    while (i < chatMessages.length && chatMessages[i].sender === groupUser) {
      group.push(chatMessages[i]);
      i++;
    }

    grouped.push(group);
  }

  return (
    <div className="flex flex-col p-4 gap-6 bg-white border-r-2 border-b-2 h-full overflow-y-auto">
      {grouped.map((group, groupIdx) => (
        <div
          key={groupIdx}
          className={`flex flex-col gap-2 ${
            group[0].sender === currentUserName ? "items-end" : "items-start"
          }`}
        >
          {/* Timestamp */}
          <span className="text-xs text-black">
            {group[0].sender === currentUserName ? "You" : group[0].sender},{" "}
            {format(new Date(group[0].timestamp), "hh:mm a")}
          </span>

          {/* Chat bubbles */}
          {group.map((msg, idx) => (
            <ChatBubble
              key={idx}
              plaintext={msg.plaintext}
              ciphertext={msg.ciphertext}
              variant={msg.sender === currentUserName ? "sent" : "received"}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
