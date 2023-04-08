import * as PIXI from "pixi.js";
import { useEffect } from "react";

const getRadians = degrees => (degrees / 180) * Math.PI;
const getAngleDegrees = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
const getCos = degrees => Math.cos(getRadians(degrees));
const getSin = degrees => Math.sin(getRadians(degrees));
// getDistance: 두 물체의 x,y 좌표 사이 거리를 구함.
const getDistance = (matter1, matter2) =>
  Math.sqrt(Math.pow(matter1.x - matter2.x, 2) + Math.pow(matter1.y - matter2.y, 2));

export default function Climber({ gameRef }) {
  const container = new PIXI.Container();

  const app = new PIXI.Application({
    width: 400,
    height: 400,
    backgroundColor: "#000",
  });
  app.stage.addChild(container);

  useEffect(() => {
    if (gameRef.current) {
      if (gameRef.current.firstChild)
        gameRef.current.removeChild(gameRef.current.firstChild);
      gameRef.current.appendChild(app.view);
    }
  }, [gameRef]);

  const hold = new PIXI.Graphics();
  container.addChild(hold);
  hold
    .beginFill("blue")
    .drawEllipse(50, 100, 30, 10)
    .beginFill("green")
    .drawEllipse(230, 140, 30, 10)
    .beginFill("purple")
    .drawEllipse(120, 70, 30, 10)
    .beginFill("skyblue")
    .drawEllipse(230, 30, 30, 10)
    .beginFill("brown")
    .drawRect(60, 240, 30, 10)
    .beginFill("brown")
    .drawRect(200, 240, 30, 10);

  const body = new PIXI.Graphics();
  const leftUpperArm = new PIXI.Graphics();
  const leftForeArm = new PIXI.Graphics();
  const leftHand = new PIXI.Graphics();
  const rightUpperArm = new PIXI.Graphics();
  const rightForeArm = new PIXI.Graphics();
  const rightHand = new PIXI.Graphics();
  const leftThigh = new PIXI.Graphics();
  const leftCalf = new PIXI.Graphics();
  const leftFoot = new PIXI.Graphics();
  const rightThigh = new PIXI.Graphics();
  const rightCalf = new PIXI.Graphics();
  const rightFoot = new PIXI.Graphics();
  container.addChild(body);
  container.addChild(leftThigh);
  container.addChild(leftCalf);
  container.addChild(leftFoot);
  container.addChild(rightThigh);
  container.addChild(rightCalf);
  container.addChild(rightFoot);
  container.addChild(leftUpperArm);
  container.addChild(leftForeArm);
  container.addChild(leftHand);
  container.addChild(rightUpperArm);
  container.addChild(rightForeArm);
  container.addChild(rightHand);
  const bodyWidth = 40;
  const bodyHeight = 60;
  const headRadius = 15;
  const leftShoulder = { x: 100, y: 150 };
  const rightShoulder = {
    x: leftShoulder.x + bodyWidth * getCos(body.angle),
    y: leftShoulder.y + bodyWidth * getSin(body.angle),
  };
  const leftCoxa = {
    x: leftShoulder.x - bodyHeight * getSin(body.angle),
    y: leftShoulder.y + bodyHeight * getCos(body.angle),
  };
  const rightCoxa = {
    x: rightShoulder.x - bodyHeight * getSin(body.angle),
    y: rightShoulder.y + bodyHeight * getCos(body.angle),
  };
  const armLength = 40;
  const armWidth = 10;
  const legLength = 50;
  const legWidth = 15;
  const handRadius = 10;

  // body setting
  body.beginFill("#555").drawRect(0, 0, bodyWidth, bodyHeight);
  body.beginFill("#999").drawCircle(bodyWidth / 2, -headRadius, headRadius);
  body.position.set(leftShoulder.x, leftShoulder.y);

  // left arm 초기값만 설정
  const leftUpperArmDxy = {
    dx: -armLength * getCos(20),
    dy: -armLength * getSin(20),
  };
  const leftForeArmDxy = {
    dx: -armLength * getCos(70),
    dy: -armLength * getSin(70),
  };

  leftUpperArm.position = body.position;
  leftUpperArm.lineStyle(armWidth, "gray").lineTo(leftUpperArmDxy.dx, leftUpperArmDxy.dy);

  leftForeArm.position.set(
    leftUpperArm.x + leftUpperArmDxy.dx,
    leftUpperArm.y + leftUpperArmDxy.dy
  );
  leftForeArm
    .lineStyle(armWidth, "lightgray")
    .lineTo(leftForeArmDxy.dx, leftForeArmDxy.dy);

  leftHand.beginFill("white").drawCircle(0, 0, handRadius);
  leftHand.position.set(
    leftForeArm.x + leftForeArmDxy.dx,
    leftForeArm.y + leftForeArmDxy.dy
  );

  // right arm 초기값만 설정
  const rightUpperArmDxy = {
    dx: armLength * getCos(-10),
    dy: -armLength * getSin(-10),
  };
  const rightForeArmDxy = {
    dx: armLength * getCos(30),
    dy: -armLength * getSin(30),
  };

  rightUpperArm.position.set(rightShoulder.x, rightShoulder.y);
  rightUpperArm
    .lineStyle(armWidth, "gray")
    .lineTo(rightUpperArmDxy.dx, rightUpperArmDxy.dy);

  rightForeArm.position.set(
    rightUpperArm.x + rightUpperArmDxy.dx,
    rightUpperArm.y + rightUpperArmDxy.dy
  );
  rightForeArm
    .lineStyle(armWidth, "lightgray")
    .lineTo(rightForeArmDxy.dx, rightForeArmDxy.dy);

  rightHand.beginFill("white").drawCircle(0, 0, handRadius);
  rightHand.position.set(
    rightForeArm.x + rightForeArmDxy.dx,
    rightForeArm.y + rightForeArmDxy.dy
  );

  // left leg 초기값만 설정
  const leftThighDxy = {
    dx: -legLength * getCos(20),
    dy: -legLength * getSin(20),
  };
  const leftCalfDxy = {
    dx: -legLength * getCos(120),
    dy: legLength * getSin(120),
  };

  leftThigh.position.set(leftCoxa.x, leftCoxa.y);
  leftThigh.lineStyle(legWidth, "gray").lineTo(leftThighDxy.dx, leftThighDxy.dy);

  leftCalf.position.set(leftThigh.x + leftThighDxy.dx, leftThigh.y + leftThighDxy.dy);
  leftCalf.lineStyle(legWidth, "lightgray").lineTo(leftCalfDxy.dx, leftCalfDxy.dy);

  leftFoot.beginFill("#777").drawCircle(0, 0, handRadius);
  leftFoot.position.set(leftCalf.x + leftCalfDxy.dx, leftCalf.y + leftCalfDxy.dy);

  // right leg 초기값만 설정
  const rightThighDxy = {
    dx: legLength * getCos(10),
    dy: -legLength * getSin(10),
  };
  const rightCalfDxy = {
    dx: legLength * getCos(45),
    dy: legLength * getSin(45),
  };

  rightThigh.position.set(rightCoxa.x, rightCoxa.y);
  rightThigh.lineStyle(legWidth, "gray").lineTo(rightThighDxy.dx, rightThighDxy.dy);

  rightCalf.position.set(
    rightThigh.x + rightThighDxy.dx,
    rightThigh.y + rightThighDxy.dy
  );
  rightCalf.lineStyle(legWidth, "lightgray").lineTo(rightCalfDxy.dx, rightCalfDxy.dy);

  rightFoot.beginFill("#777").drawCircle(0, 0, handRadius);
  rightFoot.position.set(rightCalf.x + rightCalfDxy.dx, rightCalf.y + rightCalfDxy.dy);

  const leftArmList = [leftHand, leftForeArm, leftUpperArm, leftShoulder];
  const rightArmList = [rightHand, rightForeArm, rightUpperArm, rightShoulder];
  const leftLegList = [leftFoot, leftCalf, leftThigh, leftCoxa];
  const rightLegList = [rightFoot, rightCalf, rightThigh, rightCoxa];

  // hand drag event
  function onDragStart() {
    this.cursor = "grabbing";
    this.alpha = 0.5;
    this.on("pointermove", onDragging);
  }

  function onDragging(event) {
    if (this === body) return moveBody(event);
    this.x = event.clientX;
    this.y = event.clientY - handRadius * 2;

    if (this === leftHand) return moveJoint(...leftArmList, 1, armWidth, armLength);
    if (this === rightHand) return moveJoint(...rightArmList, -1, armWidth, armLength);
    if (this === leftFoot) return moveJoint(...leftLegList, -1, legWidth, legLength);
    if (this === rightFoot) return moveJoint(...rightLegList, 1, legWidth, legLength);
  }

  function moveBody(event) {
    leftShoulder.x = event.clientX - bodyWidth / 2;
    leftShoulder.y = event.clientY - bodyHeight / 2 - headRadius;

    rightShoulder.x = leftShoulder.x + bodyWidth * getCos(body.angle);
    rightShoulder.y = leftShoulder.y + bodyWidth * getSin(body.angle);
    leftCoxa.x = leftShoulder.x - bodyHeight * getSin(body.angle);
    leftCoxa.y = leftShoulder.y + bodyHeight * getCos(body.angle);
    rightCoxa.x = rightShoulder.x - bodyHeight * getSin(body.angle);
    rightCoxa.y = rightShoulder.y + bodyHeight * getCos(body.angle);

    body.position.set(leftShoulder.x, leftShoulder.y);

    moveJointByBodyMovement(...leftArmList, 1, armWidth, armLength);
    moveJointByBodyMovement(...rightArmList, -1, armWidth, armLength);
    moveJointByBodyMovement(...leftLegList, -1, legWidth, legLength);
    moveJointByBodyMovement(...rightLegList, 1, legWidth, legLength);
  }

  function moveJointByBodyMovement(
    hand,
    foreArm,
    upperArm,
    shoulder,
    flag,
    armLegWidth,
    armLegLength
  ) {
    const handToBody = getDistance(shoulder, hand);
    const h = Math.sqrt(Math.pow(armLegLength, 2) - Math.pow(handToBody / 2, 2));
    const theta1 = getAngleDegrees(handToBody / 2, h);
    const theta2 = getAngleDegrees(flag * (shoulder.x - hand.x), -shoulder.y + hand.y);
    const angles = theta1 + theta2;
    upperArm.position.set(shoulder.x, shoulder.y);
    upperArm
      .clear()
      .lineStyle(armLegWidth, "gray")
      .lineTo(armLegLength * -getCos(angles) * flag, armLegLength * getSin(angles));

    foreArm.position.set(
      upperArm.x + armLegLength * -getCos(angles) * flag,
      upperArm.y + armLegLength * getSin(angles)
    );
    foreArm
      .clear()
      .lineStyle(armLegWidth, "lightgray")
      .lineTo(hand.x - foreArm.x, hand.y - foreArm.y);
  }

  function moveJoint(hand, foreArm, upperArm, shoulder, flag, armLegWidth, armLegLength) {
    const handToBody = getDistance(shoulder, hand);
    const h = Math.sqrt(Math.pow(armLegLength, 2) - Math.pow(handToBody / 2, 2));
    const theta1 = getAngleDegrees(handToBody / 2, h);
    const theta2 = getAngleDegrees(flag * (shoulder.x - hand.x), shoulder.y - hand.y);
    const angles = theta1 + theta2;

    foreArm.position.set(hand.x, hand.y);
    foreArm
      .clear()
      .lineStyle(armLegWidth, "lightgray")
      .lineTo(armLegLength * getCos(angles) * flag, armLegLength * getSin(angles));

    upperArm.position.set(
      foreArm.x + armLegLength * getCos(angles) * flag,
      foreArm.y + armLegLength * getSin(angles)
    );
    upperArm
      .clear()
      .lineStyle(armLegWidth, "gray")
      .lineTo(shoulder.x - upperArm.x, shoulder.y - upperArm.y);
  }

  function onDragEnd() {
    container.children.forEach(child => {
      child.cursor = "grab";
      child.alpha = 1;
      child.off("pointermove");
    });
  }

  const limbs = [leftHand, rightHand, leftFoot, rightFoot, body];
  limbs.forEach(limb => {
    limb
      .on("pointerover", function () {
        return (this.cursor = "grab");
      })
      .on("pointerdown", onDragStart).eventMode = "dynamic";
  });

  document.body.addEventListener("pointerup", onDragEnd);

  function applyGravity() {
    const leftForeArmAngleOrigin = getAngleDegrees(
      leftUpperArm.y - leftForeArm.y,
      leftUpperArm.x - leftForeArm.x
    );

    const leftUpperArmAngleOrigin = getAngleDegrees(
      body.y - leftUpperArm.y,
      body.x - leftUpperArm.x
    );

    const bodyAngleOrigin = getAngleDegrees(
      leftForeArmDxy.dy + leftUpperArmDxy.dy + bodyHeight / 2,
      leftForeArmDxy.dx + leftUpperArmDxy.dx + bodyWidth / 2
    );

    let angleVelocity = 0;

    const gravity = setInterval(() => {
      rotate();

      const isRotationFinished =
        Math.abs(leftForeArm.angle) >= Math.abs(leftForeArmAngleOrigin) &&
        Math.abs(leftUpperArm.angle) >= Math.abs(leftUpperArmAngleOrigin) &&
        body.angle >= bodyAngleOrigin / 2;

      if (isRotationFinished) clearInterval(gravity);
    }, 1);

    function rotate() {
      angleVelocity += 0.02;

      if (Math.abs(leftForeArm.angle) < Math.abs(leftForeArmAngleOrigin)) {
        leftForeArmAngleOrigin > 0
          ? (leftForeArm.rotation += angleVelocity * 0.001)
          : (leftForeArm.rotation -= angleVelocity * 0.001);

        const newAngle = leftForeArmAngleOrigin - leftForeArm.angle;

        leftUpperArm.x = leftHand.x + armLength * getSin(newAngle);
        leftUpperArm.y = leftHand.y + armLength * getCos(newAngle);
      }

      if (Math.abs(leftUpperArm.angle) < Math.abs(leftUpperArmAngleOrigin)) {
        leftUpperArmAngleOrigin > 0
          ? (leftUpperArm.rotation += angleVelocity * 0.001)
          : (leftUpperArm.rotation -= angleVelocity * 0.001);
        const newAngle = leftUpperArmAngleOrigin - leftUpperArm.angle;

        body.x = leftUpperArm.position._x + armLength * getSin(newAngle);
        body.y = leftUpperArm.position._y + armLength * getCos(newAngle);
      }

      if (Math.abs(body.angle) < Math.abs(bodyAngleOrigin / 2)) {
        body.rotation += angleVelocity * 0.002;
      }

      console.log("rotate..");
    }
  }

  return (
    <>
      <button onClick={applyGravity}>gravity start</button>
    </>
  );
}
