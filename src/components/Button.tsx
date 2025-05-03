interface ButtonProps {
  onClick: () => void;
  buttonText: string;
  buttonColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  buttonText,
  buttonColor = "bg-white",
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 text-black border-b-2 border-r-2 cursor-pointer ${buttonColor}`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
