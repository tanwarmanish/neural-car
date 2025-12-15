import { Car } from "./car.js";

export class Sensor {
  car: Car;
  rayCount = 5;
  rayLength = 100;
  raySpread = Math.PI / 2;
  rays: any = [];

  constructor(car: Car) {
    this.car = car;
  }

  update() {
    this.#castRays();
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

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.setLineDash([]);
      if (this.rays[i]) {
        ctx.moveTo(this.rays[i][0][0], this.rays[i][0][1]);
        ctx.lineTo(this.rays[i][1][0], this.rays[i][1][1]);
      }
      ctx.stroke();
    }
  }
}

function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t;
}
