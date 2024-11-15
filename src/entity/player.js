/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-debugger */
import "@pixi/graphics-extras";
import { Container, Graphics } from "pixi.js";
import { BODY, COLOR } from "../assets/constants";
import drawLimb from "../utils/drawLimb";
import gravityRotate from "../utils/gravityRotate";
import gravityRotateLeg from "../utils/gravityRotateLeg";
import { getCos, getDistance, getSin } from "../utils/math";
import moveJoint from "../utils/moveJoint";
import moveJointByBody from "../utils/moveJointByBody";
import { getResultText, instabilityWarning, introText } from "../utils/text";

export const containerPosition = { x: 400, y: 620 };

export default class Player {
  constructor(holdData, holdContainer, updateGameStatus, isPractice = false) {
    // Function Injection
    this.updateGameStatus = updateGameStatus;

    // Status
    this.isPractice = isPractice;
    this.isAttached = {
      leftHandOnTop: false,
      rightHandOnTop: false,
      leftHand: true,
      rightHand: true,
      leftFoot: true,
      rightFoot: true,
    };
    this.isStable = true;

    // Environment
    this.container = new Container();
    this.container.position.set(...Object.values(containerPosition));
    this.holdContainer = holdContainer;
    this.holdData = holdData;

    // Body parts
    this.headRadius = 15;
    this.armLength = 40;
    this.armWidth = 10;
    this.legLength = 50;
    this.legWidth = 15;
    this.handRadius = 10;
    this.footRadius = 12;

    this.body = new Graphics();
    this.leftUpperArm = new Graphics();
    this.leftForeArm = new Graphics();
    this.leftHand = new Graphics();
    this.rightUpperArm = new Graphics();
    this.rightForeArm = new Graphics();
    this.rightHand = new Graphics();
    this.leftThigh = new Graphics();
    this.leftCalf = new Graphics();
    this.leftFoot = new Graphics();
    this.rightThigh = new Graphics();
    this.rightCalf = new Graphics();
    this.rightFoot = new Graphics();

    this.container.addChild(this.leftThigh, this.leftCalf, this.leftFoot);
    this.container.addChild(this.rightThigh, this.rightCalf, this.rightFoot);
    this.container.addChild(this.leftUpperArm, this.leftForeArm, this.leftHand);
    this.container.addChild(
      this.rightUpperArm,
      this.rightForeArm,
      this.rightHand
    );
    this.container.addChild(this.body);

    this.leftShoulder = { x: 40, y: 0 };
    this.rightShoulder = {
      x: this.leftShoulder.x + BODY.WIDTH * getCos(this.body.angle),
      y: this.leftShoulder.y + BODY.WIDTH * getSin(this.body.angle),
    };
    this.leftCoxa = {
      x:
        this.leftShoulder.x -
        BODY.HEIGHT * getSin(this.body.angle) +
        BODY.COXA_GAP,
      y: this.leftShoulder.y + BODY.HEIGHT * getCos(this.body.angle),
    };
    this.rightCoxa = {
      x:
        this.rightShoulder.x -
        BODY.HEIGHT * getSin(this.body.angle) -
        BODY.COXA_GAP,
      y: this.rightShoulder.y + BODY.HEIGHT * getCos(this.body.angle),
    };

    this.leftArmList = [
      this.leftHand,
      this.leftForeArm,
      this.leftUpperArm,
      this.leftShoulder,
    ];
    this.rightArmList = [
      this.rightHand,
      this.rightForeArm,
      this.rightUpperArm,
      this.rightShoulder,
    ];
    this.leftLegList = [
      this.leftFoot,
      this.leftCalf,
      this.leftThigh,
      this.leftCoxa,
    ];
    this.rightLegList = [
      this.rightFoot,
      this.rightCalf,
      this.rightThigh,
      this.rightCoxa,
    ];
    this.armSize = [this.armWidth, this.armLength];
    this.legSize = [this.legWidth, this.legLength];

    this.body
      .beginFill(COLOR.HAIR)
      .drawCircle(BODY.WIDTH / 2, -this.headRadius * 1.2, this.headRadius)
      .lineStyle(7, COLOR.PANTS)
      .beginFill(COLOR.PANTS)
      .drawRoundedRect(0, 0, BODY.WIDTH, BODY.HEIGHT, 10)
      .lineStyle(10, COLOR.PANTS)
      .drawRoundedRect(0, BODY.HEIGHT * 0.8, BODY.WIDTH, BODY.HEIGHT / 3, 10)
      .lineStyle("none")
      .beginFill(COLOR.SKIN)
      .drawCircle(-BODY.SHOULDER_GAP, 2, (this.armWidth + 5) / 2)
      .drawCircle(BODY.WIDTH + BODY.SHOULDER_GAP, 2, (this.armWidth + 5) / 2)
      .beginFill("#fff")
      .drawStar(BODY.WIDTH / 2, BODY.HEIGHT / 2, 5, 10);

    this.body.position.set(this.leftShoulder.x, this.leftShoulder.y);

    this.leftHand
      .lineStyle(1, COLOR.DARK_SKIN)
      .beginFill(COLOR.SKIN)
      .drawCircle(0, 0, this.handRadius);
    this.rightHand
      .lineStyle(1, COLOR.DARK_SKIN)
      .beginFill(COLOR.SKIN)
      .drawCircle(0, 0, this.handRadius);
    this.leftFoot.beginFill(COLOR.SHOES).drawCircle(0, 0, this.footRadius);
    this.rightFoot.beginFill(COLOR.SHOES).drawCircle(0, 0, this.footRadius);

    drawLimb(...this.leftArmList, ...this.armSize, -1, 1, 40, 40);
    drawLimb(...this.rightArmList, ...this.armSize, 1, 1, 40, 30);
    drawLimb(...this.leftLegList, ...this.legSize, -1, -1, 50, 80);
    drawLimb(...this.rightLegList, ...this.legSize, 1, -1, 50, 80);

    this.limbs = [this.leftHand, this.rightHand, this.leftFoot, this.rightFoot];
    this.limbs.forEach(limb => {
      limb.eventMode = "dynamic";
      limb
        .on("pointerover", () => {
          limb.cursor = "grab";
        })
        .on("pointerdown", () => this.onDragStart(limb));
    });

    this.dragTarget = null;
    this.exceededPart = { hand: null, shoulder: null };

    this.initialContainerHeight = this.container.height;
  }

