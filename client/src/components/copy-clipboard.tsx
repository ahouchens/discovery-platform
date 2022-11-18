import {
  useEffect,
  useState,
  useRef,
  SetStateAction,
  FunctionComponent,
} from "react";
import React from "react";
type CopyClipboardProps = {
  copyContent: string;
  label: string;
};

const CopyClipboard: FunctionComponent<CopyClipboardProps> = function (
  props: CopyClipboardProps
) {
  const [tooltipContent, setTooltipContent] = useState<any>();
  const [isTooltip, setIsTooltip] = useState<boolean>(false);
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
};
export default CopyClipboard;
