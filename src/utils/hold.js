/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Container, Graphics, Text } from "pixi.js";

const cloud = { x: 290, y: 350 };

export const holdInfo = {
  floor: { x: -9, y: 760, width: 999, height: 20, type: "rect", color: "#999" },
  start: { x: 430, y: 560, width: 60, height: 20, type: "rect", color: "blue" },
  top: {
    x: 450,
    y: 260,
    radius: 30,
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
  b1: { x: 370, y: 700, width: 100, height: 20, type: "rect", color: "purple" },
  b2: { x: 290, y: 610, width: 80, height: 20, type: "rect", color: "purple" },
  b3: { x: 270, y: 530, width: 60, height: 20, type: "rect", color: "purple" },
  c1: { x: 570, y: 470, radius: 20, type: "circle", color: "darkred" },
  c2: {
    x: 585,
    y: 452,
    width: 15,
    height: 5,
    type: "ellipse",
    color: "#8fce00",
  },
  c3: { x: 570, y: 440, width: 5, height: 15, type: "rect", color: "#744700" },
  d1: {
    x: cloud.x + 15,
    y: cloud.y + 45,
    width: 15,
    height: 60,
    type: "rect",
    color: "#6495ed",
  },
  d2: {
    x: cloud.x + 50,
    y: cloud.y + 85,
    width: 15,
    height: 60,
    type: "rect",
    color: "#6495ed",
  },
  e3: { x: 520, y: 340, radius: 17, type: "snow", color: "white" },
  e2: { x: 440, y: 390, radius: 17, type: "snow", color: "white" },
  e1: { x: 500, y: 430, radius: 17, type: "snow", color: "white" },
  b4: { x: 420, y: 480, radius: 17, type: "snow", color: "white" },
  f0: { x: cloud.x, y: cloud.y, radius: 20, type: "circle", color: "#fff" },
  f1: {
    x: cloud.x + 30,
    y: cloud.y - 5,
    radius: 25,
    type: "circle",
    color: "#fff",
  },
  f2: {
    x: cloud.x + 55,
    y: cloud.y,
    radius: 20,
    type: "circle",
    color: "#fff",
  },
  f3: {
    x: cloud.x + 80,
    y: cloud.y + 2,
    radius: 15,
    type: "circle",
    color: "#fff",
  },
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
  } else if (hold.type === "snow") {
    newHold.drawStar(hold.x, hold.y, 15, hold.radius);
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
