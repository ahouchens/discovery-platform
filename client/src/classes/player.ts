import {
  Actor,
  Engine,
  Color,
  Input,
  Vector,
  Scene,
  CollisionType,
} from "excalibur";
import { globalSingleton } from "../utils/constants";

export class Player extends Actor {
  speed: number;
  sendEventMessage: (...args: any) => void;

  constructor(args: any) {
    super(args);
    // this.x = args.x;
    // this.y = args.y;
    this.speed = 4;
    this.sendEventMessage = args.sendEventMessage;
  }

  update(engine: Engine, delta: any) {
    if (globalSingleton.peerId != this.name) return;

    if (engine.input.keyboard.isHeld(Input.Keys.W)) {
      this.sendEventMessage("up", this.pos);
      this.moveUp(this.pos.x, this.pos.y);
    }

    if (engine.input.keyboard.isHeld(Input.Keys.S)) {
      this.sendEventMessage("down", this.pos);
      this.moveDown(this.pos.x, this.pos.y);
    }
    if (engine.input.keyboard.isHeld(Input.Keys.D)) {
      this.sendEventMessage("right", this.pos);
      this.moveRight(this.pos.x, this.pos.y);
    }
    if (engine.input.keyboard.isHeld(Input.Keys.A)) {
      this.sendEventMessage("left", this.pos);
      this.moveLeft(this.pos.x, this.pos.y);
    }

    if (
      engine.input.keyboard.wasReleased(Input.Keys.S) ||
      engine.input.keyboard.wasReleased(Input.Keys.W)
    ) {
      // this.vel.y = 0;
      this.sendEventMessage("stop", this.pos);
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
