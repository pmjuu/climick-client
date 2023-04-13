/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Container, Graphics, Text } from "pixi.js";

export const holdInfo = {
  floor: { x: -9, y: 760, width: 999, height: 20, type: "rect", color: "#555" },
  start: { x: 430, y: 570, width: 60, height: 20, type: "rect", color: "blue" },
  top: {
    x: 450,
    y: 530,
    radius: 25,
    type: "circle",
    color: "yellow",
    text: "top",
  },
  a0: { x: 570, y: 680, width: 20, height: 80, type: "rect", color: "#744700" },
  a1: { x: 530, y: 680, width: 100, height: 20, type: "rect", color: "green" },
  a2: { x: 540, y: 660, width: 80, height: 20, type: "rect", color: "green" },
  a3: { x: 550, y: 640, width: 60, height: 20, type: "rect", color: "green" },
  a4: { x: 560, y: 620, width: 40, height: 20, type: "rect", color: "green" },
  a5: { x: 570, y: 600, width: 20, height: 20, type: "rect", color: "green" },
  b1: { x: 370, y: 650, width: 60, height: 20, type: "rect", color: "purple" },
  c1: { x: 570, y: 540, radius: 20, type: "circle", color: "darkred" },
  c2: {
    x: 585,
    y: 522,
    width: 15,
    height: 5,
    type: "ellipse",
    color: "#8fce00",
  },
  c3: { x: 570, y: 510, width: 5, height: 15, type: "rect", color: "#744700" },
  d1: { x: 350, y: 400, width: 20, height: 60, type: "rect", color: "skyblue" },
  d2: { x: 390, y: 440, width: 20, height: 60, type: "rect", color: "skyblue" },
  e1: { x: 480, y: 430, width: 80, height: 20, type: "rect", color: "navy" },
  e2: { x: 510, y: 400, width: 20, height: 80, type: "rect", color: "navy" },
  f0: { x: 355, y: 355, radius: 20, type: "circle", color: "#fff" },
  f1: { x: 385, y: 350, radius: 25, type: "circle", color: "#fff" },
  f2: { x: 410, y: 355, radius: 20, type: "circle", color: "#fff" },
  f3: { x: 435, y: 357, radius: 15, type: "circle", color: "#fff" },
};

const startHold = new Graphics();
const topHold = new Graphics();

export const holdContainer = new Container();
holdContainer.addChild(startHold, topHold);

for (const hold of Object.values(holdInfo)) {
  const newHold = new Graphics().beginFill(hold.color);

  if (hold.type === "rect") {
    newHold.drawRoundedRect(hold.x, hold.y, hold.width, hold.height, 5);
  } else if (hold.type === "circle") {
    newHold.drawCircle(hold.x, hold.y, hold.radius);
  } else if (hold.type === "ellipse") {
    newHold.drawEllipse(hold.x, hold.y, hold.width, hold.height);
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
topText.anchor.set(0.5, 2);
