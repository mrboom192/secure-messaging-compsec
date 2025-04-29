import { useState } from 'react'

function App() {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<{ciphertext: string; plaintext: string}[]>([]);

  const sendMessage = async () => {
    // later on will we encropt message here and send to backend
    const plaintext = input;
    const ciphertext = btoa(input); //this is just a placeholder for the actual encryption
    //send to sever after setting up the backend
    setMessage([...message, {ciphertext, plaintext}]);
    setInput('');
  };

  return (
    <div className="App">
      <h1>Sercure Messenger </h1>

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
