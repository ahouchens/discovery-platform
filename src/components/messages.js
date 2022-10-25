// import "./App.css";
import "nes.css/css/nes.min.css";
import avatarRed from "../avatars/red.webp";
import avatarLance from "../avatars/lance.webp";
import avatarKoga from "../avatars/koga.webp";
import avatarBirdKeeper from "../avatars/bird-keeper.webp";

import Peer from "peerjs";
import { useEffect, useState, useRef } from "react";

function Messages(props) {
  let avatarDict = {
    0: avatarRed,
    1: avatarLance,
    2: avatarKoga,
    3: avatarBirdKeeper,
  };
  const messagesParent = useRef(null);

  useEffect(() => {
    const domNode = messagesParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [props.messages]);
  return (
    <div
      className="message-list"
      ref={messagesParent}
      style={{
        height: "500px",
        overflowY: "scroll",
        display: "flex",
        minWidth: "300px",
        padding: "8px",
        flexDirection: "column",
        fontSize: "12px",
      }}
    >
      {props.messages.map((msg, index) => {
        let isMyMessage = props.peerId === msg.id;
        let isSystemMessage = msg.type === "system";

        if (isMyMessage) {
          return (
            <div
              className="message -right"
              style={{ width: "100%" }}
              key={index}
            >
              <div
                className={
                  msg.type == "system"
                    ? "nes-balloon "
                    : "nes-balloon is-dark from-right"
                }
                style={{
                  verticalAlign: "top",
                  flexGrow: 1,
                  alignSelf: "flex-start",
                }}
                key={index}
              >
                {msg.type == "system"
                  ? msg.message
                  : msg.name + ": " + msg.message}
              </div>

              {msg.type == "system" ? (
                ""
              ) : (
                <img
                  className="large-avatar"
                  style={{ verticalAlign: "bottom", userSelect: "none" }}
                  src={avatarDict[msg.avatarId]}
                />
              )}
            </div>
          );
        } else {
          return (
            <div
              className="message -left"
              style={{ width: "100%", color: "black" }}
              key={index}
            >
              {msg.type == "system" ? (
                ""
              ) : (
                <img
                  className="large-avatar"
                  style={{
                    verticalAlign: "bottom",
                    userSelect: "none",
                    width: "60px",
                  }}
                  src={avatarDict[msg.avatarId]}
                />
              )}
              <div
                className={
                  msg.type == "system"
                    ? "nes-balloon is-dark "
                    : "nes-balloon  from-left"
                }
                style={{
                  verticalAlign: "top",
                  flexGrow: 1,
                  alignSelf: "flex-start",
                }}
                key={index}
              >
                {msg.type == "system"
                  ? msg.message
                  : msg.name + ": " + msg.message}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default Messages;
