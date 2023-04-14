/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Container, Graphics } from "pixi.js";
import "@pixi/graphics-extras";
import { getCos, getDistance, getSin } from "./math";
import { holdInfo } from "./hold";
import moveJoint from "./moveJoint";
import moveJointByBody from "./moveJointByBody";
import gravityRotate from "./gravityRotate";
import getResultText from "./getResultText";
import { COLOR } from "../assets/constants";
import drawLimb from "./drawLimb";

const containerPosition = { x: 400, y: 640 };
const playerContainer = new Container();
playerContainer.position.set(...Object.values(containerPosition));

const body = new Graphics();
const leftUpperArm = new Graphics();
const leftForeArm = new Graphics();
const leftHand = new Graphics();
const rightUpperArm = new Graphics();
const rightForeArm = new Graphics();
const rightHand = new Graphics();
const leftThigh = new Graphics();
const leftCalf = new Graphics();
const leftFoot = new Graphics();
const rightThigh = new Graphics();
const rightCalf = new Graphics();
const rightFoot = new Graphics();
playerContainer.addChild(leftThigh, leftCalf, leftFoot);
playerContainer.addChild(rightThigh, rightCalf, rightFoot);
playerContainer.addChild(body);
playerContainer.addChild(leftUpperArm, leftForeArm, leftHand);
playerContainer.addChild(rightUpperArm, rightForeArm, rightHand);
const bodyWidth = 30;
const bodyHeight = 60;
const headRadius = 15;
const leftShoulder = { x: 50, y: 0 };
const rightShoulder = {
  x: leftShoulder.x + bodyWidth * getCos(body.angle),
  y: leftShoulder.y + bodyWidth * getSin(body.angle),
};
const leftCoxa = {
  x: leftShoulder.x - bodyHeight * getSin(body.angle),
  y: leftShoulder.y + bodyHeight * getCos(body.angle),
};
const rightCoxa = {
  x: rightShoulder.x - bodyHeight * getSin(body.angle),
  y: rightShoulder.y + bodyHeight * getCos(body.angle),
};
const armLength = 40;
const armWidth = 10;
const legLength = 50;
const legWidth = 15;
const handRadius = 10;
const footRadius = 12;

const leftArmList = [leftHand, leftForeArm, leftUpperArm, leftShoulder];
const rightArmList = [rightHand, rightForeArm, rightUpperArm, rightShoulder];
const leftLegList = [leftFoot, leftCalf, leftThigh, leftCoxa];
const rightLegList = [rightFoot, rightCalf, rightThigh, rightCoxa];
const armSize = [armWidth, armLength];
const legSize = [legWidth, legLength];

// body setting
body
  .beginFill("#744700")
  .drawCircle(bodyWidth / 2, -headRadius * 1.3, headRadius)
  .lineStyle(10, COLOR.PANTS)
  .beginFill("#000")
  .drawRoundedRect(0, 0, bodyWidth, bodyHeight, 10)
  .lineStyle(13, COLOR.PANTS)
  .drawRoundedRect(0, bodyHeight / 2 + 10, bodyWidth, bodyHeight / 2, 10)
  .lineStyle("none")
  .beginFill("#fff")
  .drawStar(bodyWidth / 2, bodyHeight / 2, 5, 10);

body.position.set(leftShoulder.x, leftShoulder.y);

leftHand
  .lineStyle(1, COLOR.DARK_SKIN)
  .beginFill(COLOR.SKIN)
  .drawCircle(0, 0, handRadius);
rightHand
  .lineStyle(1, COLOR.DARK_SKIN)
  .beginFill(COLOR.SKIN)
  .drawCircle(0, 0, handRadius);
leftFoot.beginFill("#333").drawCircle(0, 0, footRadius);
rightFoot.beginFill("#333").drawCircle(0, 0, footRadius);

drawLimb(...leftArmList, ...armSize, -1, 1, 40, 60);
drawLimb(...rightArmList, ...armSize, 1, 1, 50, 40);
drawLimb(...leftLegList, ...legSize, -1, -1, 20, 80);
drawLimb(...rightLegList, ...legSize, 1, -1, 30, 60);

// hand drag event
function onDragStart() {
  const wall = document.querySelector(".wall");
  if (!wall.getAttribute("result")) {
    wall.setAttribute("result", "start");
  }

  this.cursor = "grabbing";
  this.alpha = this === body ? 1 : 0.5;
  this.on("pointermove", onDragging);
}

function onDragging(event) {
  const wall = document.querySelector(".wall");
  const cursorInContainer = {
    x: event.client.x - wall.offsetLeft - containerPosition.x,
    y: event.client.y - wall.offsetTop - containerPosition.y,
  };

  if (this === body) return moveBodyTo(cursorInContainer);

  if (this === leftHand)
    return moveJoint(...leftArmList, ...armSize, cursorInContainer, 1, 1);
  if (this === rightHand)
    return moveJoint(...rightArmList, ...armSize, cursorInContainer, -1, 1);
  if (this === leftFoot)
    return moveJoint(...leftLegList, ...legSize, cursorInContainer, -1, -1);
  if (this === rightFoot)
    return moveJoint(...rightLegList, ...legSize, cursorInContainer, 1, -1);
}

