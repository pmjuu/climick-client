/* eslint-disable no-param-reassign */
import { BODY, COLOR } from "../assets/constants";
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

export default function moveJoint(
  hand,
  foreArm,
  upperArm,
  shoulder,
  limbWidth,
  limbLength,
  cursorInCanvas,
  flagX,
  flagY
) {
  const handToShoulder = getDistance(shoulder, hand);
  const h = Math.sqrt(limbLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const theta2 = getAngleDegrees(
    flagX * (shoulder.x - BODY.SHOULDER_LENGTH * flagX - hand.x),
    shoulder.y - hand.y
  );
  const handDirectionY = hand.y - shoulder.y > 0 ? 1 : -1;

  if (handToShoulder > limbLength * 2) {
    hand.x =
      shoulder.x -
      (limbLength - 0.1) * 2 * getCos(theta2) * flagX +
      0.000001 * flagX * flagY;
    hand.y =
      shoulder.y -
      (limbLength - 0.1) * 2 * getSin(theta2) -
      0.000001 * flagY * handDirectionY;
    return theta2;
  }
  hand.x = cursorInCanvas.x;
  hand.y = cursorInCanvas.y;

  const elbow = {
    x:
      shoulder.x -
      BODY.SHOULDER_LENGTH * flagX -
      limbLength * getCos(theta1 - theta2) * flagX,
    y: shoulder.y + limbLength * getSin(theta1 - theta2),
  };

  const upperArmDxy = {
    x: elbow.x - (shoulder.x - BODY.SHOULDER_LENGTH * flagX),
    y: elbow.y - shoulder.y,
  };

  upperArm
    .clear()
    .lineStyle(limbWidth + 5, COLOR.DARK_SKIN)
    .lineTo(upperArmDxy.x, upperArmDxy.y)
    .moveTo(0, 0)
    .lineStyle("none");

  if (flagY === -1) {
    upperArm
      .lineStyle(limbWidth + 13, COLOR.PANTS)
      .lineTo(upperArmDxy.x / 2, upperArmDxy.y / 2);
  } else {
    upperArm
      .lineStyle(1, COLOR.DARK_SKIN)
      .beginFill(COLOR.SKIN)
      .drawCircle(0, 0, limbWidth / 2 + 3);
  }

  upperArm
    .lineStyle(1, COLOR.DARK_SKIN)
    .beginFill(COLOR.SKIN)
    .drawCircle(upperArmDxy.x, upperArmDxy.y, (limbWidth + 3) / 2)
    .lineStyle(limbWidth + 3, COLOR.SKIN)
    .lineTo(upperArmDxy.x, upperArmDxy.y);

  foreArm.position.set(elbow.x, elbow.y);
  foreArm
    .clear()
    .beginFill(COLOR.SKIN)
    .drawCircle(0, 0, limbWidth / 2)
    .lineStyle(limbWidth + 2, COLOR.DARK_SKIN)
    .lineTo(hand.x - elbow.x, hand.y - elbow.y)
    .moveTo(0, 0)
    .lineStyle(limbWidth, COLOR.SKIN)
    .lineTo(hand.x - elbow.x, hand.y - elbow.y);
}
