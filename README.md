# **Climick**

<div align=center>

### _" Climbing + Click "_

🧗 마우스로 손발을 클릭해서 클라이밍을 할 수 있는 게임입니다.

[배포된 사이트](https://climick.netlify.app)

</div>

<br>

# Table of Contents

- [Preview](#preview)
- [Motivation](#motivation)
- [Challenges](#challenges)
  - [1. 관절 움직임 표현하기](#1-관절-움직임-표현하기)
    - [어떻게 해야 팔(다리)가 손(발) 움직임에 따라 접힐까?](#어떻게-해야-팔다리가-손발-움직임에-따라-접힐까)
    - [손을 뻗으면 다른 신체부위도 따라서 자연스럽게 움직이게 할 수 있을까?](#손을-뻗으면-다른-신체부위도-따라서-자연스럽게-움직이게-할-수-있을까)
  - [2. library 없이 직접 물리 엔진 구현하기](#2-library-없이-직접-물리-엔진-구현하기)
    - [물체에 항상 작용하는 중력을 어떻게 표현할까?](#물체에-항상-작용하는-중력을-어떻게-표현할까)
    - [중력이 다른 힘의 합력보다 크게 작용하는 상황 경우의 수 나누기](#중력이-다른-힘의-합력보다-크게-작용하는-상황-경우의-수-나누기)
  - [3. UX 개선하기](#3-ux-개선하기)
    - [마우스 이동 속도가 빠를 때, 부드러운 드래그 효과를 어떻게 나타낼까?](#마우스-이동-속도가-빠를-때-부드러운-드래그-효과를-어떻게-나타낼까)
    - [팔다리가 한 번 펴진 후에 다른 쪽 손/발을 움직여서 펴진 부분을 굽힐 수 있을까?](#팔다리가-한-번-펴진-후에-다른-쪽-손발을-움직여서-펴진-부분을-굽힐-수-있을까)
  - [4. 애니메이션 효과를 부드럽게 나타내기](#4-애니메이션-효과를-부드럽게-나타내기)
    - [`setInterval()` vs `requestAnimationFrame()`](#setinterval-vs-requestanimationframe)
- [Tech stack](#tech-stack)
- [Feature](#feature)
- [Timeline](#timeline)
- [Video](#video)
- [Repository Link](#repository-link)
- [Memoir](#memoir)

<br>

# Preview

![start](https://user-images.githubusercontent.com/50537876/235917302-157283eb-eb80-4a66-9393-911b3f77b8ad.gif)

<br>

# Motivation

_클라이밍, 수학, 물리_ - 제가 **좋아하는 요소**들을 모아서 아이디어를 기획했습니다.

단순히 특정 라이브러리 사용법을 아는 것을 떠나서, 모두가 배운 수학,물리 공식을 바탕으로 논리적으로 사고를 전개해나가는 과정을 보여주고 싶었습니다. 사람의 관절 움직임 및 물리엔진 구현이라는 **생소한 문제에 도전**해보고 싶었습니다.

**클라이밍짐에 가지 않더라도 클라이밍 동작들을 연습**할 수 있는 서비스가 있으면 좋겠다는 생각이 들었습니다.<br/>
그래서 이 게임은 단순히 재미로만 하는게 아니라 배울 점이 있도록 기획했습니다.

1. 하체 움직임을 생각하는 습관 기르기
   - 실제로 무게중심을 올릴 때는 팔로만 끌어올리는게 아니라,
     발을 먼저 올리고 하체힘으로 무게중심을 올리는게 체력 소모 효율에 있어서 좋습니다.
2. 루트 파인딩 (route finding) 연습하기
   - 루트 파인딩: 홀드를 보면서 어떤 동작과 순서로 홀드를 잡을지 판단하는 것

<br>

# Challenges

## 1. 관절 움직임 표현하기

### 어떻게 해야 팔(다리)가 손(발) 움직임에 따라 접힐까?

각 신체 부위를 하나의 `new Graphics()` 객체로 생성했습니다.

```javascript
// src/utils/player.js

export const body = new Graphics();
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
```
<sub>* 상완(upperArm): 어깨에서 팔꿈치까지의 팔 일부분을 지칭합니다.</sub>
<sub>* 전완(foreArm): 팔꿈치에서 손목까지의 팔 일부분을 지칭합니다.</sub>

팔(다리)의 전완 및 상완은 시작점 좌표와 x,y 변화량(`upperArmDxy`)으로 그릴 수 있는 `Line`으로 나타냈습니다.
```javascript
// src/utils/drawLimb.js

const upperArmDxy = {
  dx: limbLength * getCos(upperArmAngle) * flagX,
  dy: -limbLength * getSin(upperArmAngle) * flagY,
};

upperArm.position.set(shoulder.x + flagX * flagY, shoulder.y);

upperArm
  .lineStyle(limbWidth + 3, COLOR.SKIN)
  .lineTo(upperArmDxy.dx, upperArmDxy.dy);
```

`drawLimb.js` [전체 코드](https://github.com/pmjuu/climick-client/blob/fa8a889aa2af6bd1adef90b82cf5acc76fd1103f/src/utils/drawLimb.js)

#### 각도 및 신체 부위 좌표 계산 과정

<img width="720" alt="image" src="https://github.com/pmjuu/climick-client/assets/50537876/ff9c319f-c2fe-4525-9a62-d1e357e7c955">

손과 어깨의 좌표는 항상 알 수 있습니다. 따라서 위 그림에서 `theta1`과 `theta2`를 구할 수 있습니다.

```javascript
// src/utils/moveJoint.js

const handToShoulder = getDistance(shoulder, cursorInContainer);
const h = Math.sqrt(limbLength ** 2 - (handToShoulder / 2) ** 2) || 0; // 이등변삼각형 HES의 높이
const theta1 = getAngleDegrees(handToShoulder / 2, h);
const theta2 = getAngleDegrees(
  flagX * (shoulder.x - cursorInContainer.x),
  shoulder.y - cursorInContainer.y
);
```

팔의 전완과 상완의 길이는 같게 설정하고, <br>
상완이 지면과 이루는 각 (`theta1` - `theta2`)를 구해서 팔꿈치(`elbow`) 좌표를 계산할 수 있습니다.

```javascript
const elbow = {
  x: shoulder.x - flagX - limbLength * getCos(theta1 - theta2) * flagX,
  y: shoulder.y + limbLength * getSin(theta1 - theta2),
};
```

팔꿈치(`elbow`) 좌표를 바탕으로 상완(`upperArm`)과 전완(`foreArm`)을 그립니다.

```javascript
const upperArmDxy = {
  x: elbow.x - shoulder.x,
  y: elbow.y - shoulder.y,
};

upperArm
  .lineStyle(limbWidth + 3, COLOR.SKIN)
  .lineTo(upperArmDxy.x, upperArmDxy.y);

foreArm.position.set(elbow.x, elbow.y);

foreArm
  .lineStyle(limbWidth, COLOR.SKIN)
  .lineTo(hand.x - elbow.x, hand.y - elbow.y);
```

🔽 손 위치에 따라 팔이 자연스럽게 접히는 모습

<img src="https://user-images.githubusercontent.com/50537876/234890662-804eff9e-91fd-4595-992e-d616d4e817d2.gif" width=150>

### 손을 뻗으면 다른 신체부위도 따라서 자연스럽게 움직이게 할 수 있을까?

클라이밍 동작은 여러 신체부위의 움직임이 복합적으로 이루어진 결과물입니다.<br>
(ex. 손을 뻗어 멀리 있는 물체를 잡는다 = 손을 드래그해서 팔 관절이 이동한다 + 몸통이 손 방향으로 이동하면서 다른 관절도 움직인다​)

처음에는 손을 위로 뻗고, 몸통 올리고, 손 뻗는 과정을 통해서 무게중심을 올리게 했습니다.<br>
그런데 이 움직임은 부자연스러웠고, 사용자 입장에서 불편했습니다.

그래서 한 손을 뻗는 동작을 할 때, 다음과 같은 단계를 거쳐 움직임을 구현했습니다.

1. 먼저 팔 관절을 움직이는 함수 `moveJoint()`를 실행합니다. <br>
   이 과정에서 손에서 어깨까지 거리가 제한된 팔 길이를 넘어선다면 `theta2`를 반환하고,

2. 몸통을 움직이는 함수 `moveBodyTo()`를 실행합니다.<br>
```javascript
const theta2 = moveJoint(
  ...leftArmList,
  ...armSize,
  cursorInContainer,
  1,
  1,
  handRadius
);

if (!theta2) return;

return moveBodyTo({
  x: cursorInContainer.x + armLength * 2 * getCos(theta2) + BODY.WIDTH / 2,
  y: cursorInContainer.y + armLength * 2 * getSin(theta2) + BODY.HEIGHT / 2,
});
```
3. `moveBodyTo()`는 몸통의 위치를 바꾸고 함수 내부에서 `moveJointBody()`함수를 실행해서 다른 팔다리 관절을 몸통의 위치에 따라 자연스럽게 움직이게 합니다.

<br>

## 2. library 없이 직접 물리 엔진 구현하기

> **library 없이 구현하게 된 동기** <br>
중력가속도에 의한 신체부위 등가속 원운동만 잘 표현하면 되기 때문에 3rd party library 없이 직접 구현할 수 있겠다는 생각이 들었습니다.

### 물체에 항상 작용하는 중력을 어떻게 표현할까?
1. 모든 사물에 공통적으로 작용하는 중력 함수를 만든다. ❌
    - 장점
      - 신체 부위 외에 다른 객체에도 범용적으로 사용할 수 있습니다.
      - 유지보수가 용이합니다.
    - 문제점
      - 신체 부위는 다른 부위와 연결되어있으므로, 단순히 아래방향으로 중력이 작용하는 것 이외에 장력과 같은 다른 힘도 작용합니다.
      - 힘의 합력을 구해서 신체 움직임에 적용하는 로직을 구현하기에는 시간이 부족했습니다.
      <img src="https://github.com/pmjuu/climick-client/assets/50537876/e966878d-f274-4c08-bf18-e965f4551732" width="300px" height="230px">
2. `Pixi.JS`기반 플러그인 형태로 인체 중력 작용 함수를 만든다. ✅
    - 중력은 항상 작용하고 있는데, <u>특정 상황에서 중력이 다른 힘의 합력보다 크게 작용</u>해서 신체부위가 아래 방향으로 등가속원운동하거나 플레이어가 아래로 이동한다고 전제하고 로직을 구성했습니다.

### 중력이 다른 힘의 합력보다 크게 작용하는 상황 경우의 수 나누기

#### 1. 드래그앤드롭 후 손(발) 하나가 홀드에서 떨어진다면
  팔(다리)는 어깨(고관절)을 회전축으로 해서 중력 작용 방향으로 등가속 원운동을 합니다.

  - 손이 홀드에서 떨어졌다는 것을 어떻게 알 수 있을까?<br>
    - ~~홀드 각각의 입장에서 `pointerdown` 이벤트 발생 이후 `canvas` 에서 pointerup 이벤트가 발생하면 중력 작용 함수를 실행한다.~~<br>
      ⇒ 항상 홀드 위에 손발이 있기 때문에, 홀드는 `pointerdown` 이벤트를 감지할 수 없습니다.
    - 홀드 위치 기반으로 감지한다.<br>
      손/발에서 `pointerup` 이벤트가 발생할 때, 손/발이 정해진 홀드 좌표 내에 위치하지 않으면 중력 작용 함수를 실행합니다. (팔/다리는 어깨/고관절 좌표를 회전축으로 등가속 원운동을 한다.)
      * 이 때, 플레이어의 체력(HP) 소모가 큰 것으로 간주하여 HP가 빨리 줄어듭니다.

  - 등가속 원운동을 어떻게 표현할까?
    - `gravityRotate()`함수를 실행해서 상완 및 전완의 회전 각속도(`angleVelocity`)를 일정한 가속도로 증가시킵니다.
    - 중력은 항상 아래방향으로 작용하기에, 지면에 수직인 선과 팔이 이루는 각도와 같아질 때까지 <br>
    상완의 각도(`upperArm.angle`) 및 전완의 각도(`foreArm.angle`)를 증가시킵니다.
    ```js
    // src/utils/gravityRotate.js

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

    function rotateArm() {
      angleVelocity += 0.5;

      const isUpperArmRotating =
        Math.abs(upperArm.angle) < Math.abs(upperArmOriginalAngle);

      const foreArmRotatingGoal =
        Math.abs(upperArmOriginalAngle) + theta1 * 2 * rotatingDirection * flagX;

      const isForeArmRotating = Math.abs(foreArm.angle) < foreArmRotatingGoal;

      if (isUpperArmRotating) {
        upperArm.angle += angleVelocity * 0.2 * rotatingDirection;

        const newAngle = upperArmOriginalAngle - upperArm.angle;

        foreArm.x = shoulder.x + limbLength * getSin(newAngle);
        foreArm.y = shoulder.y + limbLength * getCos(newAngle);
      }

      if (isForeArmRotating) {
        foreArm.angle += angleVelocity * 0.2 * rotatingDirection;
      }

      const newAngle = foreArmRotatingGoal - Math.abs(foreArm.angle);

      hand.x = foreArm.x + limbLength * getSin(newAngle) * rotatingDirection;
      hand.y = foreArm.y + limbLength * getCos(newAngle);

      const isRotationFinished = !isUpperArmRotating && !isForeArmRotating;

      if (isRotationFinished) {
        return drawLimb( ... ); // 회전이 끝나면 각도가 0으로 리셋된 새로운 팔다리를 그립니다.
      }

      requestAnimationFrame(rotateArm);
    }

    rotateArm();
    ```

#### 2. 양 손이 홀드에서 떨어진다면

몸 전체가 아래 방향으로 등가속 운동을 합니다.

  - 홀드 좌표 범위 안에 있는 왼손/오른손의 개수를 변수로 저장합니다.
    - 각각 초기값은 1개이며, `onDragEnd()` 함수를 실행할 때마다 손이 홀드 위치에 있는지 판별해서 변수값을 변경합니다.
  - `onDragStart()` 함수 실행 시 손의 개수가 몇개인지 확인하고, 0개라면 `fallDown()` 함수를 실행합니다.
  - `fallDown()` 함수를 실행하면 플레이어가 포함된 `playerContainer`가 바닥에 닿을 때까지 <br>
  하강 속도(`descentVelocity`)를 일정한 가속도로 증가시키면서 아래로 이동합니다.
    ```js
    function fallDown(displayText) {
      let descentVelocity = 0;

      function descend() {
        descentVelocity += 0.4;
        playerContainer.y += descentVelocity * 0.3;

        const isPlayerAboveGround =
          playerContainer.y <
          containerPosition.y -
            leftShoulder.y + (initialContainerHeight - playerContainer.height);

        if (!isPlayerAboveGround) {
          gameStatus.fail = true;
          holdContainer.addChild(getResultText(displayText));
          return;
        }

        requestAnimationFrame(descend);
      }

      descend();
    }
    ```

#### 3. 무게중심의 x좌표가 양 발 사이에 없으면

한쪽 팔이 펴질 때까지 무게중심이 중력을 받아서 아래로 내려갑니다.

  * 드래그가 끝나고 `onDragEnd()` 함수가 실행되면, `checkGravityCenter()` 함수를 실행해서 무게중심 x좌표가 양 발의 x좌표 사이에 있는지 판별합니다.
  * 무게중심 x좌표가 양 발 사이에 없으면 `descendByGravity()` 함수를 실행해서 몸통이 아래로 내려갑니다.
  ```js
  function checkGravityCenter() {
    const gravityCenterX = body.x + BODY.WIDTH / 2;

    attachedStatus.isStable =
      leftFoot.x < gravityCenterX && gravityCenterX < rightFoot.x;

    if (!attachedStatus.isStable) {
      descendByGravity();
    }

    function descendByGravity() { ... }
  }
  ```
  * 이 때, 플레이어의 체력(HP) 소모가 큰 것으로 간주하여 HP가 빨리 줄어듭니다.

<br>

## 3. UX 개선하기

### 마우스 이동 속도가 빠를 때, 부드러운 드래그 효과를 어떻게 나타낼까?
<sub>* `hand`: 손/발을 지칭합니다.</sub>

#### 기존 코드
- `hand` 객체에 `pointermove` 이벤트를 등록해서 커서로 손을 드래그할 때 `onDragging()`함수를 실행합니다.
- `onDragging()` 함수에서 `moveJoint()` 함수를 실행하고, <br>
  `moveJoint()` 함수에서 `hand` x,y 좌표에 커서의 x,y 좌표를 대입함으로써 `hand`를 이동시킵니다.

#### 문제점
- 손 이동 속도가 마우스 드래그 속도를 못 따라가서 드래그 중에 동작이 끊기는 경우가 있었고 사용자 경험이 저하되었습니다.

#### 원인
- 커서 이동 속도가 빠를 때, 드래그 중에 실시간으로 `hand` x,y 좌표가 커서의 x,y 좌표로 업데이트되지 않았습니다.
- 따라서, 커서의 좌표가 `hand` 좌표를 벗어나는 현상이 빈번하게 발생했습니다.

#### 해결 방법
- `addEventListener("pointermove", onDragging)` 이벤트를 `hand` 객체가 아니라 뒷배경인 벽을 나타내는 `document.querySelector(".wall")` 에 등록합니다.
  ```js
  const wall = document.querySelector(".wall");
  wall.addEventListener("pointermove", onDragging);
  ```
- 커서 위치가 `hand` 좌표 범위를 벗어나더라도 (=어깨에서 커서까지의 거리가 팔 길이(`limbLength * 2`)보다 길어지더라도)<br>
  `어깨→손 벡터`가 `어깨→커서 벡터`와 방향만 같고 크기는 팔 길이로 일정하도록 `hand` 좌표를 업데이트합니다.
  ```js
  // src/utils/moveJoint.js

  const cursorToShoulder = getDistance(shoulder, cursorInContainer);
  ...
  if (cursorToShoulder > limbLength * 2) {
    hand.x = shoulder.x - limbLength * 2 * getCos(theta2) * flagX;
    hand.y = shoulder.y - limbLength * 2 * getSin(theta2);
  } else {
    hand.x = cursorInContainer.x;
    hand.y = cursorInContainer.y;
  }
  ```

#### 결과
- 사용자가 커서를 빠르게 움직여서 커서 위치가 손을 조금 벗어나도 손이 커서 쪽으로 이동합니다.
- 팔 길이보다 멀리 손을 드래그해도 손은 팔에 붙어있되, 커서 방향으로 움직입니다.

<br>

### 팔다리가 한 번 펴진 후에 다른 쪽 손/발을 움직여서 펴진 부분을 굽힐 수 있을까?

#### 문제점
- (드래그를 하거나 중력에 의해 팔/다리가 아래방향으로 떨어져서) 한쪽 팔/다리가 펴진 후, 다른 손/발을 드래그했을 때 한 번 펴진 팔다리가 굽혀지지 않았습니다.
- 펴진 쪽의 손/발을 직접 드래그해서 굽히는 방법도 있었으나, 이는 사용자 입장에서 불편했습니다.
  <img src="https://github.com/pmjuu/climick-client/assets/50537876/cec50377-8633-4ffe-bbef-65788f4a1121" width=250>

#### 원인
- 한쪽 팔/다리가 펴진 후 다른 손/발을 드래그했을 때 몸통을 움직이는 함수가 동작하지 않았습니다.
- 드래그를 멀리 해도 신체부위가 몸에서 떨어져나가지 않도록 하기 위해, 몸통 움직임 관련 함수는 한쪽 팔다리가 펴지면 동작을 하지 않도록 설계되어있었습니다.

#### 해결 방법
- 신체부위를 재정렬시키는 함수 `rearragneBody()`를 생성합니다.
- `pointerup`이벤트가 발생했을 때나 중력에 의해 팔/다리가 일직선으로 펴지고 난 후에 이 함수를 호출합니다.
- `rearragneBody()`에서 어깨/고관절 기준으로 손/발이 위치한 방향을 `flag`변수에 할당하고, `moveBodyTo()`함수를 실행시켜 신체부위들을 재정렬합니다.

  ```js
  function rearrangeBody(part) {
    if (!attachedStatus.leftHand && dragTarget !== leftHand) {
      leftHand.position.set(leftShoulder.x, leftShoulder.y + armLength * 2 - 2);
    } else if (!attachedStatus.rightHand && dragTarget !== rightHand) {
      rightHand.position.set(
        rightShoulder.x,
        rightShoulder.y + armLength * 2 - 2
      );
    } else if (!attachedStatus.leftFoot && dragTarget !== leftFoot) {
      leftFoot.position.set(leftCoxa.x, leftCoxa.y + legLength * 2 - 2);
    } else if (!attachedStatus.rightFoot && dragTarget !== rightFoot) {
      rightFoot.position.set(rightCoxa.x, rightCoxa.y + legLength * 2 - 2);
    }

    if (!part) return;

    const flag = { x: null, y: null };
    flag.x = part.hand.x < part.shoulder.x ? -1 : 1;
    flag.y = part.hand.y < part.shoulder.y ? -1 : 1;

    exceededPart = null;
    const rearrangePX = 3;

    moveBodyTo({
      x: body.x + rearrangePX * flag.x + BODY.WIDTH / 2,
      y: body.y + rearrangePX * flag.y + BODY.HEIGHT / 2,
    });
  }
  ```

#### 결과
- 팔/다리가 펴진 후 `pointerup`이벤트가 발생할 때, <br>
`rearragneBody` 함수를 실행해서 펴진 부분을 조금 굽힘으로써 다음 드래그 동작을 나타낼 수 있게 되었습니다.<br>
  <img src="https://github.com/pmjuu/climick-client/assets/50537876/36cbe67d-3bb8-4796-8230-1935c7ad185c" width=250>

<br>

## 4. 애니메이션 효과를 부드럽게 나타내기

이 게임에서는 중력에 의한 애니메이션 효과가 있습니다. (팔/다리가 아래로 떨어짐, 두 손을 놓았을 때 아래로 추락함) <br>
이를 부드럽게 나타내기 위해서 처음에는 `setInterval()`을 사용했으나 몇가지 차이점 때문에 `requestAnimationFrame()`으로 수정했습니다.

### `setInterval()` vs `requestAnimationFrame()`

#### 초당 호출 횟수
* `setInterval()`은 인자를 넘겨 초당 호출 횟수를 지정할 수 있습니다.
* `rAF()`는 브라우저의 리소스 & 컴퓨터의 CPU 성능을 고려하여 초당 실행횟수가 결정됩니다.(기본 60FPS)

#### 실행 방식
* `setInterval()`로 애니메이션을 만들 때는, func과 delay만 설정해주면 됩니다.
  ```js
  setInterval(func, delay);
  ```
* `rAF()`의 경우, `rAF()`의 callback내부에서 `rAF()`를 재호출해줘야 애니메이션 실행이 가능합니다.
  ```js
  requestAnimationFrame(render);

  function render() {
    ...
    requestAnimationFrame(render);
  }
  ```

#### 실행 중단 방식
* `setInterval()`은 고유한 id값을 리턴하므로, `clearInterval()`에 해당 id값을 넘겨주면 중단 가능합니다.
* `rAF()`도 고유한 id값을 리턴하는데, 이 id값을 `cancelAnimationFrame()`에 넘겨주면 중단 가능합니다.

#### 프레임의 부드러움
* `setInterval()`으로 구현한 애니메이션은 약간의 프레임 끊김이 발생하거나 프레임 자체를 빠뜨리는 문제가 발생할 수 있습니다.
* `rAF()`은 애니메이션을 위해 최적화된 함수이므로 애니메이션이 실행되는 환경에 관계 없이 적절한 프레임 속도로 실행되며, 탭이 활성화되지 않은 상태이거나 애니메이션이 페이지를 벗어난 경우에도 계속 실행되는 기존의 문제점을 해결할 수 있습니다.

#### 백그라운드 호출 여부
브라우저에서 여러 탭을 띄워놓고 있을 때 현재 웹페이지가 비활성화되어있으면
* `setInterval()` 은 백그라운드에서 호출되는 순간마다 계속 실행되지만
* `rAF()`은 화면에 repaint가 일어날 때 호출되므로 백그라운드에서 호출되지 않고 대기합니다.

#### `requestAnimationFrame()`을 선택한 이유
* 리렌더링이 끝나지 않았는데 애니메이션을 수행하는 명령이 내려진다면 원하는대로 애니메이션이 부드럽게 진행되지 않습니다. <br>
리페인트가 끝난 후 적용할 애니메이션을 `requestAnimationFrame()`의 콜백으로 넣어주면 자연스러운 애니메이션이 생성됩니다.
* `setInterval()`과 달리 프레임 생성 초기 단계에 맞춰 애니메이션이 호출되어서 더 부드러운 동작이 가능합니다.

<br>

# Tech stack

### Frontend

- React
- React router
- Redux-toolkit
- Styled Components
- Pixi.js
- ESLint
- Jest

### Backend

- Node.js
- Express
- MongoDB Atlas / Mongoose
- ESLint

### `Pixi.JS`를 선택한 이유

* 성능
  - WebGL 2D 렌더링에 관련된 기능들만 들어있기 때문에 굉장히 빠르고 가볍습니다.
* 크로스 플랫폼 호환성
  - 다양한 플랫폼과 기기에서 원활하게 작동하도록 설계되었습니다.
* 사용의 편의성
  - 직관적이고 간단한 API를 제공합니다.
  - 공식문서에 정리가 잘 되어있고 예제가 풍부합니다.

### NoSQL인 `MongoDB`를 선택한 이유

* 스키마 유연성
  - SQL에 비해 스키마가 유연하며, 다양한 데이터 유형과 구조를 처리할 수 있습니다.
  - 정해진 구조가 없으므로 데이터 구조가 자주 추가, 삭제, 변경되는 경우 유연하게 적용시킬 수 있습니다.
* 직관적인 데이터 모델
  - 데이터를 행(row) 대신 도큐먼트(document)에 저장하고, 이는 `JSON`에 기반합니다. 따라서 여러 테이블 간의 복잡한 조인 연산 없이 데이터의 계층 구조를 쉽게 파악할 수 있습니다.
* Scale out 구조
  - 수평적 확장이 가능하며, 데이터베이스를 여러 대의 서버에 분산시킴으로써 용량을 늘릴 수 있습니다.

<br>

# Feature

\*홀드: 손발로 잡을 수 있는 벽에 붙어있는 돌 형태를 의미합니다.

- 하늘색 배경에 있는 모든 물체들은 잡거나 밟을 수 있는 홀드입니다.
- 사용자는 플레이어의 손/발/몸통을 드래그해서 움직일 수 있습니다.
- 플레이어의 손/발을 드래그해서 홀드 위에 놓으면 고정됩니다. 그렇지 않으면 손/발이 아래로 떨어집니다.
- 무게중심의 x좌표가 양 발 사이에 없으면 한쪽 팔이 펴질 때까지 무게중심이 중력을 받아서 아래로 내려갑니다.
- 손/발이 홀드에서 떨어지거나 무게중심이 양 발 사이에 없으면, 체력(HP) 소모가 큰 것으로 간주하여 HP가 빨리 줄어듭니다.
- 양손으로 TOP홀드를 잡으면 완등(성공)이며, 랭킹정보에 기록이 등록됩니다.
- 랭킹은 등반 시간이 짧은 순서대로 높아지며, 같은 시간일 경우 HP가 많이 남은 사람이 순위가 높아집니다.

<br>

# Timeline

### 프로젝트 기간: 2023.04.03(월) ~ 2023.04.28(금)

- 1 주차: 기획 및 설계
- 2~3 주차: 기능 개발
- 4 주차: 테스트코드 작성, 발표

<br>

# Video

썸네일을 클릭하면 게임 시연 영상 유튜브 링크로 이동합니다.

🔽 첫번째 루트

[![Video Label](http://img.youtube.com/vi/w5qo4VSKXTo/0.jpg)](https://youtu.be/w5qo4VSKXTo)

# Repository Link

[Server](https://github.com/pmjuu/climick-server)

<br>

# Memoir

`Canvas API`로 게임을 만든 것은 이번이 처음이었습니다. 그리고 기능 개발을 할 때 참고할 만한 비슷한 프로젝트가 없었고, 관절 움직임 및 물리엔진 관련 라이브러리 없이 순수하게 제 논리로 기능을 구현하는 것은 쉽지 않았습니다. 그럼에도 불구하고, 함수의 재사용성을 고려하며 차근차근 로직을 구성하고 생소한 문제를 해결하는 과정은 뿌듯한 경험이었습니다.

저는 클라이밍을 정말 좋아합니다. 특히 완등 못 할 것 같은 루트를 성공했을 때 성취감은 제 삶의 원동력의 일부가 되기도 합니다.<br/>
이 게임을 통해 다른 사람들도 불가능해보이는 목표를 성취하는 즐거움을 느끼면 좋겠습니다.
