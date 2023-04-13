import { getDistance, getAngleDegrees, getCos, getSin } from "./math";
import { skinColor } from "./playerSetting";

export default function moveJointByBody(
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
  const theta2 = getAngleDegrees(
    flagX * (shoulder.x - hand.x),
    -shoulder.y + hand.y
  );
  const angles = theta1 + theta2;

  if (handToShoulder >= armLegLength * 2) {
    return hand;
  }

  upperArm.clear();

  if (flagY === -1) {
    upperArm
      .lineStyle(armLegWidth + 13, "#000")
      .lineTo(
        (armLegLength * -getCos(angles) * flagX) / 2,
        (armLegLength * getSin(angles)) / 2
      );
  } else {
    upperArm.beginFill(skinColor).drawCircle(0, 0, armLegWidth / 2 + 3);
  }

  upperArm
    .lineStyle(armLegWidth + 3, skinColor)
    .lineTo(
      armLegLength * -getCos(angles) * flagX,
      armLegLength * getSin(angles)
    );

  upperArm.position.set(shoulder.x - flagX * 4, shoulder.y);

  foreArm.position.set(
    upperArm.x + armLegLength * -getCos(angles) * flagX,
    upperArm.y + armLegLength * getSin(angles)
  );
  foreArm
    .clear()
    .beginFill(skinColor)
    .drawCircle(0, 0, armLegWidth / 2)
    .lineStyle(armLegWidth, skinColor)
    .lineTo(hand.x - foreArm.x, hand.y - foreArm.y);
}
