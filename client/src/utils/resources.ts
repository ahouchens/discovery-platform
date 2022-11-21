import { TiledMapResource } from "@excaliburjs/plugin-tiled";
import { ImageSource, SpriteSheet, Animation, range, Sprite } from "excalibur";

const tiledMapResource = new TiledMapResource("./example-city.tmx");
const tilesetPacked = new ImageSource("./tilemap_packed.png");

// Note: These paths point to items in /public/

export const Resources = {
  tiledMapResource: new TiledMapResource("./example-city.tmx"),
  tilesetPacked: new ImageSource("./tilemap_packed.png"),
};

export const Spritesheets = {
  moveDown: SpriteSheet.fromImageSource({
    image: Resources.tilesetPacked,
    grid: {
      rows: 3,
      columns: 1,
      spriteWidth: 16,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: { x: 384, y: 0 },
    },
  }),
  moveLeft: SpriteSheet.fromImageSource({
    image: Resources.tilesetPacked,
    grid: {
      rows: 3,
      columns: 1,
      spriteWidth: 16,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: { x: 368, y: 0 },
    },
  }),
  moveRight: SpriteSheet.fromImageSource({
    image: Resources.tilesetPacked,
    grid: {
      rows: 3,
      columns: 1,
      spriteWidth: 16,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: { x: 418, y: 0 },
    },
  }),
  moveUp: SpriteSheet.fromImageSource({
    image: Resources.tilesetPacked,
    grid: {
      rows: 3,
      columns: 1,
      spriteWidth: 16,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: { x: 400, y: 0 },
    },
  }),
};

export const Animations = {
  walkDown: Animation.fromSpriteSheet(Spritesheets.moveDown, range(0, 5), 200),
  walkLeft: Animation.fromSpriteSheet(Spritesheets.moveLeft, range(0, 5), 200),
  walkRight: Animation.fromSpriteSheet(
    Spritesheets.moveRight,
    range(0, 5),
    200
  ),
  walkUp: Animation.fromSpriteSheet(Spritesheets.moveUp, range(0, 5), 200),
};

export const Sprites = {
  faceUp: new Sprite({
    image: Resources.tilesetPacked,
    sourceView: {
      x: 400,
      y: 0,
      width: 16,
      height: 16,
    },
  }),
  faceDown: new Sprite({
    image: Resources.tilesetPacked,
    sourceView: {
      x: 384,
      y: 0,
      width: 16,
      height: 16,
    },
  }),
  faceLeft: new Sprite({
    image: Resources.tilesetPacked,
    sourceView: {
      x: 368,
      y: 0,
      width: 16,
      height: 16,
    },
  }),
  faceRight: new Sprite({
    image: Resources.tilesetPacked,
    sourceView: {
      x: 418,
      y: 0,
      width: 16,
      height: 16,
    },
  }),
};
