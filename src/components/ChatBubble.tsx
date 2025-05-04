const ChatBubble = ({
  plaintext,
  ciphertext,
  variant,
}: {
  plaintext: string;
  ciphertext: string;
  variant?: "sent" | "received";
}) => {
  const borderColor =
    variant === "sent"
      ? "border-r-4 border-r-emerald-400"
      : variant === "received"
      ? "border-l-4 border-l-fuchsia-400"
      : "";

  return (
    <div
      className={`text-sm w-fit max-w-md p-3 flex flex-col gap-2 border border-black bg-white break-words ${borderColor}`}
    >
      <p className="whitespace-pre-wrap break-words">{plaintext}</p>
      <div className="w-full h-px bg-gray-200" />
      <p className="text-xs text-gray-500 max-h-24 overflow-auto whitespace-pre-wrap break-all">
        <span className="font-bold">
          {variant === "sent" ? `Sent ciphertext:` : `Received ciphertext:`}
        </span>{" "}
        {ciphertext}
      </p>
    </div>
  );
};

export default ChatBubble;
