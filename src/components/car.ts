import { GO } from "../types/key.enum.js";
import { Controls } from "./controls.js";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: any;

  speed: number = 0;
  readonly accleration = 0.25;
  readonly friction = 0.05;
  readonly maxSpeed = 3;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.controls = new Controls();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }

  update() {
    const direction = this.controls.direction;
    this.verticalMovement(direction);
  }

  verticalMovement(direction: any) {
    if (direction[GO.Forward]) this.speed += this.accleration;
    if (direction[GO.Reverse]) this.speed -= this.accleration;
    this.speed = Math.min(this.speed, this.maxSpeed);
    this.speed = Math.max(this.speed, -this.maxSpeed);
    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
    if (Math.abs(this.speed) <= this.friction) this.speed = 0;
    this.y += this.speed;
  }
}