  get isLimbFullyExtended() {
    return this.exceededPart.hand && this.exceededPart.shoulder;
  }

  get getPlayerStatus() {
    return {
      isAttached: this.isAttached,
      isStable: this.isStable,
    };
  }

  onDragStart(limb) {
    this.holdContainer.removeChild(introText);
    this.container.removeChild(instabilityWarning);
    const { isAttached } = this;

    if (isAttached.leftHand && isAttached.rightHand)
      this.container.addChildAt(this.body, 13);

    if (!this.isPractice) {
      this.updateGameStatus("start", true);
    }

    const isTwoHandsDetached =
      (!isAttached.leftHand && limb === this.rightHand) ||
      (!isAttached.rightHand && limb === this.leftHand);

    if (isTwoHandsDetached) {
      setTimeout(() => {
        this.failWithMessage("Fail...");
      }, 700);
    }

    limb.cursor = "grabbing";
    limb.alpha = limb === this.body ? 1 : 0.5;
    this.dragTarget = limb;
    const wall = document.querySelector(".wall");
    wall.addEventListener("pointermove", this.onDragging);
    wall.addEventListener("pointerup", this.onDragEnd);
    this.rearrangeBody(this.exceededPart);
  }

  onDragging = event => {
    const { dragTarget, armLength, legLength } = this;
    const wall = event.target;

    const cursorInContainer = {
      x: event.clientX - wall.offsetLeft - containerPosition.x,
      y: event.clientY - wall.offsetTop - containerPosition.y,
    };
    if (dragTarget === this.body) return this.moveBodyTo(cursorInContainer);

    if (dragTarget === this.leftHand) {
      const theta2 = moveJoint(
        ...this.leftArmList,
        ...this.armSize,
        cursorInContainer,
        1,
        1,
        this.handRadius
      );

      if (!theta2) return;

      return this.moveBodyTo({
        x:
          cursorInContainer.x + armLength * 2 * getCos(theta2) + BODY.WIDTH / 2,
        y:
          cursorInContainer.y +
          armLength * 2 * getSin(theta2) +
          BODY.HEIGHT / 2,
      });
    }

    if (dragTarget === this.rightHand) {
      const theta2 = moveJoint(
        ...this.rightArmList,
        ...this.armSize,
        cursorInContainer,
        -1,
        1,
        this.handRadius
      );

      if (!theta2) return;

      return this.moveBodyTo({
        x:
          cursorInContainer.x - armLength * 2 * getCos(theta2) - BODY.WIDTH / 2,
        y:
          cursorInContainer.y +
          armLength * 2 * getSin(theta2) +
          BODY.HEIGHT / 2,
      });
    }

    if (dragTarget === this.leftFoot) {
      const theta2 = moveJoint(
        ...this.leftLegList,
        ...this.legSize,
        cursorInContainer,
        -1,
        -1,
        this.footRadius
      );

      if (!theta2) return;

      return this.moveBodyTo({
        x:
          cursorInContainer.x -
          legLength * 2 * getSin(90 - theta2) +
          BODY.WIDTH / 2,
        y:
          cursorInContainer.y +
          legLength * 2 * getCos(90 - theta2) -
          BODY.HEIGHT / 2,
      });
    }

    if (dragTarget === this.rightFoot) {
      const theta2 = moveJoint(
        ...this.rightLegList,
        ...this.legSize,
        cursorInContainer,
        1,
        -1,
        this.footRadius
      );

      if (!theta2) return;

      return this.moveBodyTo({
        x:
          cursorInContainer.x +
          legLength * 2 * getSin(90 - theta2) -
          BODY.WIDTH / 2,
        y:
          cursorInContainer.y +
          legLength * 2 * getCos(90 - theta2) -
          BODY.HEIGHT / 2,
      });
    }
  };

