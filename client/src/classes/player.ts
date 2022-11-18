import {
  Actor,
  Engine,
  Color,
  Input,
  Vector,
  Scene,
  CollisionType,
  SpriteSheet,
  Animation,
  range,
} from "excalibur";
import { EventMessageArgs, globalSingleton } from "../utils/constants";

export class Player extends Actor {
  speed: number;
  sendEventMessage: (args: EventMessageArgs) => void;

  constructor(args: any) {
    super(args);
    // this.x = args.x;
    // this.y = args.y;
    this.speed = 1;
    this.sendEventMessage = args.sendEventMessage;
  }

  update(engine: Engine, delta: any) {
    if (globalSingleton.peerId != this.name) return;

    if (engine.input.keyboard.isHeld(Input.Keys.W)) {
      // this.sendEventMessage("up", this.pos);
      this.sendEventMessage({
        eventSubtype: "up",
        pos: this.pos,
        targetId: this.name,
      });
      this.moveUp(this.pos.x, this.pos.y);
    }

    if (engine.input.keyboard.isHeld(Input.Keys.S)) {
      // this.sendEventMessage("down", this.pos);
      this.sendEventMessage({
        eventSubtype: "down",
        pos: this.pos,
        targetId: this.name,
      });

      this.moveDown(this.pos.x, this.pos.y);

      const moveDownSpriteSheet = SpriteSheet.fromImageSource({
        image: globalSingleton.kennyCardsImage,
        grid: {
          rows: 3,
          columns: 1,
          spriteWidth: 16,
          spriteHeight: 16,
        },
        spacing: {
          originOffset: { x: 384, y: 0 },
        },
      });
      let walkDown = Animation.fromSpriteSheet(
        moveDownSpriteSheet,
        range(0, 5),
        200
      );

      this.graphics.use(walkDown);
    }
    if (engine.input.keyboard.isHeld(Input.Keys.D)) {
      this.sendEventMessage({
        eventSubtype: "right",
        pos: this.pos,
        targetId: this.name,
      });
      this.moveRight(this.pos.x, this.pos.y);
    }
    if (engine.input.keyboard.isHeld(Input.Keys.A)) {
      this.sendEventMessage({
        eventSubtype: "left",
        pos: this.pos,
        targetId: this.name,
      });

      this.moveLeft(this.pos.x, this.pos.y);

      const moveLeftSpriteSheet = SpriteSheet.fromImageSource({
        image: globalSingleton.kennyCardsImage,
        grid: {
          rows: 3,
          columns: 1,
          spriteWidth: 16,
          spriteHeight: 16,
        },
        spacing: {
          originOffset: { x: 368, y: 0 },
        },
      });

      let walkLeft = Animation.fromSpriteSheet(
        moveLeftSpriteSheet,
        range(0, 5),
        200
      );

      this.graphics.use(walkLeft);
    }

    if (
      engine.input.keyboard.wasReleased(Input.Keys.S) ||
      engine.input.keyboard.wasReleased(Input.Keys.W)
    ) {
      // this.vel.y = 0;
      // this.sendEventMessage("stop", this.pos);
    }
  }
  move(x: number, y: number) {
    this.pos = new Vector(x, y);
  }
  moveLeft(x: number, y: number) {
    this.pos = new Vector((x += -this.speed), y);
  }
  moveRight(x: number, y: number) {
    this.pos = new Vector((x += this.speed), y);
  }
  moveUp(x: number, y: number) {
    this.pos = new Vector(x, (y += -this.speed));
  }
  moveDown(x: number, y: number) {
    this.pos = new Vector(x, y + this.speed);
  }
  stop() {
    // this.y = 0;
  }
}
