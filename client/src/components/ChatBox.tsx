import { useEffect, useRef } from "react";
import { useChatMessages } from "../contexts/ChatContext";
import { useUser } from "../contexts/UsernameContext";
import ChatBubble from "./ChatBubble";
import { format } from "date-fns";

const ChatBox = () => {
  const { username } = useUser();
  const { chatMessages } = useChatMessages();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatMessages]); // Autoscroll

  const grouped = [];

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
    <div
      ref={containerRef}
      className="flex flex-col p-4 gap-6 bg-white border-r-2 border-b-2 h-full overflow-y-auto"
    >
      {grouped.map((group, groupIdx) => (
        <div
          key={groupIdx}
          className={`flex flex-col gap-2 ${
            group[0].sender === username ? "items-end" : "items-start"
          }`}
        >
          <span className="text-xs text-black">
            {group[0].sender === username ? "You" : group[0].sender},{" "}
            {format(new Date(group[0].timestamp), "hh:mm a")}
          </span>

          {group.map((msg) => (
            <ChatBubble
              key={msg.id}
              plaintext={String(msg.plaintext)}
              ciphertext={msg.ciphertext}
              variant={msg.sender === username ? "sent" : "received"}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
