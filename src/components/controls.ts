import {
  GO_FORWARD,
  GO_LEFT,
  GO_REVERSE,
  GO_RIGHT,
  GO,
} from "./../types/key.enum.js";

export class Controls {
  direction: { [key: number]: boolean } = {
    [GO.Forward]: false,
    [GO.Right]: false,
    [GO.Reverse]: false,
    [GO.Left]: false,
  };

  constructor() {
    this.listeners();
  }

  activeDirection(key: any): number {
    const KEY_MAP = [GO_FORWARD, GO_LEFT, GO_RIGHT, GO_REVERSE];
    const KEY_PRESS = KEY_MAP.map((E, index) => (E[key] ? GO[index] : null))
      .map((d, i) => (d === null ? d : i))
      .filter((x) => x !== null)[0];
    return KEY_PRESS;
  }

  listeners() {
    document.addEventListener("keydown", ($event) => {
      const dir = this.activeDirection($event.key);
      if (!(dir in this.direction)) return;
      this.direction[dir] = true;
    });

    document.addEventListener("keyup", ($event) => {
      const dir = this.activeDirection($event.key);
      if (!(dir in this.direction)) return;
      this.direction[dir] = false;
    });
  }
}