let exceededPart = null;
function moveBodyTo(cursorInContainer) {
  if (exceededPart) return onDragEnd();

  leftShoulder.x = cursorInContainer.x - bodyWidth / 2;
  leftShoulder.y = cursorInContainer.y - bodyHeight / 2;

  rightShoulder.x = leftShoulder.x + bodyWidth * getCos(body.angle);
  rightShoulder.y = leftShoulder.y + bodyWidth * getSin(body.angle);
  leftCoxa.x = leftShoulder.x - bodyHeight * getSin(body.angle);
  leftCoxa.y = leftShoulder.y + bodyHeight * getCos(body.angle);
  rightCoxa.x = rightShoulder.x - bodyHeight * getSin(body.angle);
  rightCoxa.y = rightShoulder.y + bodyHeight * getCos(body.angle);

  if (!exceededPart)
    exceededPart = moveJointByBody(...leftArmList, ...armSize, 1, 1);
  if (!exceededPart)
    exceededPart = moveJointByBody(...rightArmList, ...armSize, -1, 1);
  if (!exceededPart)
    exceededPart = moveJointByBody(...leftLegList, ...legSize, -1, -1);
  if (!exceededPart)
    exceededPart = moveJointByBody(...rightLegList, ...legSize, 1, -1);

  if (!exceededPart) {
    body.position.set(leftShoulder.x, leftShoulder.y);
  }
}

const attachedStatus = {
  leftHandOnTop: 0,
  rightHandOnTop: 0,
  leftHand: 1,
  rightHand: 1,
};
const initialContainerHeight = playerContainer.height;

function onDragEnd() {
  const retrievePX = 0.5;
  if (exceededPart === leftHand) {
    exceededPart = null;
    moveBodyTo({
      x: body.x - retrievePX + bodyWidth / 2,
      y: body.y - retrievePX + bodyHeight / 2,
    });
  }
  if (exceededPart === rightHand) {
    exceededPart = null;
    moveBodyTo({
      x: body.x + retrievePX + bodyWidth / 2,
      y: body.y - retrievePX + bodyHeight / 2,
    });
  }
  if (exceededPart === leftFoot) {
    exceededPart = null;
    moveBodyTo({
      x: body.x - retrievePX + bodyWidth / 2,
      y: body.y + retrievePX + bodyHeight / 2,
    });
  }
  if (exceededPart === rightFoot) {
    exceededPart = null;
    moveBodyTo({
      x: body.x + retrievePX + bodyWidth / 2,
      y: body.y + retrievePX + bodyHeight / 2,
    });
  }

  playerContainer.children.forEach(child => {
    child.cursor = "grab";
    child.alpha = 1;
    child.off("pointermove");
  });

  if (!this) return;

  for (const hold of Object.values(holdInfo)) {
    const cursor = {
      x: this.x + containerPosition.x,
      y: this.y + containerPosition.y,
    };

    const handFootRadius =
      this === leftHand || this === rightHand ? handRadius : footRadius;

    const isAttachedToHold = hold.radius
      ? getDistance(hold, cursor) < hold.radius + handFootRadius
      : hold.x - handFootRadius < cursor.x &&
        cursor.x < hold.x + hold.width + handFootRadius &&
        hold.y - handFootRadius < cursor.y &&
        cursor.y < hold.y + hold.height + handFootRadius;

    if (isAttachedToHold) {
      if (this === leftHand) {
        attachedStatus.leftHand = 1;

        if (hold.text === "top") attachedStatus.leftHandOnTop = 1;
      }

      if (this === rightHand) {
        attachedStatus.rightHand = 1;

        if (hold.text === "top") attachedStatus.rightHandOnTop = 1;
      }

      if (attachedStatus.leftHandOnTop && attachedStatus.rightHandOnTop) {
        document.querySelector(".wall").setAttribute("result", "success");
        playerContainer.addChild(getResultText("Success!"));
        playerContainer.eventMode = "none";
      }

      return;
    }
  }

  if (this === leftHand) attachedStatus.leftHand = 0;
  if (this === rightHand) attachedStatus.rightHand = 0;

  if (attachedStatus.leftHand === 0 && attachedStatus.rightHand === 0) {
    let descentVelocity = 0;

    const gravity = setInterval(() => {
      descentVelocity += 0.5;
      playerContainer.y += descentVelocity * 0.2;

      const isPlayerAboveGround =
        playerContainer.y <
        containerPosition.y -
          leftShoulder.y +
          (initialContainerHeight - playerContainer.height);

      if (!isPlayerAboveGround) {
        clearInterval(gravity);
        document.querySelector(".wall").setAttribute("result", "fail");
        playerContainer.addChild(getResultText("Fail..."));
        playerContainer.eventMode = "none";
      }
    }, 10);

    return;
  }

  if (this === leftHand) gravityRotate(...leftArmList, ...armSize, -1, 1);
  if (this === rightHand) gravityRotate(...rightArmList, ...armSize, 1, 1);
  if (this === leftFoot) gravityRotate(...leftLegList, ...legSize, -1, -1);
  if (this === rightFoot) gravityRotate(...rightLegList, ...legSize, 1, -1);
}

const limbs = [leftHand, rightHand, leftFoot, rightFoot, body];
limbs.forEach(limb => {
  limb.eventMode = "dynamic";
  limb
    .on("pointerover", function () {
      this.cursor = "grab";
    })
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd);
});

document.body.addEventListener("pointerup", onDragEnd);

export default playerContainer;
