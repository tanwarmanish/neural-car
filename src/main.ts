import { Car } from "./components/car.js";
import { Road } from "./components/road.js";

let global: {
  context: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  road: Road | null;
  car: Car | null;
} = {
  context: null,
  canvas: null,
  road: null,
  car: null,
};

main();

function main() {
  initCanvas(400);
  if (!global.context) return;
  initRoad();
  initCar();
  animate();
}

function initCanvas(width = 400) {
  const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
  if (!canvas) return;
  canvas.height = window.innerHeight;
  canvas.width = 400;
  const context = canvas.getContext("2d");
  if (!context) return;
  global["context"] = context;
  global["canvas"] = canvas;
}

function initCar() {
  const { context, road } = global;
  if (!context || !road) return;
  const car = new Car(road.getLaneCenter(1), 100, 50, 80);
  car.draw(context);
  global["car"] = car;
}

function initRoad() {
  const { canvas, context } = global;
  if (!context || !canvas) return;
  const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
  road.draw(context);
  global["road"] = road;
}

function animate() {
  const { canvas, context, road, car } = global;
  if (!canvas || !context || !road || !car) return;
  canvas.height = window.innerHeight;

  context.save();
  context.translate(0, -car.y + canvas.height * 0.7);

  road.draw(context);
  car.draw(context);
  car.update();

  context.restore();

  requestAnimationFrame(animate);
}
