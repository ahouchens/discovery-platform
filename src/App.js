import logo from "./logo.svg";
import "./App.css";
import Peer from "peerjs";
import { useCallback } from "react";
import { useEffect, useState, useRef } from "react";
function App() {
  const [peerId, setPeerId] = useState();
  const [connectionPeerIds, setConnectionPeerIds] = useState("");
  const [peer, setPeer] = useState();
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

  const sendMessage = (event) => {
    console.log("begin send message", message);
    // console.log("peerConnectionObj", peerConnectionObj);

    let newMessage = JSON.stringify({
      type: "message",
      id: peerId,
      name: name,
      message: message,
    });
    setMessages((oldMessages) => [...oldMessages, `${name} - ${message}`]);

    peerConnectionObj.send(newMessage);
  };

  useEffect(() => {
    peerObj.on("open", function (id) {
      setPeerId(id);
    });

    peerObj.on("connection", function (conn) {
      conn.on("data", function (data) {
        console.log("RECEIEVED!", data);

        let dataObj = JSON.parse(data);
        switch (dataObj.type) {
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
            console.log("dataObj on message recieved", dataObj);
            console.log("BEFORE value of messages array", messages);
            setMessages((oldMessages) => [
              ...oldMessages,
              `${dataObj.name} - ${dataObj.message}`,
            ]);
            console.log("AFTER value of messages array", messages);

            break;
        }
      });
    });
  }, []);

  return (
    <div>
      <div>
        Your ID: <strong>{peerId}</strong>
      </div>
      {/* <div>Connection IDs: {connectionPeerIds}</div> */}
      <div>
        Connected Status: {isConnected ? "Connected!" : "Not Connected"}
      </div>
      <div>
        <label>
          Name:{" "}
          <input onChange={(e) => setName(e.target.value)} value={name}></input>
        </label>
      </div>

      {isConnected ? (
        <div>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>

          <div>
            <label>
              Message:{" "}
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></input>
            </label>
            <div>
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div>Connect to a peer.</div>

          <div>
            <label>
              Peer ID:{" "}
              <input onChange={handleChange} value={connectionPeerIds}></input>
            </label>
          </div>
          <div>
            <button onClick={connect}>Connect</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
