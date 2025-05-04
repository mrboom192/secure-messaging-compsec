interface ActionInputProps {
  value: string;
  onTextChange: (value: string) => void;
  onAction: (value: string) => void;
  buttonText?: string;
  buttonColor?: string;
  placeholder?: string;
  disableButton?: boolean;
  onChange?: (hasInput: boolean) => void;
}

const ActionInput: React.FC<ActionInputProps> = ({
  value,
  onTextChange,
  onAction,
  buttonText = "Send",
  buttonColor = "bg-white",
  placeholder = "Enter your message",
  disableButton = false,
}) => {
  const handleClick = () => {
    onAction(value);
  };

  return (
    <div className="flex flex-row items-center w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white focus:outline-none p-3 border-b-2 border-black w-full"
      />
      <button
        onClick={handleClick}
        disabled={disableButton}
        className={`p-3 text-black border-b-2 border-r-2 text-nowrap ${buttonColor} ${
          disableButton ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ActionInput;
