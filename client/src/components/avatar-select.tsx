import { avatarDict } from "../utils/constants";
import React, { FunctionComponent } from "react";
type AvatarSelectProps = {
  selectedAvatarId: number;
  onSelect: (args: any) => void;
};

const AvatarSelect: FunctionComponent<AvatarSelectProps> = function (
  props: AvatarSelectProps
) {
  return (
    <div style={{ marginBottom: "20px", marginLeft: "10px" }}>
      <label htmlFor="default_select">Select Avatar</label>
      <div className="nes-select">
        <select
          required
          id="default_select"
          value={props.selectedAvatarId}
          onChange={(e) => props.onSelect(e.target.value)}
        >
          <option value="0">Ash</option>
          <option value="1">Lance</option>
          <option value="2">Koga</option>
          <option value="3">Bird Keeper</option>
          <option value="4"> Prof. Oak</option>
        </select>
      </div>
    </div>
  );
};

export default AvatarSelect;
