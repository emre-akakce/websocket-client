import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useEffect, useState } from "react"
const client = new W3CWebSocket('ws://127.0.0.1:8000');
function App() {
  const [username, setUsername] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer);
      if (dataFromServer.type === "message") {
        const newList = [
          ...messages,
          {msg: dataFromServer.msg, user: dataFromServer.user}
        ]
        setMessages(newList)
      }
    };
  }, [])

  useEffect(()=>{console.log('Updated messages: ' + JSON.stringify(messages))}, [messages])

  function onButtonClicked(value) {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: username
    })) 
    
/* 
    const newList = [
      ...messages,
      {msg: "fdgd", user: "gfdgfd"}
    ]
    setMessages(newList) */
  }

  function handleSubmit(username) {
    if (username != null) {
      setIsLoggedIn(true)
      console.log('Logged in')
    }
  }

  return (
    <div className="App">
      {isLoggedIn ?
        <>
          <button onClick={() => onButtonClicked("Hello !")}>Send Message</button>
          {messages.map((msg, i) => {return <p key={Math.random()}>message: {msg.msg} user: {msg.user}</p>})}
        </>
        :
        <>
          <form onSubmit={handleSubmit}>
            <input
              id="username"
              name="username"
              type="text"
              onChange={event => setUsername(event.target.value)}
              value={username}
            />
            <button type="submit">Login</button>
          </form>
        </>
      }
    </div>
  );
}

export default App;
