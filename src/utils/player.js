/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import "@pixi/graphics-extras";
import { Container, Graphics } from "pixi.js";
import { BODY, COLOR } from "../assets/constants";
import holdInfo from "../assets/holdInfo";
import drawLimb from "./drawLimb";
import gravityRotate from "./gravityRotate";
import gravityRotateLeg from "./gravityRotateLeg";
import holdContainer from "./hold";
import { getCos, getDistance, getSin } from "./math";
import moveJoint from "./moveJoint";
import moveJointByBody from "./moveJointByBody";
import { attachedStatus, gameStatus } from "./status";
import { getResultText, instabilityWarning, introText } from "./text";

export const containerPosition = { x: 400, y: 620 };
const playerContainer = new Container();
playerContainer.position.set(...Object.values(containerPosition));

export const body = new Graphics();
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

const headRadius = 15;
const armLength = 40;
const armWidth = 10;
const legLength = 50;
const legWidth = 15;
const handRadius = 10;
const footRadius = 12;
export const leftShoulder = { x: 40, y: 0 };
export const rightShoulder = {
  x: leftShoulder.x + BODY.WIDTH * getCos(body.angle),
  y: leftShoulder.y + BODY.WIDTH * getSin(body.angle),
};
export const leftCoxa = {
  x: leftShoulder.x - BODY.HEIGHT * getSin(body.angle) + BODY.COXA_GAP,
  y: leftShoulder.y + BODY.HEIGHT * getCos(body.angle),
};
export const rightCoxa = {
  x: rightShoulder.x - BODY.HEIGHT * getSin(body.angle) - BODY.COXA_GAP,
  y: rightShoulder.y + BODY.HEIGHT * getCos(body.angle),
};

export const leftArmList = [leftHand, leftForeArm, leftUpperArm, leftShoulder];
export const rightArmList = [
  rightHand,
  rightForeArm,
  rightUpperArm,
  rightShoulder,
];
export const leftLegList = [leftFoot, leftCalf, leftThigh, leftCoxa];
export const rightLegList = [rightFoot, rightCalf, rightThigh, rightCoxa];
export const armSize = [armWidth, armLength];
export const legSize = [legWidth, legLength];

body
  .beginFill(COLOR.HAIR)
  .drawCircle(BODY.WIDTH / 2, -headRadius * 1.2, headRadius)
  .lineStyle(7, COLOR.PANTS)
  .beginFill(COLOR.PANTS)
  .drawRoundedRect(0, 0, BODY.WIDTH, BODY.HEIGHT, 10)
  .lineStyle(10, COLOR.PANTS)
  .drawRoundedRect(0, BODY.HEIGHT * 0.8, BODY.WIDTH, BODY.HEIGHT / 3, 10)
  .lineStyle("none")
  .beginFill(COLOR.SKIN)
  .drawCircle(-BODY.SHOULDER_GAP, 2, (armWidth + 5) / 2)
  .drawCircle(BODY.WIDTH + BODY.SHOULDER_GAP, 2, (armWidth + 5) / 2)
  .beginFill("#fff")
  .drawStar(BODY.WIDTH / 2, BODY.HEIGHT / 2, 5, 10);

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
drawLimb(...rightLegList, ...legSize, 1, -1, 50, 80);

const limbs = [leftHand, rightHand, leftFoot, rightFoot];
limbs.forEach(limb => {
  limb.eventMode = "dynamic";
  limb
    .on("pointerover", function () {
      this.cursor = "grab";
    })
    .on("pointerdown", onDragStart);
});

let dragTarget = null;
let exceededPart = null;

function onDragStart() {
  holdContainer.removeChild(introText);
  playerContainer.removeChild(instabilityWarning);

  if (attachedStatus.leftHand && attachedStatus.rightHand)
    playerContainer.addChildAt(body, 13);

  gameStatus.start = true;

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
  const wall = document.querySelector(".wall");
  wall.addEventListener("pointermove", onDragging);
  wall.addEventListener("pointerup", onDragEnd);
  rearrangeBody(exceededPart);
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
      x: cursorInContainer.x + armLength * 2 * getCos(theta2) + BODY.WIDTH / 2,
      y: cursorInContainer.y + armLength * 2 * getSin(theta2) + BODY.HEIGHT / 2,
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
      x: cursorInContainer.x - armLength * 2 * getCos(theta2) - BODY.WIDTH / 2,
      y: cursorInContainer.y + armLength * 2 * getSin(theta2) + BODY.HEIGHT / 2,
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
        BODY.WIDTH / 2,
      y:
        cursorInContainer.y +
        legLength * 2 * getCos(90 - theta2) -
        BODY.HEIGHT / 2,
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
        BODY.WIDTH / 2,
      y:
        cursorInContainer.y +
        legLength * 2 * getCos(90 - theta2) -
        BODY.HEIGHT / 2,
    });
  }
}

