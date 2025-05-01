const ChatInput = ({}: {}) => {
  return (
    <div className="text-sm w-full p-3 flex flex-col gap-2 border-r-2 border-b-2 border-black bg-white">
      <input
        type="text"
        placeholder="Enter your message"
        className=" bg-white focus:outline-none w-72"
      />
    </div>
  );
};

export default ChatInput;
