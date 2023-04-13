/* eslint-disable no-param-reassign */
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";
import { skinColor } from "./playerSetting";

export default function gravityRotate(
  hand,
  foreArm,
  upperArm,
  shoulder,
  armLegWidth,
  armLegLength,
  flagX,
  flagY
) {
  const handToShoulder = getDistance(shoulder, hand);
  const h = Math.sqrt(armLegLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const upperArmOriginalAngle = getAngleDegrees(
    foreArm.y - shoulder.y,
    foreArm.x - shoulder.x
  );
  // const handDirectionY = hand.y - shoulder.y > 0 ? 1 : -1;

  let angleVelocity = 0;

  const gravity = setInterval(() => {
    angleVelocity += 0.02;

    const isUpperArmRotating =
      Math.abs(upperArm.angle) < Math.abs(upperArmOriginalAngle);
    const isForeArmRotating =
      Math.abs(foreArm.angle) <
      theta1 * 2 + Math.abs(upperArmOriginalAngle) * flagY;

    if (isUpperArmRotating) {
      upperArm.angle += angleVelocity * 0.2 * flagX;

      const newAngle = upperArmOriginalAngle - upperArm.angle;

      foreArm.x = shoulder.x + armLegLength * getSin(newAngle);
      foreArm.y = shoulder.y + armLegLength * getCos(newAngle);
    }

    if (isForeArmRotating) {
      foreArm.angle += angleVelocity * 0.2 * flagX * flagY;

      const newAngle =
        theta1 * 2 +
        Math.abs(upperArmOriginalAngle) * flagY -
        Math.abs(foreArm.angle);

      hand.x = foreArm.x + armLegLength * getSin(newAngle) * flagX * flagY;
      hand.y = foreArm.y + armLegLength * getCos(newAngle);
    }

    const isRotationFinished = !isUpperArmRotating && !isForeArmRotating;

    if (isRotationFinished) {
      clearInterval(gravity);
      upperArm.angle = 0;
      upperArm.clear();

      if (flagY === -1) {
        upperArm
          .lineStyle(armLegWidth + 13, "#000")
          .lineTo(0, armLegLength / 2);
      } else {
        upperArm.beginFill(skinColor).drawCircle(0, 0, armLegWidth / 2 + 3);
      }

      upperArm.lineStyle(armLegWidth + 3, skinColor).lineTo(0, armLegLength);

      foreArm.angle = 0;
      foreArm.clear().lineStyle(armLegWidth, skinColor).lineTo(0, armLegLength);
    }
  }, 1);
}
