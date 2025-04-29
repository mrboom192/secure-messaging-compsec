import { useEffect, useState } from 'react';
import { io } from "socket.io-client";



function App() {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<{ciphertext: string; plaintext: string}[]>([]);
  const [socket, setSocket] = useState<any>(null); // tracks socket

  useEffect(() => {
    const newSocket = io('http://localhost:8080'); // connect to the server
    setSocket(newSocket);

    //listen for incoming messages
    newSocket.on("receive_message", (data: any) => {
      console.log("Received message:", data);
      setMessage(prev => [...prev, data]);
    });

    //cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);



  //send message to server
  const sendMessage = async () => {
    // later on will we encropt message here and send to backend
    const plaintext = input;
    const ciphertext = btoa(input); //this is just a placeholder for the actual encryption

    //send to server
    if (socket) {
      socket.emit("send_message", { ciphertext, plaintext });
    }
    //update state
    setMessage(prev => [...prev, {ciphertext, plaintext}]);
    setInput('');
  };

  return (
    <div className="App">
      <h1>Secure Messenger </h1>

      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <h2>Messages</h2>
        {message.map((msg, idx) => (
          <div key={idx}>
            <p> <strong>Ciphertext:</strong> {msg.ciphertext}</p>
            <p> <strong>Plaintext:</strong> {msg.plaintext}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
