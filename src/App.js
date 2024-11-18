import PieSocket from 'piesocket-js';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 

function App() {
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState([]);
  const [channel, setChannel] = useState(null);
  const [username, setUsername] = useState(`User_${uuidv4().slice(0, 8)}`);

  useEffect(() => {
    const pieSocket = new PieSocket({
      clusterId: "free.blr2",
      apiKey: "RKDHkqm3zeHFUWFOg5mVVSwt2WBkUJqDFGxQ706W",
      notifySelf: true
    });
    pieSocket.subscribe("chat-room").then((channel) => {
      console.log("Channel is ready")
      setChannel(channel);
      channel.listen("new_message", (data, meta) => {
        console.log("New message: ", data);
        const message = {
          text: data.message,
          sender: data.sender,
          isSelf: data.sender === username
        };
        setDisplayValue((prevDisplayValue) => [...prevDisplayValue, message]);
      });
    });
  }, []);

  const handleSendMessage = () => {
    if (!channel) return;
    channel.publish("new_message", {
      message: inputValue,
      sender: username
    });
    setInputValue('');
  };

  return (
    <div className="App" style={{ height: "95vh", width: "100%", display: "flex", justifyContent: "end", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <div style={{
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "20px",
        height: "60vh",
        overflowY: "auto",
        padding: "10px",
        width: "80vw"
      }}>
        {displayValue.map((message, index) => (
          <div key={index} style={{
            display: "flex",
            justifyContent: message.isSelf ? "flex-end" : "flex-start",
            marginBottom: "10px",
            alignItems: message.isSelf ? "flex-end" : "flex-start"
          }}>
            <div style={{
              backgroundColor: message.isSelf ? "#DCF8C6" : "#F7F7F7",
              padding: "10px",
              borderRadius: "10px", 
              maxWidth: "70%"
            }}>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>{message.sender}:</span>
              <br />
              <span>{message.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <input
          type="text"
          id="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "18px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: "1000px",
            marginRight: "10px"
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px",
            fontSize: "18px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
