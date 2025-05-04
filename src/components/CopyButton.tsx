import { Copy, Check } from "lucide-react";
import { useState } from "react";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex flex-row gap-1 items-center rounded hover:bg-gray-200 transition"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500" />
          <p className="text-sm text-emerald-500">Copied!</p>
        </>
      ) : (
        <Copy className="w-4 h-4 text-black" />
      )}
    </button>
  );
};

export default CopyButton;
