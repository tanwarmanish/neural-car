export class Road {
  x: number;
  width: number;
  laneCount = 3;
  left: number;
  right: number;
  inf = 1000000;
  top = -this.inf;
  bottom = this.inf;
  borders: any[] = [];

  constructor(x: number, width: number, laneCount: number) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;
    this.left = x - width / 2;
    this.right = x + width / 2;
    this.initBorders();
  }

  initBorders() {
    const topLeft = [this.left, this.top];
    const topRight = [this.right, this.top];
    const bottomLeft = [this.left, this.bottom];
    const bottomRight = [this.right, this.bottom];
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    const drawLine = (
      [x1, y1]: number[],
      [x2, y2]: number[],
      lineDash: number[] = []
    ) => {
      ctx.setLineDash(lineDash);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // borders
    this.borders.forEach(([from, to]) => drawLine(from, to));

    // dashes
    for (let i = 1; i < this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);
      drawLine([x, this.top], [x, this.bottom], [20, 20]);
    }
  }

  getLaneCenter(laneIndex: number = 0) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }
}

function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t;
}
