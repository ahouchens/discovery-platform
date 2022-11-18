import "./App.css";
import React from "react";
import "nes.css/css/nes.min.css";
import Messages from "./components/messages";
import Peer from "peerjs";
import { useEffect, useState, useRef } from "react";
import { useBeforeunload } from "react-beforeunload";
import AvatarSelect from "./components/avatar-select";
import CopyClipboard from "./components/copy-clipboard";
import {
  avatarDict,
  ChatMessage,
  ConnectionMessage,
  EventMessage,
  EventMessageArgs,
  globalSingleton,
} from "./utils/constants";
import {
  Actor,
  Engine,
  Color,
  Input,
  Vector,
  Scene,
  CollisionType,
  Loader,
  DisplayMode,
  CollisionEndEvent,
} from "excalibur";

import { Player } from "./classes/player";
import { TiledMapResource } from "@excaliburjs/plugin-tiled";

function App() {
  const [avatarId, setAvatarId] = useState(0);

  const [peerId, setPeerId] = useState<string>("");
  const [name, setName] = useState("Default");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  const [peerConnectionObjs, setPeerConnectionObjs] = useState<Array<any>>([]);
  const [peerObj, setPeerObj] = useState(new Peer());

  // CONNECT
  const connect = async (userId: string, game: Engine) => {
    console.log("INSIDE CONNECT", userId);
    let peerItemIds = await fetch("/ids")
      .then((res) => res.json())
      .then((data) => {
        return data.ids;
      });

    if (typeof userId !== "undefined") {
      peerItemIds = [...peerItemIds, userId];
    }
    peerItemIds = peerItemIds.filter((c: string, index: number) => {
      // remove dups
      return peerItemIds.indexOf(c) === index;
    });

    // ROOT CAUSE THIS: remove empty string userId.
    peerItemIds = peerItemIds.filter((c: string, index: number) => c != "");

    peerItemIds = peerItemIds.filter((c: string, index: number) => {
      // remove dups
      return peerItemIds.indexOf(c) === index;
    });

    console.log("peerItemIds", peerItemIds);
    let updateConnectionObjs: any = [];
    let tempColors = [Color.Red, Color.Blue, Color.Yellow, Color.Black];

    peerItemIds.forEach(async (peerItemId: string, index: number) => {
      let eventPlayer = globalSingleton.game.scenes.root.actors.find(
        (actor: Actor) => actor.name == peerItemId
      );
      if (!eventPlayer) {
        const player = new Player({
          name: peerItemId, // optionally assign a name
          width: 16,
          height: 16,
          color: tempColors[Math.floor(Math.random() * tempColors.length)],
          pos: new Vector(500, 500),

          collisionType: CollisionType.Active,
          sendEventMessage: sendEventMessage,
        });
        // player.on("collisionend", (e: CollisionEndEvent) => {
        //   let isTile = e.other.hasOwnProperty("tileHeight");
        //   if (!isTile) {
        //     // console.log("COLLISION-END: OTHER IS NOT TILE", e.other.name);
        //     // sendEventMessage({ eventSubtype: "move", pos: player.pos });
        //     // setInterval(() => {
        //     //   sendEventMessage({
        //     //     eventSubtype: "move",
        //     //     pos: e.other.pos,
        //     //     targetId: e.other.name,
        //     //   });
        //     // }, 2000);
        //     // player.move(player.pos.x, player.pos.y);
        //   }
        // });
        game.add(player);
        // lock camera to player avatar
        if (peerItemId == userId) {
          game.currentScene.camera.strategy.lockToActor(player);
        }
      }

      if (peerItemId != userId) {
        setIsConnecting(true);

        var conn = await peerObj.connect(peerItemId);
        conn.on("close", function () {
          console.log("CLOSE ONE!!!");
        });
        updateConnectionObjs.push(conn);

        // on open will be launch when you successfully connect to PeerServer
        conn.on("open", function () {
          if (!isConnected) {
            setIsConnected(true);
            setIsConnecting(false);
          }
          let message: ConnectionMessage = {
            type: "connection",
            userId: userId,
            ids: peerItemIds,
            name: name,
          };
          conn.send(JSON.stringify(message));
          setPeerConnectionObjs(updateConnectionObjs);
        });
        conn.on("close", function () {
          console.log("CLOSE TWO!!!");
        });
      }
    });
  };

  // SEND
  const sendMessage = () => {
    let newMessage: ChatMessage = {
      type: "message",
      id: peerId || "",
      userId: peerId || "",
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

  const sendEventMessage = (args: EventMessageArgs) => {
    let eventMessage: EventMessage = {
      type: "event",
      eventSubtype: args.eventSubtype,
      id: args.targetId ? args.targetId : globalSingleton.peerId,
      x: args.pos.x,
      y: args.pos.y,
    };
    if (args.eventSubtype == "move") {
      console.log("move begin");
      console.log("eventMessage", eventMessage);
    }
    globalSingleton.peerConnectionObjs.forEach((peerConnectionObj: any) => {
      peerConnectionObj.send(JSON.stringify(eventMessage));
    });
  };

  useEffect(() => {
    let startGame = async () => {
      let game = new Engine({
        width: 600,
        height: 400,
        displayMode: DisplayMode.FitScreen,
        antialiasing: false,
      });
      globalSingleton.game = game;
      const tiledMapResource = new TiledMapResource("./example-city.tmx");
      // THIS POINTS TO THE ASSET IN /PUBLIC --- REMOVE SRC BASED FILES

      const loader = new Loader([tiledMapResource]);

      await game.start(loader).then(() => {
        console.log("Game loaded");

        tiledMapResource.addTiledMapToScene(game.currentScene);
      });
    };

    startGame();
    peerObj.on("open", function (id) {
      setPeerId(id);
      globalSingleton.peerId = id;

      fetch(`/ids/${id}`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
        });

      connect(id, globalSingleton.game);
    });
  }, []);
  useEffect(() => {
    peerObj.on("close", function () {
      console.log("WE GOTTA CLOSE");
    });
    peerObj.on("connection", function (conn) {
      conn.on("data", function (data: any) {
        let dataObj = JSON.parse(data);
        switch (dataObj.type) {
          default:

          case "connection":
            // NOTE: connect to all the other ids here
            if (peerId != dataObj.userId) {
              connect(peerId, globalSingleton.game);
            }
            setMessages((oldMessages) => [
              ...oldMessages,
              {
                id: dataObj.userId,
                avatarId: dataObj.avatarId,
                type: "system",
                userId: "",
                name: "",
                message: `${dataObj.name} has connected!`,
              },
            ]);
            setIsConnected(true);
            break;

          case "disconnect":
            // destroy player object
            console.log("DISCONNECT RECIEVED");
            let player = globalSingleton.game.scenes.root.actors.find(
              (actor: Actor) => actor.name == dataObj.id
            );

            globalSingleton.game.remove(player);
            break;
          case "event":
            let eventPlayer = globalSingleton.game.scenes.root.actors.find(
              (actor: Actor) => actor.name == dataObj.id
            );
            if (dataObj.eventSubtype === "move") {
              eventPlayer.move(dataObj.x, dataObj.y);
            }
            if (dataObj.eventSubtype === "up") {
              eventPlayer.moveUp(dataObj.x, dataObj.y);
            }
            if (dataObj.eventSubtype === "left") {
              eventPlayer.moveLeft(dataObj.x, dataObj.y);
            }
            if (dataObj.eventSubtype === "right") {
              eventPlayer.moveRight(dataObj.x, dataObj.y);
            }
            if (dataObj.eventSubtype === "down") {
              eventPlayer.moveDown(dataObj.x, dataObj.y);
            }
            if (dataObj.eventSubtype === "stop") {
            }
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
                userId: dataObj.userId,
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
    let handleDisconnect = async () => {
      peerConnectionObjs.forEach((peerConnectionObj) => {
        let disconnectMessage = {
          id: peerId,
          type: "disconnect",
        };
        console.log(
          "getting ready to send disconnect message!",
          disconnectMessage
        );
        peerConnectionObj.send(JSON.stringify(disconnectMessage));
      });
    };
    handleDisconnect();

    fetch(`/ids/${peerId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        console.log("DELETE", data);
      });
  });
  useEffect(() => {
    globalSingleton.peerConnectionObjs = peerConnectionObjs;
  }, [peerConnectionObjs]);
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
        selectedAvatarId={avatarId}
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
                          sendMessage();
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
