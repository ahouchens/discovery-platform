import "./App.css";
import "nes.css/css/nes.min.css";

import Peer from "peerjs";
import { useEffect, useState } from "react";
function App() {
  const [peerId, setPeerId] = useState();
  const [connectionPeerIds, setConnectionPeerIds] = useState("");
  const [name, setName] = useState("Default");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const [peerConnectionObj, setPeerConnectionObj] = useState(null);
  var peerObj = new Peer();

  const handleChange = (event) => {
    setConnectionPeerIds(event.target.value);
  };

  const connect = (event) => {
    event.preventDefault();
    console.log("About to connect to peer ids:", connectionPeerIds);
    var conn = peerObj.connect(connectionPeerIds);
    setPeerConnectionObj(conn);
    // on open will be launch when you successfully connect to PeerServer
    conn.on("open", function () {
      // here you have conn.id
      setIsConnected(true);
      let message = {
        type: "connection",
        id: peerId,
        initiator: true,
        name: name,
      };
      conn.send(JSON.stringify(message));
    });
  };

  const sendMessage = () => {
    console.log("begin send message", message);
    // console.log("peerConnectionObj", peerConnectionObj);

    let newMessage = JSON.stringify({
      type: "message",
      id: peerId,
      name: name,
      message: message,
    });
    setMessages((oldMessages) => [...oldMessages, `${name} > ${message}`]);

    peerConnectionObj.send(newMessage);
    setMessage("");
  };

  useEffect(() => {
    peerObj.on("open", function (id) {
      setPeerId(id);
    });

    peerObj.on("connection", function (conn) {
      conn.on("data", function (data) {
        let dataObj = JSON.parse(data);
        switch (dataObj.type) {
          default:
          case "connection":
            var conn = peerObj.connect(dataObj.id);
            setPeerConnectionObj(conn);
            setMessages((oldMessages) => [
              ...oldMessages,
              `${dataObj.name} has connnected!`,
            ]);
            setIsConnected(true);
            break;
          case "message":
            setMessages((oldMessages) => [
              ...oldMessages,
              `${dataObj.name} > ${dataObj.message}`,
            ]);

            break;
        }
      });
    });

    return () => {
      // alert("ON TEAR DOWN??");
    };
  }, []);

  return (
    <div className="nes-container is-dark " style={{ minWidth: "300px" }}>
      <div>Your ID:</div>
      <div style={{ width: "100%" }}>
        <strong>{peerId}</strong>
      </div>
      {/* <div>Connection IDs: {connectionPeerIds}</div> */}
      <div>
        Connected Status:{" "}
        {isConnected ? (
          <span className="nes-text is-success">Connected</span>
        ) : (
          <span className="nes-text is-warning">Not Connected</span>
        )}
      </div>
      <div>
        <label>
          Name:{" "}
          <input onChange={(e) => setName(e.target.value)} value={name}></input>
        </label>
      </div>

      {isConnected ? (
        <div className="nes-container">
          {/* <ul>
            {messages.map((msg, index) => (
              <div className="nes-balloon is-dark" key={index}>
                {msg}
              </div>
            ))}
          </ul> */}

          <div className="message-list">
            {messages.map((msg, index) => (
              <div className="message -left">
                <i class="nes-ash is-small"></i>
                <div
                  className="nes-balloon is-dark from-left "
                  style={{ verticalAlign: "top" }}
                  key={index}
                >
                  {msg}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label style={{ width: "100%" }}>
              Message:{" "}
              <input
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e);
                  }
                }}
                value={message}
              ></input>
            </label>
            <div>
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        <section className="nes-container is-dark with-title">
          <h3 className="title">Connect to a Peer</h3>

          <div>
            <label style={{ width: "100%" }}>
              Peer ID:{" "}
              <input onChange={handleChange} value={connectionPeerIds}></input>
            </label>
          </div>
          <div>
            <button onClick={connect}>Connect</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
