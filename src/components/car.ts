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
  sensor: any;
  polygon: any;
  damaged = false;

  speed: number = 0;
  readonly accleration = 0.2;
  readonly friction = 0.05;
  readonly maxSpeed = 3;
  isDummy = false;
  color = "black";

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    color = "black",
    isDummy = false
  ) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.isDummy = isDummy;
    this.color = color;

    if (isDummy) {
      this.speed = -1;
    } else {
      this.sensor = new Sensor(this);
      this.controls = new Controls();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.polygon) return;
    ctx.fillStyle = this.damaged ? "red" : this.color;
    ctx.save();
    ctx.moveTo(this.polygon[0][0], this.polygon[0][1]);
    for (let i = 1; i < this.polygon.length; i++) {
      const points = this.polygon[i] as [number, number];
      ctx.lineTo(...points);
    }
    ctx.fill();
    ctx.restore();
    this.sensor && this.sensor.draw(ctx);
  }

  update(roadBorders: number[], traffic: any[] = []) {
    if (this.damaged) return;
    this.#move();
    this.polygon = this.#createPolygon();
    this.damaged = this.#assessDamage(roadBorders, traffic);
    this.sensor && this.sensor.update(roadBorders, traffic);
  }

  #move() {
    if (this.isDummy) {
      this.y += this.speed;
    } else {
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

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push([
      this.x - Math.sin(this.angle - alpha) * rad,
      this.y - Math.cos(this.angle - alpha) * rad,
    ]);
    points.push([
      this.x - Math.sin(this.angle + alpha) * rad,
      this.y - Math.cos(this.angle + alpha) * rad,
    ]);
    points.push([
      this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    ]);
    points.push([
      this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    ]);
    return points;
  }

  #assessDamage(roadBorders: any[], traffic: any[]) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersect(this.polygon, roadBorders[i])) return true;
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polyIntersect(this.polygon, traffic[i].polygon)) return true;
    }
    return false;
  }
}

function polyIntersect(poly1: any[], poly2: any[]) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) return true;
    }
  }
  return false;
}

function getIntersection(
  A: number[],
  B: number[],
  C: number[],
  D: number[]
): [number, number, number] | null {
  const tTop = (D[0] - C[0]) * (A[1] - C[1]) - (D[1] - C[1]) * (A[0] - C[0]);
  const uTop = (C[1] - A[1]) * (A[0] - B[0]) - (C[0] - A[0]) * (A[1] - B[1]);
  const bottom = (D[1] - C[1]) * (B[0] - A[0]) - (D[0] - C[0]) * (B[1] - A[1]);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return [lerp(A[0], B[0], t), lerp(A[1], B[1], t), t];
    }
  }
  return null;
}
function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t;
}
