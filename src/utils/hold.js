/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Container, Graphics, Text } from "pixi.js";

export const holdInfo = {
  floor: { x: 0, y: 760, width: 950, height: 20, type: "rect", color: "#555" },
  start: {
    x: 430,
    y: 570,
    width: 60,
    height: 20,
    type: "rect",
    color: "green",
  },
  top: { x: 450, y: 200, width: 50, height: 50, type: "rect", color: "blue" },
  r1: { x: 550, y: 680, width: 60, height: 20, type: "rect", color: "purple" },
  r2: { x: 370, y: 650, width: 60, height: 20, type: "rect", color: "violet" },
  r3: { x: 550, y: 530, width: 40, height: 20, type: "rect", color: "navy" },
  r4: { x: 350, y: 450, width: 20, height: 50, type: "rect", color: "skyblue" },
  r5: { x: 480, y: 430, width: 80, height: 20, type: "rect", color: "olive" },
  r6: { x: 510, y: 400, width: 20, height: 80, type: "rect", color: "olive" },
  c1: { x: 400, y: 350, radius: 20, type: "circle", color: "orange" },
};

const startHold = new Graphics();
const topHold = new Graphics();

export const holdContainer = new Container();
holdContainer.addChild(startHold, topHold);

for (const hold of Object.values(holdInfo)) {
  const newHold = new Graphics().beginFill(hold.color).lineStyle(1, "#000");

  if (hold.type === "rect") {
    newHold.drawRect(hold.x, hold.y, hold.width, hold.height);
  } else if (hold.type === "circle") {
    newHold.drawCircle(hold.x, hold.y, hold.radius);
  }

  holdContainer.addChild(newHold);
}

startHold.position.set(holdInfo.start.x, holdInfo.start.y);
const startText = new Text("START", {
  fontFamily: "Arial",
  fontSize: 24,
  fill: "#fff",
  align: "center",
});
startHold.addChild(startText);
startText.anchor.set(0.1, 1);

topHold.position.set(holdInfo.top.x, holdInfo.top.y);
const topText = new Text("TOP", {
  fontFamily: "Arial",
  fontSize: 24,
  fill: "#fff",
  align: "center",
});
topHold.addChild(topText);
topText.anchor.set(0, 1);
