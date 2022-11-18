const avatarRed = require("../avatars/red.png");
const avatarLance = require("../avatars/lance.png");
const avatarKoga = require("../avatars/koga.png");
const avatarBirdKeeper = require("../avatars/bird-keeper.png");
const profOak = require("../avatars/oak.png");

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
  x: string;
  y: string;
};

export type ConnectionMessage = {
  type: string;
  userId: string;
  ids: Array<string>;
  name: string;
};