  moveBodyTo(cursorInContainer) {
    const {
      isAttached,
      body,
      leftShoulder,
      rightShoulder,
      leftCoxa,
      rightCoxa,
      leftArmList,
      rightArmList,
      leftLegList,
      rightLegList,
      armSize,
      handRadius,
      legSize,
      footRadius,
      leftHand,
      rightHand,
      leftFoot,
      rightFoot,
      armLength,
      legLength,
      dragTarget,
      exceededPart,
      isLimbFullyExtended,
    } = this;

    if (isLimbFullyExtended) {
      return;
    }

    leftShoulder.x = cursorInContainer.x - BODY.WIDTH / 2;
    leftShoulder.y = cursorInContainer.y - BODY.HEIGHT / 2;

    rightShoulder.x = leftShoulder.x + BODY.WIDTH * getCos(body.angle);
    rightShoulder.y = leftShoulder.y + BODY.WIDTH * getSin(body.angle);
    leftCoxa.x = leftShoulder.x - BODY.HEIGHT * getSin(body.angle);
    leftCoxa.y = leftShoulder.y + BODY.HEIGHT * getCos(body.angle);
    rightCoxa.x = rightShoulder.x - BODY.HEIGHT * getSin(body.angle);
    rightCoxa.y = rightShoulder.y + BODY.HEIGHT * getCos(body.angle);

    if (!isLimbFullyExtended) {
      const fullyExtendedLimb = moveJointByBody(
        ...leftArmList,
        ...armSize,
        1,
        1,
        handRadius
      );
      Object.assign(exceededPart, fullyExtendedLimb);
    }
    if (!isLimbFullyExtended) {
      const fullyExtendedLimb = moveJointByBody(
        ...rightArmList,
        ...armSize,
        -1,
        1,
        handRadius
      );
      Object.assign(exceededPart, fullyExtendedLimb);
    }
    if (!isLimbFullyExtended) {
      const fullyExtendedLimb = moveJointByBody(
        ...leftLegList,
        ...legSize,
        -1,
        -1,
        footRadius
      );
      Object.assign(exceededPart, fullyExtendedLimb);
    }
    if (!isLimbFullyExtended) {
      const fullyExtendedLimb = moveJointByBody(
        ...rightLegList,
        ...legSize,
        1,
        -1,
        footRadius
      );
      Object.assign(exceededPart, fullyExtendedLimb);
    }

    if (!isLimbFullyExtended) {
      if (!isAttached.leftHand && dragTarget !== leftHand) {
        leftHand.position.set(
          leftShoulder.x,
          leftShoulder.y + armLength * 2 - 3
        );
      } else if (!isAttached.rightHand && dragTarget !== rightHand) {
        rightHand.position.set(
          rightShoulder.x,
          rightShoulder.y + armLength * 2 - 3
        );
      } else if (!isAttached.leftFoot && dragTarget !== leftFoot) {
        leftFoot.position.set(leftCoxa.x, leftCoxa.y + legLength * 2 - 5);
      } else if (!isAttached.rightFoot && dragTarget !== rightFoot) {
        rightFoot.position.set(rightCoxa.x, rightCoxa.y + legLength * 2 - 5);
      }

      body.position.set(leftShoulder.x, leftShoulder.y);
    }
  }

