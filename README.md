# **Climick**

<div align=center>

### _" Climbing + Click "_

🧗 마우스로 손발을 클릭해서 클라이밍을 할 수 있는 게임입니다.

https://climick.netlify.app

</div>

<br>

# Table of Contents

- [Preview](#-preview)
- [Motivation](#-motivation)
- [Features](#-features)
- [Challenges](#-challenges)
  - [1. 관절 움직임 표현하기](#1-관절-움직임-표현하기)
    - [팔(다리)가 손(발) 움직임에 따라 접혀야 한다.]()
    - [신체 부위가 전체적으로 자연스럽게 움직여야 한다.]()
  - [2. library 없이 직접 물리 엔진 구현하기](#2-library-없이-직접-물리-엔진-구현하기)
    - [물체에 항상 작용하는 중력을 어떻게 표현할까?]()
    - [중력이 다른 힘의 합력보다 크게 작용하는 상황 경우의 수 나누기]()
  - [3. UX 개선하기]()
    - [손/발 이동 속도를 마우스 속도와 동기화시키기]()
    - [신체 부위 재정렬시키기]()
  - [4. 움직임을 부드럽게 구현하기]()
    - [`setInterval()` vs `requestAnimationFrame()`]()
- [Tech stack](#%EF%B8%8F-tech-stack)
- [Timeline](#-timeline)
- [Video](#-video)
- [Repository Link](#-Repository-Link)
- [Memoir](#-memoir)

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

# Features

\*홀드: 손발로 잡을 수 있는 벽에 붙어있는 돌 형태를 의미합니다.

- 하늘색 배경에 있는 모든 물체들은 잡거나 밟을 수 있는 홀드입니다.
- 사용자는 플레이어의 손/발/몸통을 드래그해서 움직일 수 있습니다.
- 플레이어의 손/발을 드래그해서 홀드 위에 놓으면 고정됩니다. 그렇지 않으면 손/발이 아래로 떨어집니다.
- 무게중심의 x좌표가 양 발 사이에 없으면 한쪽 팔이 펴질 때까지 무게중심이 중력을 받아서 아래로 내려갑니다.
- 손/발이 홀드에서 떨어지거나 무게중심이 양 발 사이에 없으면, 체력 소모가 큰 것으로 간주하여 HP가 빨리 줄어듭니다.
- 양손으로 TOP홀드를 잡으면 완등(성공)이며, 랭킹정보에 기록이 등록됩니다.
- 랭킹은 등반 시간이 짧은 순서대로 높아지며, 같은 시간일 경우 HP가 많이 남은 사람이 순위가 높아집니다.

<br>

# Challenges

## 1. 관절 움직임 표현하기

### 팔(다리)가 손(발) 움직임에 따라 접혀야 한다.

각 신체 부위를 하나의 `Graphics()` 객체로 생성했습니다.

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

<img width="720" alt="image" src="https://user-images.githubusercontent.com/50537876/234926144-d343c566-d7fe-4075-9279-4834806a6bb7.png">

손과 어깨의 좌표는 항상 알 수 있습니다. 따라서 위 그림에서 theta1과 theta2를 구할 수 있습니다.

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

![climb_one_arm_movement](https://user-images.githubusercontent.com/50537876/234890662-804eff9e-91fd-4595-992e-d616d4e817d2.gif)

### 신체 부위가 전체적으로 자연스럽게 움직여야 한다.

클라이밍 동작은 여러 신체부위의 움직임이 복합적으로 이루어진 결과물입니다.<br>
(ex. 손을 뻗어 멀리 있는 물체를 잡는다 = 손을 드래그해서 팔 관절이 이동한다 + 몸통이 손 방향으로 이동하면서 다른 관절도 움직인다​)

처음에는 손을 위로 뻗고, 몸통 올리고, 손 뻗는 과정을 통해서 무게중심을 올리게 했습니다.<br>
그런데 이 움직임은 부자연스러웠고, 사용자 입장에서 불편했습니다.

그래서 한 손을 뻗는 동작을 할 때, 다음과 같은 단계를 거쳐 움직임을 구현했습니다.

1. 먼저 팔 관절을 움직이는 함수 `moveJoint`를 실행합니다. <br>
   이 과정에서 손에서 어깨까지 거리가 제한된 팔 길이를 넘어선다면 `theta2`를 반환하고,

2. 몸통을 움직이는 함수 `moveBodyTo`를 실행합니다.<br>
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
3. `moveBodyTo`는 몸통의 위치를 바꾸고 함수 내부에서 `moveJointBody`함수를 실행해서 다른 팔다리 관절을 몸통의 위치에 따라 자연스럽게 움직이게 합니다.

<br>

## 2. library 없이 직접 물리 엔진 구현하기

> **library 없이 구현하게 된 동기** <br>
중력가속도에 의한 신체부위 등가속 원운동만 잘 표현하면 되기 때문에 3rd party library 없이 직접 구현할 수 있겠다는 생각이 들었습니다.

### 1) 물체에 항상 작용하는 중력을 어떻게 표현할까?
1. 모든 사물에 공통적으로 작용하는 중력 함수를 만든다. ❌
    - 장점
      - 신체 부위 외에 다른 객체에도 범용적으로 사용할 수 있다.
      - 유지보수가 용이하다.
    - 문제점
      - 신체 부위는 다른 부위와 연결되어있으므로, 단순히 아래방향으로 중력이 작용하는 것 이외에 장력과 같은 다른 힘도 작용한다.
      - 힘의 합력을 구해서 신체 움직임에 적용하는 로직을 구현하기에는 시간이 부족하다.
      <img src="https://github.com/pmjuu/climick-client/assets/50537876/e966878d-f274-4c08-bf18-e965f4551732" width="300px" height="230px">
2. `Pixi.JS`기반 플러그인 형태로 인체 중력 작용 함수를 만든다. ✅
    - 중력은 항상 작용하고 있는데,
    <u>특정 상황에서 중력이 다른 힘의 합력보다 크게 작용</u>해서 신체부위가 아래 방향으로 등가속원운동하거나 플레이어가 아래로 이동한다고 전제하고 로직을 구성했습니다.

### 2) 중력이 다른 힘의 합력보다 크게 작용하는 상황 경우의 수 나누기

1. **드래그앤드롭 후 손(발) 하나가 홀드에서 떨어진다면**<br>
   팔(다리)는 어깨(고관절)을 회전축으로 해서 중력 작용 방향으로 등가속 원운동을 합니다.

   - 손이 홀드에서 떨어졌다는 것을 어떻게 알 수 있을까?<br>
     - ~~홀드 각각의 입장에서 pointerdown 이벤트 발생 이후 `canvas` 에서 pointerup 이벤트가 발생하면 중력 작용 함수를 실행한다.~~<br>
       ⇒ 항상 홀드 위에 손발이 있기 때문에, 홀드는 pointerdown 이벤트를 감지할 수 없다.
     - 홀드 위치 기반으로 감지한다.<br>
       손/발에서 pointerup 이벤트가 발생할 때, 손/발이 정해진 홀드 좌표 내에 위치하지 않으면 중력 작용 함수를 실행한다. (팔/다리는 어깨/고관절 좌표를 회전축으로 등가속 원운동을 한다.)
   - 등가속 원운동을 어떻게 표현할까?
     - 전완 및 상완의 회전 각도를 일정한 가속도로 증가시킨다.

2. **양 손이 홀드에서 떨어진다면**<br>
   몸 전체가 아래 방향으로 등가속 운동을 합니다.

   - 플레이어가 포함된 `playerContainer`가 바닥에 닿을 때까지 일정한 가속도로 이동시킨다.

3. **무게중심의 x좌표가 양 발 사이에 없으면**<br>
   한쪽 팔이 펴질 때까지 무게중심이 중력을 받아서 아래로 내려갑니다.
   - 홀드 위치 안에 있는 왼손/오른손의 개수를 변수로 저장한다.
     - 각각 초기값은 1개이며, `onDragEnd` 함수를 실행할 때마다 손이 홀드 위치에 있는지 판별해서 변수값을 변경한다.
   - `onDragEnd` 함수 실행 시 손의 개수가 몇개인지 확인하고 0개라면 `fallDown` 함수를 실행해서 플레이어 컨테이너 자체를 아래 방향으로 등가속 운동시킨다.

<br>

## 3. UX 개선하기
### 손/발 이동 속도를 마우스 속도와 동기화시키기
* 기존 코드
  - 손/발 객체에 `pointermove` 이벤트를 등록해서 커서로 손/발을 드래그할 때 `onDragging()`함수를 실행한다.

* 문제점
  - 손/발 이동 속도가 마우스 드래그 속도를 못 따라가서 사용자 경험이 저하되었다.

* 원인
  - 마우스 커서의 xy좌표랑 손/발의 xy 좌표는 같을 수 없다.

* 해결 과정

* 해결 방법
  - `addEventListener("pointermove", onDragging)` 이벤트를 손/발/몸통 그래픽객체가 아니라 `document.querySelector(".wall")` 에 등록한다.
    ```javascript
    const wall = document.querySelector(".wall");
    wall.addEventListener("pointermove", onDragging);
    ```

* 결과
  - 사용자가 마우스를 빠르게 움직여서 커서위치가 손/발을 조금 벗어나도 손/발이 마우스쪽으로 이동한다.

<br>

## 4. 애니메이션 효과를 부드럽게 나타내기

이 게임에서는 중력에 의한 애니메이션 효과가 있습니다. (팔/다리가 아래로 떨어짐, 두 손을 놓았을 때 아래로 추락함) <br>
이를 부드럽게 나타내기 위해서 처음에는 `setInterval()`을 사용했으나 몇가지 차이점 때문에 `requestAnimationFrame()`으로 수정했습니다.

### `setInterval()` vs `requestAnimationFrame()`

#### 초당 호출 횟수
* `setInterval`은 인자를 넘겨 초당 호출 횟수를 지정할 수 있다.
* `rAF()`는 브라우저의 리소스 & 컴퓨터의 CPU 성능을 고려하여 초당 실행횟수가 결정된다.(기본 60FPS)

#### 실행 방식
* `setInterval`로 애니메이션을 만들 때는, func과 delay만 설정해주면 된다.
  ```javascript
  setInterval(func, delay);
  ```
* `rAF`의 경우, `rAF`의 callback내부에서 `rAF`를 재호출해줘야 애니메이션 실행이 가능하다.
  ```javascript
  requestAnimationFrame(render);

  function render() {
    ...
    requestAnimationFrame(render);  // 재호출
  }
  ```

#### 실행 중단 방식
* `setInterval`은 고유한 id값을 리턴하므로, `clearInterval`에 해당 id값을 넘겨주면 중단 가능하다.
* `rAF`도 고유한 id값을 리턴하는데, 이 id값을 `cancelAnimationFrame`에 넘겨주면 중단 가능하다.

#### 프레임의 부드러움
* `setInterval`으로 구현한 애니메이션은 약간의 프레임 끊김이 발생하거나 프레임 자체를 빠뜨리는 문제가 발생할 수 있다.
* `rAF`은 애니메이션을 위해 최적화된 함수이므로 애니메이션이 실행되는 환경에 관계 없이 적절한 프레임 속도로 실행되며, 탭이 활성화되지 않은 상태이거나 애니메이션이 페이지를 벗어난 경우에도 계속 실행되는 기존의 문제점을 해결할 수 있다.

#### 백그라운드 호출 여부
브라우저에서 여러 탭을 띄워놓고 있을 때 현재 웹페이지가 비활성화되어있으면
* `setInterval` 은 백그라운드에서 호출되는 순간마다 계속 실행되지만
* `rAF`은 화면에 repaint가 일어날 때 호출되므로 백그라운드에서 호출되지 않고 대기한다.

#### `requestAnimationFrame` 선택 이유
* 리렌더링이 끝나지 않았는데 애니메이션을 수행하는 명령이 내려진다면 원하는대로 애니메이션이 부드럽게 진행되지 않는다. 리페인트가 끝난 후 적용할 애니메이션을 `requestAnimationFrame`의 콜백으로 넣어주면 자연스러운 애니메이션이 생성된다.
* `setInterval`과 달리 프레임 생성 초기 단계에 맞춰 애니메이션이 호출되어서 더 부드러운 동작이 가능하다.

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

#### Why `Pixi.JS` ?

* WebGL 2D 렌더링에 관련된 기능들만 들어있기 때문에 굉장히 빠르고 가볍다.
* 객체 의존성 관리가 쉽다.
  * ‘무언가 렌더링하는 행위’만 context 방식으로 관리하고, 나머지는 객체를 자유롭게 활용할 수 있다. 따라서, 코드를 유지보수하기가 수월하다.
* 공식문서에 정리가 잘 되어있고 예제가 풍부하다.

<br>

# Timeline

### 프로젝트 기간: 2023.04.03(월) ~ 2023.04.28(금)

- 1 주차: 기획 및 설계
- 2~3 주차: 기능 개발
- 4 주차: 테스트코드 작성, 발표

<br>

# Video

썸네일을 클릭하면 게임 시연 유튜브 링크로 이동합니다.

🔽 첫번째 루트

[![Video Label](http://img.youtube.com/vi/w5qo4VSKXTo/0.jpg)](https://youtu.be/w5qo4VSKXTo)

<br/>

# Repository Link

[Server](https://github.com/pmjuu/climick-server)

<br/>

# Memoir

`Canvas API`로 게임을 만든 것은 이번이 처음이었습니다. 그리고 기능 개발을 할 때 참고할 만한 비슷한 프로젝트가 없었고, 관절 움직임 및 물리엔진 관련 라이브러리 없이 순수하게 제 논리로 기능을 구현하는 것은 쉽지 않았습니다. 그럼에도 불구하고, 함수의 재사용성을 고려하며 차근차근 로직을 구성하고 생소한 문제를 해결하는 과정은 뿌듯한 경험이었습니다.

저는 클라이밍을 정말 좋아합니다. 특히 완등 못 할 것 같은 루트를 성공했을 때 성취감은 제 삶의 원동력의 일부가 되기도 합니다.<br/>
이 게임을 통해 다른 사람들도 불가능해보이는 목표를 성취하는 즐거움을 느끼면 좋겠습니다.
