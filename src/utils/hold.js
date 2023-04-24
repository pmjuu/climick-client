/* eslint-disable no-restricted-syntax */
import { Container, Graphics, Text } from "pixi.js";
import holdInfo from "../assets/holdInfo";
import { introText } from "./text";

const startHold = new Graphics();
const topHold = new Graphics();

const holdContainer = new Container();
holdContainer.addChild(introText);
holdContainer.addChild(startHold, topHold);

const newHold = new Graphics();
holdContainer.addChild(newHold);

for (const hold of Object.values(holdInfo)) {
  if (hold.type === "rect") {
    newHold
      .beginFill(hold.color)
      .drawRoundedRect(hold.x, hold.y, hold.width, hold.height, 5);
  } else if (hold.type === "circle") {
    newHold.beginFill(hold.color).drawCircle(hold.x, hold.y, hold.radius);
  } else if (hold.type === "ellipse") {
    newHold
      .beginFill(hold.color)
      .drawEllipse(hold.x, hold.y, hold.width, hold.height);
  } else if (hold.type === "star") {
    newHold.beginFill(hold.color).drawStar(hold.x, hold.y, 5, hold.radius);
  }
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

export default holdContainer;