  onDragEnd = () => {
    const {
      isAttached,
      dragTarget,
      holdData,
      body,
      leftArmList,
      rightArmList,
      leftLegList,
      rightLegList,
      armSize,
      legSize,
      leftHand,
      rightHand,
      leftFoot,
      rightFoot,
      handRadius,
      footRadius,
      holdContainer,
      container: playerContainer,
      exceededPart,
    } = this;

    if (!dragTarget) return;

    const wall = document.querySelector(".wall");
    wall.removeEventListener("pointermove", this.onDragging);
    dragTarget.alpha = 1;

    for (const hold of Object.values(holdData)) {
      const cursor = {
        x: dragTarget.x + containerPosition.x,
        y: dragTarget.y + containerPosition.y,
      };

      const handFootRadius =
        dragTarget === leftHand || dragTarget === rightHand
          ? handRadius
          : footRadius;

      const isAttachedToHold = hold.radius
        ? getDistance(hold, cursor) < hold.radius + handFootRadius
        : hold.x - handFootRadius < cursor.x &&
          cursor.x < hold.x + hold.width + handFootRadius &&
          hold.y - handFootRadius < cursor.y &&
          cursor.y < hold.y + hold.height + handFootRadius;

      if (isAttachedToHold) {
        if (dragTarget === leftHand) {
          isAttached.leftHand = true;

          if (hold.text === "top") {
            // TODO :: identify by hold ID
            isAttached.leftHandOnTop = true;
          }
        }

        if (dragTarget === rightHand) {
          isAttached.rightHand = true;

          if (hold.text === "top") {
            isAttached.rightHandOnTop = true;
          }
        }

        if (isAttached.leftHandOnTop && isAttached.rightHandOnTop) {
          this.updateGameStatus("success", true);
          holdContainer.addChild(getResultText("Success!"));
          playerContainer.eventMode = "none";

          wall.removeEventListener("pointermove", this.onDragging);
          wall.removeEventListener("pointerup", this.onDragEnd);
        }

        if (dragTarget === leftFoot) {
          isAttached.leftFoot = true;
        }
        if (dragTarget === rightFoot) {
          isAttached.rightFoot = true;
        }

        this.checkGravityCenter();
        this.rearrangeBody(exceededPart);
        return;
      }
    }

    if (dragTarget === leftHand) {
      isAttached.leftHand = false;
      gravityRotate(...leftArmList, ...armSize, -1, handRadius);
      playerContainer.addChildAt(body, 6);
    } else if (dragTarget === rightHand) {
      isAttached.rightHand = false;
      gravityRotate(...rightArmList, ...armSize, 1, handRadius);
      playerContainer.addChildAt(body, 6);
    } else if (dragTarget === leftFoot) {
      isAttached.leftFoot = false;
      gravityRotateLeg(...leftLegList, ...legSize, -1, -1);
    } else if (dragTarget === rightFoot) {
      isAttached.rightFoot = false;
      gravityRotateLeg(...rightLegList, ...legSize, 1, -1);
    }

    this.checkGravityCenter();
    this.rearrangeBody(exceededPart);

    if (
      !isAttached.leftHand ||
      !isAttached.rightHand ||
      !isAttached.leftFoot ||
      !isAttached.rightFoot
    ) {
      this.showWarning(body);
    }
  };

  showWarning(ref) {
    instabilityWarning.position.set(
      ref.x + BODY.WIDTH / 2,
      ref.y - BODY.HEIGHT / 2 - this.headRadius * 3
    );
    this.container.addChild(instabilityWarning);
  }

  checkGravityCenter() {
    const {
      body,
      leftHand,
      rightHand,
      leftFoot,
      rightFoot,
      leftShoulder,
      exceededPart,
      isLimbFullyExtended,
    } = this;

    const handsCenterX = (leftHand.x + rightHand.x) / 2;
    const gravityCenterX = body.x + BODY.WIDTH / 2;
    const gravityCenterXdirection = gravityCenterX < handsCenterX ? -1 : 1;
    const isGravityCenterBetweenFeet =
      leftFoot.x < gravityCenterX && gravityCenterX < rightFoot.x;
    this.isStable = isGravityCenterBetweenFeet;

    let descentVelocityX = 0;
    let descentVelocityY = 0;

    const descendByGravity = () => {
      descentVelocityY += 0.3;

      if (
        (handsCenterX - body.x + BODY.WIDTH / 2) * gravityCenterXdirection <
        0
      ) {
        descentVelocityX = 0;
      } else {
        descentVelocityX += 0.3;
      }

      this.moveBodyTo({
        x:
          leftShoulder.x +
          BODY.WIDTH / 2 -
          0.2 * descentVelocityX * gravityCenterXdirection,
        y: leftShoulder.y + BODY.HEIGHT / 2 + 0.3 * descentVelocityY,
      });

      if (isLimbFullyExtended) {
        this.rearrangeBody(exceededPart);

        return this.showWarning(body);
      }

      requestAnimationFrame(descendByGravity);
    };

    if (!isGravityCenterBetweenFeet) {
      descendByGravity();
    }
  }

