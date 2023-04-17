/* eslint-disable no-param-reassign */
import { COLOR } from "../assets/constants";
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

export default function gravityRotate(
  hand,
  foreArm,
  upperArm,
  shoulder,
  limbWidth,
  limbLength,
  flagX,
  flagY
) {
  const handToShoulder = getDistance(shoulder, hand);
  const h = Math.sqrt(limbLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const upperArmOriginalAngle = getAngleDegrees(
    foreArm.y - shoulder.y,
    foreArm.x - shoulder.x
  );

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

      foreArm.x =
        shoulder.x + limbLength * getSin(newAngle) + flagX * flagY * 3;
      foreArm.y = shoulder.y + limbLength * getCos(newAngle);
    }

    if (isForeArmRotating) {
      foreArm.angle += angleVelocity * 0.2 * flagX * flagY;

      const newAngle =
        theta1 * 2 +
        Math.abs(upperArmOriginalAngle) * flagY -
        Math.abs(foreArm.angle);

      hand.x = foreArm.x + limbLength * getSin(newAngle) * flagX * flagY;
      hand.y = foreArm.y + limbLength * getCos(newAngle);
    }

    const isRotationFinished = !isUpperArmRotating && !isForeArmRotating;

    if (isRotationFinished) {
      clearInterval(gravity);
      hand.y -= 1;
      upperArm.angle = 0;
      upperArm
        .clear()
        .lineStyle(limbWidth + 5, COLOR.DARK_SKIN)
        .lineTo(0, limbLength)
        .moveTo(0, 0)
        .lineStyle("none");

      if (flagY === -1) {
        upperArm
          .lineStyle(limbWidth + 13, COLOR.PANTS)
          .lineTo(0, limbLength / 2);
      } else {
        upperArm
          .lineStyle(1, COLOR.DARK_SKIN)
          .beginFill(COLOR.SKIN)
          .drawCircle(0, 0, limbWidth / 2 + 3);
      }

      upperArm
        .lineStyle(1, COLOR.DARK_SKIN)
        .beginFill(COLOR.SKIN)
        .drawCircle(0, limbLength, (limbWidth + 3) / 2)
        .lineStyle(limbWidth + 3, COLOR.SKIN)
        .lineTo(0, limbLength);

      foreArm.angle = 0;
      foreArm
        .clear()
        .beginFill(COLOR.SKIN)
        .drawCircle(0, 0, limbWidth / 2)
        .lineStyle(limbWidth + 2, COLOR.DARK_SKIN)
        .lineTo(0, limbLength)
        .moveTo(0, 0)
        .lineStyle(limbWidth, COLOR.SKIN)
        .lineTo(0, limbLength);
    }
  }, 1);
}
