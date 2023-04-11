import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

export default function moveJointByBody(
  hand,
  foreArm,
  upperArm,
  shoulder,
  armLegWidth,
  armLegLength,
  flagX
) {
  const handToShoulder = getDistance(shoulder, hand);
  const h = Math.sqrt(armLegLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const theta2 = getAngleDegrees(
    flagX * (shoulder.x - hand.x),
    -shoulder.y + hand.y
  );
  const angles = theta1 + theta2;

  if (handToShoulder >= armLegLength * 2) {
    return hand;
  }

  upperArm.position.set(shoulder.x, shoulder.y);
  upperArm
    .clear()
    .lineStyle(armLegWidth, "gray")
    .lineTo(
      armLegLength * -getCos(angles) * flagX,
      armLegLength * getSin(angles)
    );

  foreArm.position.set(
    upperArm.x + armLegLength * -getCos(angles) * flagX,
    upperArm.y + armLegLength * getSin(angles)
  );
  foreArm
    .clear()
    .lineStyle(armLegWidth, "lightgray")
    .lineTo(hand.x - foreArm.x, hand.y - foreArm.y);
}
