import { BODY, COLOR } from "../assets/constants";
import { getCos, getSin } from "./math";

export default function drawLimb(
  hand,
  foreArm,
  upperArm,
  shoulder,
  limbWidth,
  limbLength,
  flagX,
  flagY,
  upperArmAngle,
  foreArmAngle
) {
  const upperArmDxy = {
    dx: limbLength * getCos(upperArmAngle) * flagX,
    dy: -limbLength * getSin(upperArmAngle) * flagY,
  };
  const foreArmDxy = {
    dx: -limbLength * getCos(foreArmAngle) * flagX,
    dy: -limbLength * getSin(foreArmAngle) * flagY,
  };

  upperArm.position.set(
    shoulder.x + BODY.SHOULDER_LENGTH * flagX * flagY,
    shoulder.y
  );
  upperArm
    .lineStyle(limbWidth + 5, COLOR.DARK_SKIN)
    .lineTo(upperArmDxy.dx, upperArmDxy.dy)
    .moveTo(0, 0);

  if (flagY === -1) {
    upperArm
      .lineStyle(limbWidth + 13, COLOR.PANTS)
      .lineTo(upperArmDxy.dx / 2, upperArmDxy.dy / 2);
  } else {
    upperArm
      .lineStyle(1, COLOR.DARK_SKIN)
      .beginFill(COLOR.SKIN)
      .drawCircle(0, 0, limbWidth / 2 + 3);
  }

  upperArm
    .lineStyle(1, COLOR.DARK_SKIN)
    .beginFill(COLOR.SKIN)
    .drawCircle(upperArmDxy.dx, upperArmDxy.dy, (limbWidth + 3) / 2)
    .lineStyle(limbWidth + 3, COLOR.SKIN)
    .lineTo(upperArmDxy.dx, upperArmDxy.dy);

  foreArm.position.set(
    upperArm.x + upperArmDxy.dx,
    upperArm.y + upperArmDxy.dy
  );
  foreArm
    .beginFill(COLOR.SKIN)
    .drawCircle(0, 0, limbWidth / 2)
    .lineStyle(limbWidth + 2, COLOR.DARK_SKIN)
    .lineTo(foreArmDxy.dx, foreArmDxy.dy)
    .moveTo(0, 0)
    .lineStyle(limbWidth, COLOR.SKIN)
    .lineTo(foreArmDxy.dx, foreArmDxy.dy);

  hand.position.set(foreArm.x + foreArmDxy.dx, foreArm.y + foreArmDxy.dy);
}
