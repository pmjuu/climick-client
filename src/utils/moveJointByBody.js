import { COLOR } from "../assets/constants";
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

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
      .lineStyle(armLegWidth + 13, COLOR.PANTS)
      .lineTo(
        (armLegLength * -getCos(angles) * flagX) / 2,
        (armLegLength * getSin(angles)) / 2
      );
  } else {
    upperArm.beginFill(COLOR.SKIN).drawCircle(0, 0, armLegWidth / 2 + 3);
  }

  upperArm
    .lineStyle(armLegWidth + 3, COLOR.SKIN)
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
    .beginFill(COLOR.SKIN)
    .drawCircle(0, 0, armLegWidth / 2)
    .lineStyle(armLegWidth, COLOR.SKIN)
    .lineTo(hand.x - foreArm.x, hand.y - foreArm.y);
}
