import "./App.css";
import "nes.css/css/nes.min.css";
import avatarRed from "./avatars/red.webp";
import avatarLance from "./avatars/lance.webp";
import avatarKoga from "./avatars/koga.webp";
import avatarBirdKeeper from "./avatars/bird-keeper.webp";
import Messages from "./components/messages";
import Peer from "peerjs";
import { useEffect, useState, useRef } from "react";
function App() {
  const [tooltipContent, setTooltipContent] = useState();
  const [isTooltip, setIsTooltip] = useState();

  const [avatarId, setAvatarId] = useState(0);

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

  let avatarDict = {
    0: avatarRed,
    1: avatarLance,
    2: avatarKoga,
    3: avatarBirdKeeper,
  };

  useEffect(() => {
    if (isTooltip) {
      setTooltipContent(<span className="nes-text is-success">Copied!</span>);
      setTimeout(() => {
        setIsTooltip(false);
      }, 2000);
    } else {
      setTooltipContent("");
    }
  }, [isTooltip]);

  const connect = (event) => {
    event.preventDefault();
    console.log("About to connect to peer ids:", connectionPeerIds);
    var conn = peerObj.connect(connectionPeerIds);
    setPeerConnectionObj(conn);
    // on open will be launch when you successfully connect to PeerServer
    conn.on("open", function () {
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
    let newMessage = {
      type: "message",
      id: peerId,
      name: name,
      message: message,
      avatarId: avatarId,
    };
    setMessages((oldMessages) => [...oldMessages, newMessage]);

    peerConnectionObj.send(JSON.stringify(newMessage));
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
              {
                id: dataObj.userId,
                avatarId: dataObj.avatarId,
                type: "system",
                message: `${dataObj.name} has connected!`,
              },
            ]);
            setIsConnected(true);
            break;
          case "message":
            setMessages((oldMessages) => [
              ...oldMessages,
              {
                id: dataObj.userId,
                avatarId: dataObj.avatarId,
                name: dataObj.name,
                message: dataObj.message,
                type: dataObj.type,
              },
            ]);

            break;
        }
      });
    });

    return () => {
      // Tear Down
    };
  }, []);

  return (
    <div
      className="nes-container is-dark "
      style={{ minWidth: "384px", padding: "10px" }}
    >
      <div>Your ID:</div>
      {tooltipContent}
      <div style={{ width: "100%" }}>
        <button
          className="nes-btn"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(peerId);
              setIsTooltip(true);
            } catch (err) {
              console.error("Failed to copy: ", err);
            }
          }}
        >
          {peerId}
        </button>
      </div>

      <div style={{ margin: "10px" }}>
        <div>Connected Status:</div>
        {isConnected ? (
          <span className="nes-text is-success">Connected</span>
        ) : (
          <span className="nes-text is-warning">Not Connected</span>
        )}
      </div>
      <div style={{ margin: "10px" }}>
        <label>
          Name:{" "}
          <input onChange={(e) => setName(e.target.value)} value={name}></input>
        </label>
      </div>
      <div style={{ marginBottom: "20px", marginLeft: "10px" }}>
        <label htmlFor="default_select">Select Avatar</label>
        <div className="nes-select">
          <select
            required
            id="default_select"
            value={avatarId}
            onChange={(e) => setAvatarId(e.target.value)}
          >
            <option value="0">Ash</option>
            <option value="1">Lance</option>
            <option value="2">Koga</option>
            <option value="3">Bird Keeper</option>
          </select>
        </div>
      </div>

      {isConnected ? (
        <div className="nes-container" style={{ minWidth: "100px" }}>
          <Messages messages={messages} peerId={peerId} />

          <div style={{ marginTop: "20px" }}>
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
              <button onClick={sendMessage} className="custom-button">
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <section className="nes-container is-dark with-title">
          <h3 className="title">Connect</h3>

          <div>
            <label style={{ width: "100%" }}>
              Peer ID:{" "}
              <input onChange={handleChange} value={connectionPeerIds}></input>
            </label>
          </div>
          <div>
            <button onClick={connect} className="custom-button">
              Connect
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