  rearrangeBody(part) {
    const {
      isAttached,
      body,
      leftShoulder,
      rightShoulder,
      leftCoxa,
      rightCoxa,
      leftHand,
      rightHand,
      leftFoot,
      rightFoot,
      armLength,
      legLength,
      dragTarget,
      exceededPart,
      isLimbFullyExtended,
    } = this;

    if (!isAttached.leftHand && dragTarget !== leftHand) {
      leftHand.position.set(leftShoulder.x, leftShoulder.y + armLength * 2 - 2);
    } else if (!isAttached.rightHand && dragTarget !== rightHand) {
      rightHand.position.set(
        rightShoulder.x,
        rightShoulder.y + armLength * 2 - 2
      );
    } else if (!isAttached.leftFoot && dragTarget !== leftFoot) {
      leftFoot.position.set(leftCoxa.x, leftCoxa.y + legLength * 2 - 2);
    } else if (!isAttached.rightFoot && dragTarget !== rightFoot) {
      rightFoot.position.set(rightCoxa.x, rightCoxa.y + legLength * 2 - 2);
    }

    if (!isLimbFullyExtended) {
      return;
    }

    const flag = { x: null, y: null };
    flag.x = part.hand.x < part.shoulder.x ? -1 : 1;
    flag.y = part.hand.y < part.shoulder.y ? -1 : 1;

    Object.assign(exceededPart, { hand: null, shoulder: null });
    const rearrangePX = 3;

    this.moveBodyTo({
      x: body.x + rearrangePX * flag.x + BODY.WIDTH / 2,
      y: body.y + rearrangePX * flag.y + BODY.HEIGHT / 2,
    });
  }

  failWithMessage = displayText => {
    const wall = document.querySelector(".wall");
    wall.removeEventListener("pointermove", this.onDragging);
    wall.removeEventListener("pointerup", this.onDragEnd);

    let descentVelocity = 0;

    const animate = () => {
      descentVelocity += 0.4;
      this.container.y += descentVelocity * 0.3;

      const isPlayerAboveGround =
        this.container.y <
        containerPosition.y -
          this.leftShoulder.y +
          (this.initialContainerHeight - this.container.height);

      if (!isPlayerAboveGround) {
        this.updateGameStatus("fail", true);
        this.holdContainer.addChild(getResultText(displayText));
        return;
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  resetPosition = () => {
    const {
      body,
      leftArmList,
      rightArmList,
      leftLegList,
      rightLegList,
      armSize,
      legSize,
      leftShoulder,
      rightShoulder,
      leftCoxa,
      rightCoxa,
      container,
    } = this;

    container.removeChild(instabilityWarning);
    leftShoulder.x = 40;
    leftShoulder.y = 0;
    rightShoulder.x = leftShoulder.x + BODY.WIDTH * getCos(body.angle);
    rightShoulder.y = leftShoulder.y + BODY.WIDTH * getSin(body.angle);
    leftCoxa.x =
      leftShoulder.x - BODY.HEIGHT * getSin(body.angle) + BODY.COXA_GAP;
    leftCoxa.y = leftShoulder.y + BODY.HEIGHT * getCos(body.angle);
    rightCoxa.x =
      rightShoulder.x - BODY.HEIGHT * getSin(body.angle) - BODY.COXA_GAP;
    rightCoxa.y = rightShoulder.y + BODY.HEIGHT * getCos(body.angle);
    body.position.set(leftShoulder.x, leftShoulder.y);

    drawLimb(...leftArmList, ...armSize, -1, 1, 40, 40);
    drawLimb(...rightArmList, ...armSize, 1, 1, 40, 30);
    drawLimb(...leftLegList, ...legSize, -1, -1, 50, 80);
    drawLimb(...rightLegList, ...legSize, 1, -1, 50, 80);
  };

  onGameEnd = () => {
    this.container.eventMode = "none";
    this.container.removeChild(instabilityWarning);
  };
}
