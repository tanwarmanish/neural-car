export class Road {
  x: number;
  width: number;
  laneCount = 3;
  left: number;
  right: number;
  inf = 1000000;
  top = -this.inf;
  bottom = this.inf;

  constructor(x: number, width: number, laneCount: number) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;
    this.left = x - width / 2;
    this.right = x + width / 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);
      ctx.setLineDash([]);
      if (i > 0 && i < this.laneCount) ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }

  getLaneCenter(laneIndex: number=0) {
    const laneWidth = this.width / this.laneCount;
    return this.left + laneWidth / 2 + Math.min(laneIndex,this.laneCount-1) * laneWidth;
  }
}

function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t;
}
