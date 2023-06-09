/* eslint-disable no-param-reassign */
import { COLOR } from "../assets/constants";
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

export default function moveJoint(
  hand,
  foreArm,
  upperArm,
  shoulder,
  limbWidth,
  limbLength,
  cursorInContainer,
  flagX,
  flagY,
  handRadius
) {
  const handToShoulder = getDistance(shoulder, cursorInContainer);
  const h = Math.sqrt(limbLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const theta2 = getAngleDegrees(
    flagX * (shoulder.x - cursorInContainer.x),
    shoulder.y - cursorInContainer.y
  );

  if (handToShoulder > limbLength * 2) {
    hand.x = shoulder.x - limbLength * 2 * getCos(theta2) * flagX;
    hand.y = shoulder.y - limbLength * 2 * getSin(theta2);
  } else {
    hand.x = cursorInContainer.x;
    hand.y = cursorInContainer.y;
  }

  const elbow = {
    x: shoulder.x - flagX - limbLength * getCos(theta1 - theta2) * flagX,
    y: shoulder.y + limbLength * getSin(theta1 - theta2),
  };

  const upperArmDxy = {
    x: elbow.x - shoulder.x,
    y: elbow.y - shoulder.y,
  };

  upperArm
    .clear()
    .lineStyle(limbWidth + 5, COLOR.DARK_SKIN)
    .lineTo(upperArmDxy.x, upperArmDxy.y)
    .moveTo(0, 0)
    .lineStyle("none");

  if (flagY === -1) {
    hand.beginFill(COLOR.SHOES).drawCircle(0, 0, handRadius);
    upperArm
      .lineStyle(limbWidth + 13, COLOR.PANTS)
      .lineTo(upperArmDxy.x / 2, upperArmDxy.y / 2);
  } else {
    hand.beginFill(COLOR.SKIN).drawCircle(0, 0, handRadius);
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

  if (handToShoulder > limbLength * 2) return theta2;
}
