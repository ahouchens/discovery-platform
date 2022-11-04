import { useEffect, useState, useRef } from "react";

export function CopyClipboard(props) {
  const [tooltipContent, setTooltipContent] = useState();
  const [isTooltip, setIsTooltip] = useState();
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
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button
          className="nes-btn"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(props.copyContent);
              setIsTooltip(true);
            } catch (err) {
              console.error("Failed to copy: ", err);
            }
          }}
        >
          {props.label}
        </button>
        {tooltipContent}
      </div>
    </>
  );
}
