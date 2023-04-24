/* eslint-disable no-param-reassign */
import drawLimb from "./drawLimb";
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

export default function gravityRotateLeg(
  hand,
  foreArm,
  upperArm,
  shoulder,
  limbWidth,
  limbLength,
  flagX
) {
  const handToShoulder = getDistance(shoulder, hand);
  const h = Math.sqrt(limbLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const upperArmOriginalAngle = getAngleDegrees(
    foreArm.y - shoulder.y,
    foreArm.x - shoulder.x
  );
  const rotatingDirection =
    upperArmOriginalAngle / Math.abs(upperArmOriginalAngle);

  let angleVelocity = 0;

  function animate() {
    angleVelocity += 0.5;

    const isUpperArmRotating =
      Math.abs(upperArm.angle) < Math.abs(upperArmOriginalAngle);

    const foreArmRotatingGoal =
      Math.abs(upperArmOriginalAngle) - theta1 * 2 * rotatingDirection * flagX;

    const foreArmRotatingGoalDirection =
      foreArmRotatingGoal / Math.abs(foreArmRotatingGoal);

    const isForeArmRotating =
      Math.abs(foreArm.angle) < Math.abs(foreArmRotatingGoal);

    if (isUpperArmRotating) {
      upperArm.angle += angleVelocity * 0.2 * rotatingDirection;

      const newAngle = upperArmOriginalAngle - upperArm.angle;

      foreArm.x = shoulder.x + limbLength * getSin(newAngle);
      foreArm.y = shoulder.y + limbLength * getCos(newAngle);
    }

    if (isForeArmRotating) {
      foreArm.angle +=
        angleVelocity * 0.2 * rotatingDirection * foreArmRotatingGoalDirection;
    }

    const newAngle = Math.abs(foreArmRotatingGoal) - Math.abs(foreArm.angle);

    hand.x =
      foreArm.x +
      limbLength *
        getSin(newAngle) *
        rotatingDirection *
        foreArmRotatingGoalDirection;
    hand.y = foreArm.y + limbLength * getCos(newAngle);

    const isRotationFinished = !isUpperArmRotating && !isForeArmRotating;

    if (isRotationFinished) {
      upperArm.angle = 0;
      upperArm.clear();

      foreArm.angle = 0;
      foreArm.clear();

      return drawLimb(
        hand,
        foreArm,
        upperArm,
        shoulder,
        limbWidth,
        limbLength,
        flagX,
        -1,
        90,
        90
      );
    }

    requestAnimationFrame(animate);
  }

  animate();
}
