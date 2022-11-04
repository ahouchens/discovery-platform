import "./App.css";
import "nes.css/css/nes.min.css";
import Messages from "./components/messages";
import Peer from "peerjs";
import { useEffect, useState, useRef } from "react";
import { useBeforeunload } from "react-beforeunload";
import { AvatarSelect } from "./components/avatar-select";
import { CopyClipboard } from "./components/copy-clipboard";
import { avatarDict } from "./utils/constants";

function App() {
  const [avatarId, setAvatarId] = useState(0);

  const [peerId, setPeerId] = useState();
  const [name, setName] = useState("Default");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState([]);

  const [peerConnectionObjs, setPeerConnectionObjs] = useState([]);
  const [peerObj, setPeerObj] = useState(new Peer());

  // CONNECT
  const connect = async (userId) => {
    let peerItemIds = await fetch("/ids")
      .then((res) => res.json())
      .then((data) => {
        return data.ids;
      });

    if (typeof userId !== "undefined") {
      peerItemIds = [...peerItemIds, userId];
    }
    peerItemIds = peerItemIds.filter((c, index) => {
      // remove dups
      return peerItemIds.indexOf(c) === index;
    });

    let updateConnectionObjs = [];

    peerItemIds.forEach(async (peerItem) => {
      if (peerItem != userId) {
        setIsConnecting(true);
        console.log("peerItem", peerItem);

        var conn = await peerObj.connect(peerItem);

        updateConnectionObjs.push(conn);

        // on open will be launch when you successfully connect to PeerServer
        conn.on("open", function () {
          if (!isConnected) {
            setIsConnected(true);
            setIsConnecting(false);
          }
          let message = {
            type: "connection",
            userId: userId,
            ids: peerItemIds,
            initiator: true,
            name: name,
          };
          conn.send(JSON.stringify(message));
          setPeerConnectionObjs(updateConnectionObjs);
        });
      }
    });
  };

  // SEND
  const sendMessage = () => {
    let newMessage = {
      type: "message",
      id: peerId,
      userId: peerId,
      name: name,
      message: message,
      avatarId: avatarId,
    };
    setMessages((oldMessages) => [...oldMessages, newMessage]);

    peerConnectionObjs.forEach((peerConnectionObj) => {
      peerConnectionObj.send(JSON.stringify(newMessage));
    });
    setMessage("");
  };

  useEffect(() => {
    peerObj.on("open", function (id) {
      setPeerId(id);

      fetch(`/ids/${id}`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
        });

      connect(id);
    });

    peerObj.on("connection", function (conn) {
      conn.on("data", function (data) {
        let dataObj = JSON.parse(data);
        switch (dataObj.type) {
          default:
          case "connection":
            // NOTE: connect to all the other ids here
            if (peerId != dataObj.userId) {
              connect(peerId);
            }
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

  useBeforeunload((event) => {
    event.preventDefault();
    fetch(`/ids/${peerId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        console.log("DELETE", data);
      });
  });

  return (
    <div
      className="nes-container is-dark "
      style={{ minWidth: "384px", padding: "10px" }}
    >
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

      <AvatarSelect
        onSelect={(id) => setAvatarId(id)}
        selectedAvatar={avatarId}
      />

      <div className="nes-container" style={{ minWidth: "100px" }}>
        {isConnecting ? (
          <div style={{ padding: "100px", display: "flex" }}>
            <div id="loader" style={{ position: "relative" }}></div>
          </div>
        ) : (
          <>
            {isConnected ? (
              <>
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
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <img src={avatarDict["4"]} style={{ width: "100px" }} />{" "}
                <div style={{ margin: "10px" }}>You're the only one here.</div>
                <CopyClipboard
                  label="Share this link!"
                  copyContent={window.location.href}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
