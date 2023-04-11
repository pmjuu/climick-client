import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

export default function gravityFall(
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

  let angleVelocity = 0;

  const gravity = setInterval(() => {
    angleVelocity += 0.02;

    if (isRotationFinished) {
      clearInterval(gravity);
    }
  }, 1);
}
