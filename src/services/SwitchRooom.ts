const doorsY = (innerHeight * 2) / 5;
const doorSection = innerWidth / 4;
const halfDoorSection = doorSection / 2 - 50;
const offset = halfDoorSection / 2;

export function whichRoom(x: number, y: number): number | undefined {
  if (y > doorsY) {
    return undefined;
  }

  return Math.ceil(x / doorSection);
}
