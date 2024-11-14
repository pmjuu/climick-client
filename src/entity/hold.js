/* eslint-disable no-restricted-syntax */
import { Container, Graphics, Text } from "pixi.js";
import { introText } from "../utils/text";

export default class HoldMap {
  constructor(holdData) {
    this.holdData = holdData;
    this.container = new Container();
    this.container.addChild(introText);

    this.startHold = new Graphics();
    this.startHold.position.set(holdData.start.x, holdData.start.y);
    const startText = new Text("START", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#fff",
      align: "center",
    });
    this.startHold.addChild(startText);
    startText.anchor.set(0.1, 1);

    this.topHold = new Graphics();
    this.topHold.position.set(holdData.top.x, holdData.top.y);
    const topText = new Text("TOP", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#fff",
      align: "center",
    });
    this.topHold.addChild(topText);
    topText.anchor.set(0.5, 2);

    this.container.addChild(this.startHold, this.topHold);

    this.newHold = new Graphics();
    this.container.addChild(this.newHold);

    for (const hold of Object.values(holdData)) {
      if (hold.type === "rect") {
        this.newHold
          .beginFill(hold.color)
          .drawRoundedRect(hold.x, hold.y, hold.width, hold.height, 5);
      } else if (hold.type === "circle") {
        this.newHold
          .beginFill(hold.color)
          .drawCircle(hold.x, hold.y, hold.radius);
      } else if (hold.type === "ellipse") {
        this.newHold
          .beginFill(hold.color)
          .drawEllipse(hold.x, hold.y, hold.width, hold.height);
      } else if (hold.type === "star") {
        this.newHold
          .beginFill(hold.color)
          .drawStar(hold.x, hold.y, 5, hold.radius);
      }
    }
  }
}
