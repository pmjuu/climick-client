/* eslint-disable no-param-reassign */
import { Container, Graphics, Text } from "pixi.js";

export const holdInfo = {
  floor: { x: 0, y: 760, width: 950, height: 20 },
  start: { x: 430, y: 570, width: 60, height: 20 },
  top: { x: 500, y: 470, width: 60, height: 20 },
  general1: { x: 550, y: 680, width: 60, height: 20 },
  general2: { x: 400, y: 650, width: 60, height: 20 },
};
const rectSize = [0, 0, 60, 20];

const floor = new Graphics();
const startHold = new Graphics();
const topHold = new Graphics();
const hold1 = new Graphics();
const hold2 = new Graphics();

export const holdContainer = new Container();
holdContainer.addChild(floor, startHold, topHold, hold1, hold2);

floor.position.set(holdInfo.floor.x, holdInfo.floor.y);
floor
  .beginFill("#555")
  .drawRect(0, 0, holdInfo.floor.width, holdInfo.floor.height);

startHold.position.set(holdInfo.start.x, holdInfo.start.y);
startHold.beginFill("green").drawRect(...rectSize);

const startText = new Text("START", {
  fontFamily: "Arial",
  fontSize: 24,
  fill: "#fff",
  align: "center",
});
startHold.addChild(startText);
startText.anchor.set(0.5, 1.1);

topHold.position.set(holdInfo.top.x, holdInfo.top.y);
topHold.beginFill("skyblue").drawRect(...rectSize);

const topText = new Text("TOP", {
  fontFamily: "Arial",
  fontSize: 24,
  fill: "#fff",
  align: "center",
});
topHold.addChild(topText);
topText.anchor.set(0.5, 1.1);

hold1.position.set(holdInfo.general1.x, holdInfo.general1.y);
hold1.beginFill("purple").drawRect(...rectSize);

hold2.position.set(holdInfo.general2.x, holdInfo.general2.y);
hold2.beginFill("purple").drawRect(...rectSize);
