import ChatBubble from "./ChatBubble";
import { format } from "date-fns";

const messages = [
  {
    ciphertext: "jsadfjf1lnkfwej@()(94j1nn)=001t02ln3JD01znAj390ifjL3",
    plaintext: "Can we talk about a question that I have?",
    createdAt: "2025-05-01T11:36:00Z",
    user: "Bob",
  },
  {
    ciphertext: "jsadfjf1lnkfwejln3JD01znAj390ifjL3",
    plaintext: "Can we talk about a question that I have?",
    createdAt: "2025-05-01T11:36:05Z",
    user: "Bob",
  },
  {
    ciphertext: "jsadfjf1lnkfwej@() (94j1nn)=001t02ln3JD01znAj390ifjL3",
    plaintext: "Can we talk about a question that I have?",
    createdAt: "2025-05-01T11:36:10Z",
    user: "Alice",
  },
  {
    ciphertext: "jsadfjf1lnkfwej@() (94j1nn)=001t02ln3JD01znAj390ifjL3",
    plaintext: "Can we talk about a question that I have?",
    createdAt: "2025-05-01T11:36:15Z",
    user: "Alice",
  },
  {
    ciphertext: "jsadfjf1lnkfwej@() (94j1nn)=001t02ln3JD01znAj390ifjL3",
    plaintext: "Can we talk about a question that I have?",
    createdAt: "2025-05-01T11:36:20Z",
    user: "Bob",
  },
];

const ChatBox = ({ user = "Bob" }: { user: string }) => {
  const grouped = [];

  // Create groups of messages from consecutive messages
  for (let i = 0; i < messages.length; ) {
    const groupUser = messages[i].user;
    const group: typeof messages = [];

    while (i < messages.length && messages[i].user === groupUser) {
      group.push(messages[i]);
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
            group[0].user === user ? "items-end" : "items-start"
          }`}
        >
          {/* Timestamp */}
          <span className="text-xs text-black">
            {group[0].user === user ? "You" : group[0].user},{" "}
            {format(new Date(group[0].createdAt), "hh:mm a")}
          </span>

          {/* Chat bubbles */}
          {group.map((msg, idx) => (
            <ChatBubble
              key={idx}
              plaintext={msg.plaintext}
              ciphertext={msg.ciphertext}
              variant={msg.user === user ? "sent" : "received"}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
