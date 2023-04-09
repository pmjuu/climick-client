/* eslint-disable no-param-reassign */
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

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
  const angles = theta1 + theta2;

  if (handToShoulder >= armLegLength * 2) {
    hand.x =
      shoulder.x -
      armLegLength * 2 * getCos(theta2) * flagX +
      0.0000001 * flagX * flagY;
    hand.y = shoulder.y - armLegLength * 2 * getSin(theta2) + 0.0000001 * flagY;
  } else {
    hand.x = cursorInCanvas.x;
    hand.y = cursorInCanvas.y;
  }

  foreArm.position.set(hand.x, hand.y);
  foreArm
    .clear()
    .lineStyle(armLegWidth, "lightgray")
    .lineTo(
      armLegLength * getCos(angles) * flagX,
      armLegLength * getSin(angles)
    );

  upperArm.position.set(
    foreArm.x + armLegLength * getCos(angles) * flagX,
    foreArm.y + armLegLength * getSin(angles)
  );
  upperArm
    .clear()
    .lineStyle(armLegWidth, "gray")
    .lineTo(shoulder.x - upperArm.x, shoulder.y - upperArm.y);
}
