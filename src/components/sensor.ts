import { Car } from "./car.js";

export class Sensor {
  car: Car;
  rayCount = 5;
  rayLength = 100;
  raySpread = Math.PI / 2;
  rays: any = [];
  readings: any = [];

  constructor(car: Car) {
    this.car = car;
  }

  update(roadBorders: number[]) {
    this.#castRays();
    this.readings = [];
    for (let ray of this.rays) {
      this.readings.push(this.#getReading(ray, roadBorders));
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          i / (this.rayCount - 1 || 0.5)
        ) + this.car.angle;
      const start = [this.car.x, this.car.y];
      const end = [
        this.car.x - Math.sin(rayAngle) * this.rayLength,
        this.car.y - Math.cos(rayAngle) * this.rayLength,
      ];
      this.rays.push([start, end]);
    }
  }

  #getReading(ray: any[], roadBorders: any[]) {
    // bind points of contact i.e. intersection of two lines
    let touches: any[] = [];
    for (let border of roadBorders) {
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) touches.push(touch);
    }

    if (touches.length == 0) return null;
    const offsets = touches.map((e) => e[2]);
    const minOffset = Math.min(...offsets);
    return touches.find((e) => e[2] === minOffset);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i] ? this.rays[i][1] : null;
      if (this.readings[i]) end = this.readings[i];
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.setLineDash([]);
      if (this.rays[i]) {
        ctx.moveTo(this.rays[i][0][0], this.rays[i][0][1]);
        ctx.lineTo(end[0], end[1]);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.setLineDash([]);
      if (this.rays[i]) {
        ctx.moveTo(this.rays[i][1][0], this.rays[i][1][1]);
        ctx.lineTo(end[0], end[1]);
      }
      ctx.stroke();
    }
  }
}

function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t;
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
