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
import { Animations, Sprites } from "../utils/resources";

const inputBufferDelay = 20;

enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}
export class Player extends Actor {
  speed: number;
  sendEventMessage: (args: EventMessageArgs) => void;
  faceDirection: Direction = Direction.Down;

  constructor(args: any) {
    super(args);
    // this.x = args.x;
    // this.y = args.y;
    this.speed = 50;
    this.sendEventMessage = args.sendEventMessage;
    this.faceDirection = Direction.Down;
    this.graphics.use(Sprites.faceDown);
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
    }

    if (
      engine.input.keyboard.wasReleased(Input.Keys.D) ||
      engine.input.keyboard.wasReleased(Input.Keys.A) ||
      engine.input.keyboard.wasReleased(Input.Keys.S) ||
      engine.input.keyboard.wasReleased(Input.Keys.W)
    ) {
      this.sendEventMessage({
        eventSubtype: "stop",
        pos: this.pos,
        targetId: this.name,
      });
      this.stop(this.pos.x, this.pos.y);
    }
  }
  move(x: number, y: number) {
    this.pos = new Vector(x, y);
  }
  moveLeft(x: number, y: number) {
    if (x <= this.pos.x) {
      setTimeout(() => {
        this.graphics.use(Animations.walkLeft);
        this.vel.x = -this.speed;
        this.faceDirection = Direction.Left;
      }, inputBufferDelay);
    }

    // this.pos = new Vector(x, y);

    // this.pos = new Vector((x += -this.speed), y);
  }
  moveRight(x: number, y: number) {
    if (x >= this.pos.x) {
      // this.pos = new Vector(x, y);

      // this.pos = new Vector((x += this.speed), y);
      setTimeout(() => {
        this.graphics.use(Animations.walkRight);
        this.vel.x = this.speed;
        this.faceDirection = Direction.Right;
      }, inputBufferDelay);
    }
  }
  moveUp(x: number, y: number) {
    if (y <= this.pos.y) {
      setTimeout(() => {
        // this.pos = new Vector(x, y);
        this.vel.y = -this.speed;
        this.graphics.use(Animations.walkUp);
        this.faceDirection = Direction.Up;
      }, inputBufferDelay);
    }
  }
  moveDown(x: number, y: number) {
    // this.pos = new Vector(x, y + this.speed);
    if (y >= this.pos.y) {
      // this.pos = new Vector(x, y);
      setTimeout(() => {
        this.vel.y = this.speed;
        this.graphics.use(Animations.walkDown);
        this.faceDirection = Direction.Down;
      }, inputBufferDelay);
    }
  }
  stop(x: number, y: number) {
    console.log("GOT A STOP!", this.id);
    setTimeout(() => {
      this.vel.y = 0;
      this.vel.x = 0;
      this.pos = new Vector(x, y);
      switch (this.faceDirection) {
        case Direction.Up:
          this.graphics.use(Sprites.faceUp);
          break;
        case Direction.Left:
          this.graphics.use(Sprites.faceLeft);
          break;
        case Direction.Right:
          this.graphics.use(Sprites.faceRight);
          break;
        case Direction.Down:
          console.log("DONW?");
          this.graphics.use(Sprites.faceDown);
          break;
      }
    }, inputBufferDelay);
  }
}
