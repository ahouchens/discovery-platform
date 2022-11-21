import { Vector } from "excalibur";

import profOak from "../avatars/oak.png";
import avatarRed from "../avatars/red.png";
import avatarLance from "../avatars/lance.png";
import avatarKoga from "../avatars/koga.png";
import avatarBirdKeeper from "../avatars/bird-keeper.png";

export type AvatarDict = {
  [key: number | string]: any;
};
export let avatarDict: AvatarDict = {
  0: avatarRed,
  1: avatarLance,
  2: avatarKoga,
  3: avatarBirdKeeper,
  4: profOak,
};

export let globalSingleton: any = {};

export type ChatMessage = {
  type: string;
  id: string;
  userId: string;
  name: string;
  message: string;
  avatarId: number;
};

export type EventMessage = {
  type: string;
  eventSubtype: string;
  id: string;
  x: number;
  y: number;
};

export type ConnectionMessage = {
  type: string;
  userId: string;
  ids: Array<string>;
  name: string;
};

export type EventMessageArgs = {
  eventSubtype: string;
  pos: Vector;
  targetId?: string;
};
