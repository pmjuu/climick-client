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
import { BODY, COLOR } from "../assets/constants";
import drawLimb from "./drawLimb";

const containerPosition = { x: 400, y: 630 };
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
playerContainer.addChild(leftUpperArm, leftForeArm, leftHand);
playerContainer.addChild(rightUpperArm, rightForeArm, rightHand);
playerContainer.addChild(body);
const bodyWidth = 33;
const bodyHeight = 60;
const headRadius = 15;
const armLength = 40;
const armWidth = 10;
const legLength = 50;
const legWidth = 15;
const handRadius = 10;
const footRadius = 12;
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

const leftArmList = [leftHand, leftForeArm, leftUpperArm, leftShoulder];
const rightArmList = [rightHand, rightForeArm, rightUpperArm, rightShoulder];
const leftLegList = [leftFoot, leftCalf, leftThigh, leftCoxa];
const rightLegList = [rightFoot, rightCalf, rightThigh, rightCoxa];
const armSize = [armWidth, armLength];
const legSize = [legWidth, legLength];

body
  .beginFill(COLOR.HAIR)
  .drawCircle(bodyWidth / 2, -headRadius * 1.2, headRadius)
  .lineStyle(7, COLOR.PANTS)
  .beginFill("#000")
  .drawRoundedRect(0, 0, bodyWidth, bodyHeight, 10)
  .lineStyle(10, COLOR.PANTS)
  .drawRoundedRect(0, bodyHeight * 0.8, bodyWidth, bodyHeight / 3, 10)
  .lineStyle("none")
  .beginFill(COLOR.SKIN)
  .drawCircle(-BODY.SHOULDER_LENGTH - 2, 0, (armWidth + 5) / 2)
  .drawCircle(bodyWidth + BODY.SHOULDER_LENGTH + 2, 0, (armWidth + 5) / 2)
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
leftFoot.beginFill("#555").drawCircle(0, 0, footRadius);
rightFoot.beginFill("#555").drawCircle(0, 0, footRadius);

drawLimb(...leftArmList, ...armSize, -1, 1, 40, 50);
drawLimb(...rightArmList, ...armSize, 1, 1, 50, 40);
drawLimb(...leftLegList, ...legSize, -1, -1, 30, 80);
drawLimb(...rightLegList, ...legSize, 1, -1, 40, 60);

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

// hand drag event
function onDragStart() {
  playerContainer.addChildAt(body, 13);
  const wall = document.querySelector(".wall");
  if (!wall.getAttribute("result")) {
    wall.setAttribute("result", "start");
  }

  this.cursor = "grabbing";
  this.alpha = this === body ? 1 : 0.5;
  this.on("pointermove", onDragging).on("pointerout", onDragOut);
}

function onDragging(event) {
  const wall = document.querySelector(".wall");
  const cursorInContainer = {
    x: event.client.x - wall.offsetLeft - containerPosition.x,
    y: event.client.y - wall.offsetTop - containerPosition.y,
  };

  if (this === body) return moveBodyTo(cursorInContainer);

  if (this === leftHand) {
    const theta2 = moveJoint(
      ...leftArmList,
      ...armSize,
      cursorInContainer,
      1,
      1
    );

    if (!theta2) return;

    return moveBodyTo({
      x: cursorInContainer.x + armLength * 2 * getCos(theta2) + bodyWidth / 2,
      y: cursorInContainer.y + armLength * 2 * getSin(theta2) + bodyHeight / 2,
    });
  }
  if (this === rightHand) {
    const theta2 = moveJoint(
      ...rightArmList,
      ...armSize,
      cursorInContainer,
      -1,
      1
    );

    if (!theta2) return;

    return moveBodyTo({
      x: cursorInContainer.x - armLength * 2 * getCos(theta2) - bodyWidth / 2,
      y: cursorInContainer.y + armLength * 2 * getSin(theta2) + bodyHeight / 2,
    });
  }
  if (this === leftFoot)
    moveJoint(...leftLegList, ...legSize, cursorInContainer, -1, -1);
  if (this === rightFoot)
    moveJoint(...rightLegList, ...legSize, cursorInContainer, 1, -1);
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
  playerContainer.children.forEach(child => {
    child.cursor = "grab";
    child.alpha = 1;
    child.off("pointermove");
  });

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

  if (!this) return;
  this.removeEventListener("pointerout", onDragOut);

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
      descentVelocity += 0.2;
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

  if (this === leftHand) {
    gravityRotate(...leftArmList, ...armSize, -1, 1);
    playerContainer.addChildAt(body, 6);
  }
  if (this === rightHand) {
    gravityRotate(...rightArmList, ...armSize, 1, 1);
    playerContainer.addChildAt(body, 6);
  }
  if (this === leftFoot) gravityRotate(...leftLegList, ...legSize, -1, -1);
  if (this === rightFoot) gravityRotate(...rightLegList, ...legSize, 1, -1);
}

function onDragOut() {
  if (this === leftHand) {
    gravityRotate(...leftArmList, ...armSize, -1, 1);
    playerContainer.addChildAt(body, 6);
  }
  if (this === rightHand) {
    gravityRotate(...rightArmList, ...armSize, 1, 1);
    playerContainer.addChildAt(body, 6);
  }
  if (this === leftFoot) gravityRotate(...leftLegList, ...legSize, -1, -1);
  if (this === rightFoot) gravityRotate(...rightLegList, ...legSize, 1, -1);

  this.off("pointerout");
}

export default playerContainer;
