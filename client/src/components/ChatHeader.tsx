const ChatHeader = ({ user = "Bob" }: { user: string }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="font-bold text-2xl text-white">{user}</span>
      <div className="flex-row">
        <input
          type="text"
          placeholder="Enter shared password"
          className="p-3 border-b-2 bg-white focus:outline-none w-72"
        />
        <button
          onClick={() => {
            console.log("RAN");
          }}
          className="p-3 text-black bg-emerald-300 hover:bg-emerald-500 border-b-2 border-r-2"
        >
          Set Password
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
