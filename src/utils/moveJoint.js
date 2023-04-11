/* eslint-disable no-param-reassign */
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";
import { armLegColor } from "./playerSetting";

export default function moveJoint(
  hand,
  foreArm,
  upperArm,
  shoulder,
  armLegWidth,
  armLegLength,
  cursorInCanvas,
  flagX,
  flagY
) {
  const handToShoulder = getDistance(shoulder, hand);
  const h = Math.sqrt(armLegLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const theta2 = getAngleDegrees(
    flagX * (shoulder.x - hand.x),
    shoulder.y - hand.y
  );
  const handDirectionY = hand.y - shoulder.y > 0 ? 1 : -1;

  if (handToShoulder >= armLegLength * 2) {
    hand.x =
      shoulder.x -
      armLegLength * 2 * getCos(theta2) * flagX +
      0.0000001 * flagX * flagY;
    hand.y =
      shoulder.y -
      armLegLength * 2 * getSin(theta2) -
      0.0000001 * flagY * handDirectionY;
  } else {
    hand.x = cursorInCanvas.x;
    hand.y = cursorInCanvas.y;
  }

  const elbow = {
    x: shoulder.x - armLegLength * getCos(theta1 - theta2) * flagX,
    y: shoulder.y + armLegLength * getSin(theta1 - theta2),
  };

  upperArm.clear();

  if (flagY === -1) {
    upperArm
      .lineStyle(armLegWidth + 13, "#000")
      .lineTo((elbow.x - shoulder.x) / 2, (elbow.y - shoulder.y) / 2);
  } else {
    upperArm.beginFill(armLegColor).drawCircle(0, 0, armLegWidth / 2 + 3);
  }

  upperArm
    .lineStyle(armLegWidth + 3, armLegColor)
    .lineTo(elbow.x - shoulder.x, elbow.y - shoulder.y);

  foreArm.position.set(elbow.x, elbow.y);
  foreArm
    .clear()
    .beginFill(armLegColor)
    .drawCircle(0, 0, armLegWidth / 2)
    .lineStyle(armLegWidth, armLegColor)
    .lineTo(hand.x - elbow.x, hand.y - elbow.y);
}
