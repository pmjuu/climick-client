import { COLOR } from "../assets/constants";
import { getDistance, getAngleDegrees, getCos, getSin } from "./math";

export default function moveJointByBody(
  hand,
  foreArm,
  upperArm,
  shoulder,
  limbWidth,
  limbLength,
  flagX,
  flagY,
  handRadius
) {
  const handToShoulder = getDistance(shoulder, hand);
  const h = Math.sqrt(limbLength ** 2 - (handToShoulder / 2) ** 2) || 0;
  const theta1 = getAngleDegrees(handToShoulder / 2, h);
  const theta2 = getAngleDegrees(
    flagX * (shoulder.x - hand.x),
    -shoulder.y + hand.y
  );
  const angles = theta1 + theta2;

  if (handToShoulder > limbLength * 2) {
    hand.beginFill(COLOR.STRETCHED).drawCircle(0, 0, handRadius);

    return { hand, shoulder };
  }

  upperArm
    .clear()
    .lineStyle(limbWidth + 5, COLOR.DARK_SKIN)
    .lineTo(limbLength * -getCos(angles) * flagX, limbLength * getSin(angles))
    .moveTo(0, 0)
    .lineStyle("none");

  if (flagY === -1) {
    hand.beginFill(COLOR.SHOES).drawCircle(0, 0, handRadius);
    upperArm
      .lineStyle(limbWidth + 13, COLOR.PANTS)
      .lineTo(
        (limbLength * -getCos(angles) * flagX) / 2,
        (limbLength * getSin(angles)) / 2
      );
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
    .drawCircle(
      limbLength * -getCos(angles) * flagX,
      limbLength * getSin(angles),
      (limbWidth + 3) / 2
    )
    .lineStyle(limbWidth + 3, COLOR.SKIN)
    .lineTo(limbLength * -getCos(angles) * flagX, limbLength * getSin(angles));

  upperArm.position.set(shoulder.x - flagX * 4, shoulder.y);

  foreArm.position.set(
    upperArm.x + limbLength * -getCos(angles) * flagX,
    upperArm.y + limbLength * getSin(angles)
  );
  foreArm
    .clear()
    .beginFill(COLOR.SKIN)
    .drawCircle(0, 0, limbWidth / 2)
    .lineStyle(limbWidth + 2, COLOR.DARK_SKIN)
    .lineTo(hand.x - foreArm.x, hand.y - foreArm.y)
    .moveTo(0, 0)
    .lineStyle(limbWidth, COLOR.SKIN)
    .lineTo(hand.x - foreArm.x, hand.y - foreArm.y);
}
