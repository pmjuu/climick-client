/* eslint-disable react/prop-types */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { useEffect } from "react";
import { Application, Container, Graphics } from "pixi.js";
import { getCos, getSin } from "../utils/math";
import { holdContainer, holdInfo } from "../utils/hold";
import moveJoint from "../utils/moveJoint";
import applyGravity from "../utils/applyGravity";
import moveJointByBody from "../utils/moveJointByBody";

export default function Climber({ gameRef }) {
  const container = new Container();

  const app = new Application({
    width: 950,
    height: 770,
    backgroundColor: "#000",
  });
  app.stage.addChild(holdContainer);
  app.stage.addChild(container);

  useEffect(() => {
    if (gameRef.current) {
      if (gameRef.current.firstChild)
        gameRef.current.removeChild(gameRef.current.firstChild);
      gameRef.current.appendChild(app.view);
    }
  }, [gameRef, app.view]);

  const body = new Graphics();
  const leftUpperArm = new Graphics();
  const leftForeArm = new Graphics();
  const leftHand = new Graphics();
  const rightUpperArm = new Graphics();
  const rightForeArm = new Graphics();
  const rightHand = new Graphics();
  const leftThigh = new Graphics();
  const leftCalf = new Graphics();
  const leftFoot = new Graphics();
  const rightThigh = new Graphics();
  const rightCalf = new Graphics();
  const rightFoot = new Graphics();
  container.addChild(leftThigh);
  container.addChild(leftCalf);
  container.addChild(leftFoot);
  container.addChild(rightThigh);
  container.addChild(rightCalf);
  container.addChild(rightFoot);
  container.addChild(body);
  container.addChild(leftUpperArm);
  container.addChild(leftForeArm);
  container.addChild(leftHand);
  container.addChild(rightUpperArm);
  container.addChild(rightForeArm);
  container.addChild(rightHand);
  const bodyWidth = 40;
  const bodyHeight = 60;
  const headRadius = 15;
  const leftShoulder = { x: 450, y: 630 };
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
  body
    .beginFill("#555")
    .drawRect(0, 0, bodyWidth, bodyHeight)
    .beginFill("#999")
    .drawCircle(bodyWidth / 2, -headRadius, headRadius)
    .beginFill("black")
    .drawCircle(bodyWidth / 2, bodyHeight / 2, 5);
  body.position.set(leftShoulder.x, leftShoulder.y);

  // left arm 초기값만 설정
  const leftUpperArmDxy = {
    dx: -armLength * getCos(40),
    dy: -armLength * getSin(40),
  };
  const leftForeArmDxy = {
    dx: armLength * getCos(60),
    dy: -armLength * getSin(60),
  };

  leftUpperArm.position = body.position;
  leftUpperArm
    .lineStyle(armWidth, "gray")
    .lineTo(leftUpperArmDxy.dx, leftUpperArmDxy.dy);

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
    dx: armLength * getCos(50),
    dy: -armLength * getSin(50),
  };
  const rightForeArmDxy = {
    dx: armLength * getCos(140),
    dy: -armLength * getSin(140),
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
    dy: legLength * getSin(20),
  };
  const leftCalfDxy = {
    dx: -legLength * getCos(80),
    dy: legLength * getSin(80),
  };

  leftThigh.position.set(leftCoxa.x, leftCoxa.y);
  leftThigh
    .lineStyle(legWidth, "gray")
    .lineTo(leftThighDxy.dx, leftThighDxy.dy);

  leftCalf.position.set(
    leftThigh.x + leftThighDxy.dx,
    leftThigh.y + leftThighDxy.dy
  );
  leftCalf
    .lineStyle(legWidth, "lightgray")
    .lineTo(leftCalfDxy.dx, leftCalfDxy.dy);

  leftFoot.beginFill("#777").drawCircle(0, 0, handRadius);
  leftFoot.position.set(
    leftCalf.x + leftCalfDxy.dx,
    leftCalf.y + leftCalfDxy.dy
  );

  // right leg 초기값만 설정
  const rightThighDxy = {
    dx: legLength * getCos(30),
    dy: legLength * getSin(30),
  };
  const rightCalfDxy = {
    dx: legLength * getCos(120),
    dy: legLength * getSin(120),
  };

  rightThigh.position.set(rightCoxa.x, rightCoxa.y);
  rightThigh
    .lineStyle(legWidth, "gray")
    .lineTo(rightThighDxy.dx, rightThighDxy.dy);

  rightCalf.position.set(
    rightThigh.x + rightThighDxy.dx,
    rightThigh.y + rightThighDxy.dy
  );
  rightCalf
    .lineStyle(legWidth, "lightgray")
    .lineTo(rightCalfDxy.dx, rightCalfDxy.dy);

  rightFoot.beginFill("#777").drawCircle(0, 0, handRadius);
  rightFoot.position.set(
    rightCalf.x + rightCalfDxy.dx,
    rightCalf.y + rightCalfDxy.dy
  );

  const leftArmList = [leftHand, leftForeArm, leftUpperArm, leftShoulder];
  const rightArmList = [rightHand, rightForeArm, rightUpperArm, rightShoulder];
  const leftLegList = [leftFoot, leftCalf, leftThigh, leftCoxa];
  const rightLegList = [rightFoot, rightCalf, rightThigh, rightCoxa];
  const armSize = [armWidth, armLength];
  const legSize = [legWidth, legLength];

  // hand drag event
  function onDragStart() {
    this.cursor = "grabbing";
    this.alpha = 0.5;
    this.on("pointermove", onDragging);
  }

  function onDragging(event) {
    const wall = document.querySelector(".wall");
    const cursorInCanvas = {
      x: event.client.x - wall.offsetLeft,
      y: event.client.y - wall.offsetTop,
    };

    if (this === body) return moveBodyTo(cursorInCanvas);

    if (this === leftHand)
      return moveJoint(...leftArmList, ...armSize, cursorInCanvas, 1, 1);
    if (this === rightHand)
      return moveJoint(...rightArmList, ...armSize, cursorInCanvas, -1, 1);
    if (this === leftFoot)
      return moveJoint(...leftLegList, ...legSize, cursorInCanvas, -1, -1);
    if (this === rightFoot)
      return moveJoint(...rightLegList, ...legSize, cursorInCanvas, 1, -1);
  }

  let exceededPart = null;
  function moveBodyTo(cursorInCanvas) {
    leftShoulder.x = cursorInCanvas.x - bodyWidth / 2;
    leftShoulder.y = cursorInCanvas.y - bodyHeight / 2;

    rightShoulder.x = leftShoulder.x + bodyWidth * getCos(body.angle);
    rightShoulder.y = leftShoulder.y + bodyWidth * getSin(body.angle);
    leftCoxa.x = leftShoulder.x - bodyHeight * getSin(body.angle);
    leftCoxa.y = leftShoulder.y + bodyHeight * getCos(body.angle);
    rightCoxa.x = rightShoulder.x - bodyHeight * getSin(body.angle);
    rightCoxa.y = rightShoulder.y + bodyHeight * getCos(body.angle);

    if (!exceededPart)
      exceededPart = moveJointByBody(...leftArmList, ...armSize, 1);
    if (!exceededPart)
      exceededPart = moveJointByBody(...rightArmList, ...armSize, -1);
    if (!exceededPart)
      exceededPart = moveJointByBody(...leftLegList, ...legSize, -1);
    if (!exceededPart)
      exceededPart = moveJointByBody(...rightLegList, ...legSize, 1);

    if (!exceededPart) body.position.set(leftShoulder.x, leftShoulder.y);
  }

  function onDragEnd() {
    container.children.forEach(child => {
      child.cursor = "grab";
      child.alpha = 1;
      child.off("pointermove");
    });
    exceededPart = null;

    for (const hold of Object.values(holdInfo)) {
      const isAttachedToHold =
        hold.x < this.x &&
        this.x < hold.x + hold.width &&
        hold.y < this.y &&
        this.y < hold.y + hold.height;

      if (isAttachedToHold) return;
    }

    if (this === leftHand) applyGravity(...leftArmList, ...armSize, -1, 1);
    if (this === rightHand) applyGravity(...rightArmList, ...armSize, 1, 1);
    if (this === leftFoot) applyGravity(...leftLegList, ...legSize, -1, -1);
    if (this === rightFoot) applyGravity(...rightLegList, ...legSize, 1, -1);
  }

  const limbs = [leftHand, rightHand, leftFoot, rightFoot, body];
  limbs.forEach(limb => {
    limb.eventMode = "dynamic";
    limb
      .on("pointerover", function () {
        this.cursor = "grab";
      })
      .on("pointerdown", onDragStart)
      .on("pointerup", onDragEnd);
  });

  document.body.addEventListener("pointerup", onDragEnd);
}
