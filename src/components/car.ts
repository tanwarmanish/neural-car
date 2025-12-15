import { GO } from "../types/key.enum.js";
import { Controls } from "./controls.js";
import { Sensor } from "./sensor.js";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: any;
  angle: number = 0;
  sensor:any;

  speed: number = 0;
  readonly accleration = 0.2;
  readonly friction = 0.05;
  readonly maxSpeed = 3;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();

    this.sensor.draw(ctx);
  }

  update() {
    this.#move();
    this.sensor.update();
  }

  #move() {
    const direction = this.controls.direction;
    if (direction[GO.Forward]) this.speed += this.accleration;
    if (direction[GO.Reverse]) this.speed -= this.accleration;
    this.speed = Math.min(this.speed, this.maxSpeed);
    this.speed = Math.max(this.speed, -this.maxSpeed);
    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
    if (Math.abs(this.speed) <= this.friction) this.speed = 0;
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (direction[GO.Left]) this.angle += 0.03 * flip;
      if (direction[GO.Right]) this.angle -= 0.03 * flip;
    }
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
