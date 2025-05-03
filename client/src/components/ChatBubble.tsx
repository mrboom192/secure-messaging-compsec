const ChatBubble = ({
  plaintext = "Hello, this is a test message.",
  ciphertext = "Encrypted message here",
  variant = "sent",
}: {
  plaintext: string;
  ciphertext: string;
  variant?: "sent" | "received";
}) => {
  return (
    <div className="text-sm w-fit max-w-md p-3 flex flex-col gap-2 border border-black bg-white break-words">
      <p className="whitespace-pre-wrap break-words">{plaintext}</p>
      <div className="w-full h-px bg-gray-200" />
      <p className="text-xs text-gray-500 max-h-24 overflow-auto whitespace-pre-wrap break-all">
        {variant === "sent"
          ? `Sent ciphertext: ${ciphertext}`
          : `Received ciphertext: ${ciphertext}`}
      </p>
    </div>
  );
};

export default ChatBubble;