function moveBodyTo(cursorInContainer) {
  if (exceededPart) return;

  leftShoulder.x = cursorInContainer.x - BODY.WIDTH / 2;
  leftShoulder.y = cursorInContainer.y - BODY.HEIGHT / 2;

  rightShoulder.x = leftShoulder.x + BODY.WIDTH * getCos(body.angle);
  rightShoulder.y = leftShoulder.y + BODY.WIDTH * getSin(body.angle);
  leftCoxa.x = leftShoulder.x - BODY.HEIGHT * getSin(body.angle);
  leftCoxa.y = leftShoulder.y + BODY.HEIGHT * getCos(body.angle);
  rightCoxa.x = rightShoulder.x - BODY.HEIGHT * getSin(body.angle);
  rightCoxa.y = rightShoulder.y + BODY.HEIGHT * getCos(body.angle);

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
    if (!attachedStatus.leftHand && dragTarget !== leftHand) {
      leftHand.position.set(leftShoulder.x, leftShoulder.y + armLength * 2 - 3);
    } else if (!attachedStatus.rightHand && dragTarget !== rightHand) {
      rightHand.position.set(
        rightShoulder.x,
        rightShoulder.y + armLength * 2 - 3
      );
    } else if (!attachedStatus.leftFoot && dragTarget !== leftFoot) {
      leftFoot.position.set(leftCoxa.x, leftCoxa.y + legLength * 2 - 5);
    } else if (!attachedStatus.rightFoot && dragTarget !== rightFoot) {
      rightFoot.position.set(rightCoxa.x, rightCoxa.y + legLength * 2 - 5);
    }

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

      if (dragTarget === leftFoot) attachedStatus.leftFoot = 1;
      if (dragTarget === rightFoot) attachedStatus.rightFoot = 1;

      checkGravityCenter();
      rearrangeBody(exceededPart);
      return;
    }
  }

  if (dragTarget === leftHand) {
    attachedStatus.leftHand = 0;
    gravityRotate(...leftArmList, ...armSize, -1, handRadius);
    playerContainer.addChildAt(body, 6);
  } else if (dragTarget === rightHand) {
    attachedStatus.rightHand = 0;
    gravityRotate(...rightArmList, ...armSize, 1, handRadius);
    playerContainer.addChildAt(body, 6);
  } else if (dragTarget === leftFoot) {
    attachedStatus.leftFoot = 0;
    gravityRotateLeg(...leftLegList, ...legSize, -1, -1);
  } else if (dragTarget === rightFoot) {
    attachedStatus.rightFoot = 0;
    gravityRotateLeg(...rightLegList, ...legSize, 1, -1);
  }

  checkGravityCenter();
  rearrangeBody(exceededPart);

  if (
    attachedStatus.leftHand === 0 ||
    attachedStatus.rightHand === 0 ||
    attachedStatus.leftFoot === 0 ||
    attachedStatus.rightFoot === 0
  )
    showWarning(body);
}

function showWarning(ref) {
  instabilityWarning.position.set(
    ref.x + BODY.WIDTH / 2,
    ref.y - BODY.HEIGHT / 2 - headRadius * 3
  );
  playerContainer.addChild(instabilityWarning);
}

function checkGravityCenter() {
  const handsCenterX = (leftHand.x + rightHand.x) / 2;
  const gravityCenterX = body.x + BODY.WIDTH / 2;
  const gravityCenterXdirection = gravityCenterX < handsCenterX ? -1 : 1;
  attachedStatus.isStable =
    leftFoot.x < gravityCenterX && gravityCenterX < rightFoot.x;

  let descentVelocityX = 0;
  let descentVelocityY = 0;

  if (!attachedStatus.isStable) {
    descendByGravity();
  }

  function descendByGravity() {
    descentVelocityY += 0.3;

    if (
      (handsCenterX - body.x + BODY.WIDTH / 2) * gravityCenterXdirection <
      0
    ) {
      descentVelocityX = 0;
    } else {
      descentVelocityX += 0.3;
    }

    moveBodyTo({
      x:
        leftShoulder.x +
        BODY.WIDTH / 2 -
        0.2 * descentVelocityX * gravityCenterXdirection,
      y: leftShoulder.y + BODY.HEIGHT / 2 + 0.3 * descentVelocityY,
    });

    if (exceededPart) {
      rearrangeBody(exceededPart);

      return showWarning(body);
    }

    requestAnimationFrame(descendByGravity);
  }
}

function rearrangeBody(part) {
  if (!attachedStatus.leftHand && dragTarget !== leftHand) {
    leftHand.position.set(leftShoulder.x, leftShoulder.y + armLength * 2 - 2);
  } else if (!attachedStatus.rightHand && dragTarget !== rightHand) {
    rightHand.position.set(
      rightShoulder.x,
      rightShoulder.y + armLength * 2 - 2
    );
  } else if (!attachedStatus.leftFoot && dragTarget !== leftFoot) {
    leftFoot.position.set(leftCoxa.x, leftCoxa.y + legLength * 2 - 2);
  } else if (!attachedStatus.rightFoot && dragTarget !== rightFoot) {
    rightFoot.position.set(rightCoxa.x, rightCoxa.y + legLength * 2 - 2);
  }

  if (!part) return;

  const flag = { x: null, y: null };
  flag.x = part.hand.x < part.shoulder.x ? -1 : 1;
  flag.y = part.hand.y < part.shoulder.y ? -1 : 1;

  exceededPart = null;
  const rearrangePX = 3;

  moveBodyTo({
    x: body.x + rearrangePX * flag.x + BODY.WIDTH / 2,
    y: body.y + rearrangePX * flag.y + BODY.HEIGHT / 2,
  });
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

export default playerContainer;
