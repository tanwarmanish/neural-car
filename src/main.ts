import { Car } from "./components/car.js";

main();

function main() {
  const { canvas, context } = getContext(400);
  if (!context) return;
  const car = initCar(context);
  animate(car, canvas, context);
}

function getContext(width = 400) {
  const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
  canvas.height = window.innerHeight;
  canvas.width = 400;
  const context = canvas.getContext("2d");
  return { canvas, context };
}

function initCar(context: CanvasRenderingContext2D) {
  const car = new Car(100, 100, 50, 80);
  car.draw(context);
  return car;
}

function animate(
  car: Car,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  canvas.height = window.innerHeight;
  car.update();
  car.draw(context);
  requestAnimationFrame(() => animate(car, canvas, context));
}
