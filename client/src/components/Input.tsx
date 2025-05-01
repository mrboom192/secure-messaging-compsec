import React from "react";

interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Input = ({
  value,
  onChange,
  placeholder = "Enter text here...",
}: InputProps) => {
  return (
    <div className="w-full p-3 flex flex-col gap-2 border-r-2 border-b-2 border-black bg-white">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-white focus:outline-none w-72`}
      />
    </div>
  );
};

export default Input;
