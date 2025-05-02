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
    <div className="text-sm w-fit max-w-md p-3 flex flex-col gap-2 border border-black bg-white">
      <p>{plaintext}</p>
      <div className="w-full h-px bg-gray-200" />
      {variant === "sent" ? (
        <p className="text-xs text-gray-500">Encrypted as: {ciphertext}</p>
      ) : (
        <p className="text-xs text-gray-500">Decrypted from: {ciphertext}</p>
      )}
    </div>
  );
};

export default ChatBubble;
