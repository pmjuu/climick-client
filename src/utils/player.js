/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Container, Graphics } from "pixi.js";
import "@pixi/graphics-extras";
import { getCos, getDistance, getSin } from "./math";
import { holdContainer, holdInfo, introText } from "./hold";
import moveJoint from "./moveJoint";
import moveJointByBody from "./moveJointByBody";
import gravityRotate from "./gravityRotate";
import getResultText from "./getResultText";
import { BODY, COLOR } from "../assets/constants";
import drawLimb from "./drawLimb";
import gravityRotateLeg from "./gravityRotateLeg";

export const gameStatus = {
  start: false,
  fail: false,
  success: false,
};
export const attachedStatus = {
  leftHandOnTop: 0,
  rightHandOnTop: 0,
  leftHand: 1,
  rightHand: 1,
};

export const containerPosition = { x: 400, y: 620 };
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
const leftShoulder = { x: 40, y: 0 };
const rightShoulder = {
  x: leftShoulder.x + bodyWidth * getCos(body.angle),
  y: leftShoulder.y + bodyWidth * getSin(body.angle),
};
const leftCoxa = {
  x: leftShoulder.x - bodyHeight * getSin(body.angle) + BODY.COXA_GAP,
  y: leftShoulder.y + bodyHeight * getCos(body.angle),
};
const rightCoxa = {
  x: rightShoulder.x - bodyHeight * getSin(body.angle) - BODY.COXA_GAP,
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
  .beginFill(COLOR.PANTS)
  .drawRoundedRect(0, 0, bodyWidth, bodyHeight, 10)
  .lineStyle(10, COLOR.PANTS)
  .drawRoundedRect(0, bodyHeight * 0.8, bodyWidth, bodyHeight / 3, 10)
  .lineStyle("none")
  .beginFill(COLOR.SKIN)
  .drawCircle(-BODY.SHOULDER_GAP, 2, (armWidth + 5) / 2)
  .drawCircle(bodyWidth + BODY.SHOULDER_GAP, 2, (armWidth + 5) / 2)
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
leftFoot.beginFill(COLOR.SHOES).drawCircle(0, 0, footRadius);
rightFoot.beginFill(COLOR.SHOES).drawCircle(0, 0, footRadius);

drawLimb(...leftArmList, ...armSize, -1, 1, 40, 40);
drawLimb(...rightArmList, ...armSize, 1, 1, 40, 30);
drawLimb(...leftLegList, ...legSize, -1, -1, 50, 80);
drawLimb(...rightLegList, ...legSize, 1, -1, 60, 60);

const limbs = [leftHand, rightHand, leftFoot, rightFoot, body];
limbs.forEach(limb => {
  limb.eventMode = "dynamic";
  limb
    .on("pointerover", function () {
      this.cursor = "grab";
    })
    .on("pointerdown", onDragStart);
});

let dragTarget = null;

function onDragStart() {
  holdContainer.removeChild(introText);
  playerContainer.addChildAt(body, 13);
  gameStatus.start = true;
  const wall = document.querySelector(".wall");

  const isTwoHandsDetached =
    (attachedStatus.leftHand === 0 && this === rightHand) ||
    (attachedStatus.rightHand === 0 && this === leftHand);

  if (isTwoHandsDetached) {
    setTimeout(() => {
      fallDown("Fail...");
    }, 700);
  }

  this.cursor = "grabbing";
  this.alpha = this === body ? 1 : 0.5;
  dragTarget = this;
  wall.addEventListener("pointermove", onDragging);
  wall.addEventListener("pointerup", onDragEnd);
}

export function fallDown(displayText) {
  const wall = document.querySelector(".wall");
  wall.removeEventListener("pointermove", onDragging);
  wall.removeEventListener("pointerup", onDragEnd);

  let descentVelocity = 0;

  function animate() {
    descentVelocity += 0.4;
    playerContainer.y += descentVelocity * 0.3;

    const isPlayerAboveGround =
      playerContainer.y <
      containerPosition.y -
        leftShoulder.y +
        (initialContainerHeight - playerContainer.height);

    if (!isPlayerAboveGround) {
      gameStatus.fail = true;
      holdContainer.addChild(getResultText(displayText));
      return;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function onDragging(event) {
  const cursorInContainer = {
    x: event.clientX - this.offsetLeft - containerPosition.x,
    y: event.clientY - this.offsetTop - containerPosition.y,
  };

  if (dragTarget === body) return moveBodyTo(cursorInContainer);

  if (dragTarget === leftHand) {
    const theta2 = moveJoint(
      ...leftArmList,
      ...armSize,
      cursorInContainer,
      1,
      1,
      handRadius
    );

    if (!theta2) return;

    return moveBodyTo({
      x: cursorInContainer.x + armLength * 2 * getCos(theta2) + bodyWidth / 2,
      y: cursorInContainer.y + armLength * 2 * getSin(theta2) + bodyHeight / 2,
    });
  }

  if (dragTarget === rightHand) {
    const theta2 = moveJoint(
      ...rightArmList,
      ...armSize,
      cursorInContainer,
      -1,
      1,
      handRadius
    );

    if (!theta2) return;

    return moveBodyTo({
      x: cursorInContainer.x - armLength * 2 * getCos(theta2) - bodyWidth / 2,
      y: cursorInContainer.y + armLength * 2 * getSin(theta2) + bodyHeight / 2,
    });
  }

  if (dragTarget === leftFoot) {
    const theta2 = moveJoint(
      ...leftLegList,
      ...legSize,
      cursorInContainer,
      -1,
      -1,
      footRadius
    );

    if (!theta2) return;

    return moveBodyTo({
      x:
        cursorInContainer.x -
        legLength * 2 * getSin(90 - theta2) +
        bodyWidth / 2,
      y:
        cursorInContainer.y +
        legLength * 2 * getCos(90 - theta2) -
        bodyHeight / 2,
    });
  }

  if (dragTarget === rightFoot) {
    const theta2 = moveJoint(
      ...rightLegList,
      ...legSize,
      cursorInContainer,
      1,
      -1,
      footRadius
    );

    if (!theta2) return;

    return moveBodyTo({
      x:
        cursorInContainer.x +
        legLength * 2 * getSin(90 - theta2) -
        bodyWidth / 2,
      y:
        cursorInContainer.y +
        legLength * 2 * getCos(90 - theta2) -
        bodyHeight / 2,
    });
  }
}

let exceededPart = null;
function moveBodyTo(cursorInContainer) {
  if (exceededPart) return;

  leftShoulder.x = cursorInContainer.x - bodyWidth / 2;
  leftShoulder.y = cursorInContainer.y - bodyHeight / 2;

  rightShoulder.x = leftShoulder.x + bodyWidth * getCos(body.angle);
  rightShoulder.y = leftShoulder.y + bodyWidth * getSin(body.angle);
  leftCoxa.x = leftShoulder.x - bodyHeight * getSin(body.angle);
  leftCoxa.y = leftShoulder.y + bodyHeight * getCos(body.angle);
  rightCoxa.x = rightShoulder.x - bodyHeight * getSin(body.angle);
  rightCoxa.y = rightShoulder.y + bodyHeight * getCos(body.angle);

  if (!exceededPart)
    exceededPart = moveJointByBody(
      ...leftArmList,
      ...armSize,
      1,
      1,
      handRadius
    );
  if (!exceededPart)
    exceededPart = moveJointByBody(
      ...rightArmList,
      ...armSize,
      -1,
      1,
      handRadius
    );
  if (!exceededPart)
    exceededPart = moveJointByBody(
      ...leftLegList,
      ...legSize,
      -1,
      -1,
      footRadius
    );
  if (!exceededPart)
    exceededPart = moveJointByBody(
      ...rightLegList,
      ...legSize,
      1,
      -1,
      footRadius
    );

  if (!exceededPart) {
    body.position.set(leftShoulder.x, leftShoulder.y);
  }
}

const initialContainerHeight = playerContainer.height;

function onDragEnd() {
  if (!dragTarget) return;

  document
    .querySelector(".wall")
    .removeEventListener("pointermove", onDragging);
  dragTarget.alpha = 1;

  const handsCenterX = (leftHand.x + rightHand.x) / 2;
  const gravityCenterX = body.x + bodyWidth / 2;
  const gravityCenterXdirection = gravityCenterX < handsCenterX ? -1 : 1;
  const isCenterOfGravityOutsideFeet =
    gravityCenterX < leftFoot.x || rightFoot.x < gravityCenterX;

  let descentVelocityX = 0;
  let descentVelocityY = 0;

  if (isCenterOfGravityOutsideFeet) {
    descendByGravity();
  }

  function descendByGravity() {
    descentVelocityY += 0.3;

    if ((handsCenterX - body.x + bodyWidth / 2) * gravityCenterXdirection < 0) {
      descentVelocityX = 0;
    } else {
      descentVelocityX += 0.3;
    }

    moveBodyTo({
      x:
        leftShoulder.x +
        bodyWidth / 2 -
        0.2 * descentVelocityX * gravityCenterXdirection,
      y: leftShoulder.y + bodyHeight / 2 + 0.3 * descentVelocityY,
    });

    if (exceededPart) {
      rearrangeBody(exceededPart);
      return;
    }

    requestAnimationFrame(descendByGravity);
  }

  rearrangeBody(exceededPart);

  function rearrangeBody(part) {
    if (!part) return;

    const rearrangePX = 1;

    function getHandDirection({ hand, shoulder }) {
      let direction = "";

      direction += hand.y > shoulder.y ? "N" : "S";
      direction += hand.x > shoulder.x ? "E" : "W";

      return direction;
    }

    const exceededPartDirection = getHandDirection(part);

    exceededPart = null;
    if (exceededPartDirection === "NW") {
      moveBodyTo({
        x: body.x - rearrangePX + bodyWidth / 2,
        y: body.y - rearrangePX + bodyHeight / 2,
      });
    } else if (exceededPartDirection === "NE") {
      moveBodyTo({
        x: body.x + rearrangePX + bodyWidth / 2,
        y: body.y - rearrangePX + bodyHeight / 2,
      });
    } else if (exceededPartDirection === "SW") {
      moveBodyTo({
        x: body.x - rearrangePX + bodyWidth / 2,
        y: body.y + rearrangePX + bodyHeight / 2,
      });
    } else if (exceededPartDirection === "SE") {
      moveBodyTo({
        x: body.x + rearrangePX + bodyWidth / 2,
        y: body.y + rearrangePX + bodyHeight / 2,
      });
    }
  }

  for (const hold of Object.values(holdInfo)) {
    const cursor = {
      x: dragTarget.x + containerPosition.x,
      y: dragTarget.y + containerPosition.y,
    };

    const handFootRadius =
      dragTarget === leftHand || dragTarget === rightHand
        ? handRadius
        : footRadius;

    const isAttachedToHold = hold.radius
      ? getDistance(hold, cursor) < hold.radius + handFootRadius
      : hold.x - handFootRadius < cursor.x &&
        cursor.x < hold.x + hold.width + handFootRadius &&
        hold.y - handFootRadius < cursor.y &&
        cursor.y < hold.y + hold.height + handFootRadius;

    if (isAttachedToHold) {
      if (dragTarget === leftHand) {
        attachedStatus.leftHand = 1;

        if (hold.text === "top") attachedStatus.leftHandOnTop = 1;
      }

      if (dragTarget === rightHand) {
        attachedStatus.rightHand = 1;

        if (hold.text === "top") attachedStatus.rightHandOnTop = 1;
      }

      if (attachedStatus.leftHandOnTop && attachedStatus.rightHandOnTop) {
        gameStatus.success = true;
        holdContainer.addChild(getResultText("Success!"));
        playerContainer.eventMode = "none";
        const wall = document.querySelector(".wall");
        wall.removeEventListener("pointermove", onDragging);
        wall.removeEventListener("pointerup", onDragEnd);
      }

      return;
    }
  }

  if (dragTarget === leftHand) {
    attachedStatus.leftHand = 0;
    gravityRotate(...leftArmList, ...armSize, 1, 1, handRadius);
    playerContainer.addChildAt(body, 6);
  } else if (dragTarget === rightHand) {
    attachedStatus.rightHand = 0;
    gravityRotate(...rightArmList, ...armSize, -1, 1, handRadius);
    playerContainer.addChildAt(body, 6);
  } else if (dragTarget === leftFoot) {
    gravityRotateLeg(...leftLegList, ...legSize, -1, -1);
  } else if (dragTarget === rightFoot) {
    gravityRotateLeg(...rightLegList, ...legSize, 1, -1);
  }
}

export default playerContainer;
