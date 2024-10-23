🇰🇷 [Korean README](./README-Korean.md)

# **Climick**

<div align=center>

### _" Climbing + Click "_

🧗 A game where you can click on the player's hands and feet to climb

[Live Site](https://climick.netlify.app)

</div>

<br>

# Table of Contents

- [Preview](#preview)
- [Motivation](#motivation)
- [Challenges](#challenges)
  - [1. Expressing Joint Movements](#1-expressing-joint-movements)
    - [How can the arms (legs) bend according to the movement of the hands (feet)?](#how-can-the-arms-legs-bend-according-to-the-movement-of-the-hands-feet)
    - [When extending the hands, can other body parts move naturally accordingly?](#when-extending-the-hands-can-other-body-parts-move-naturally-accordingly)
  - [2. Implementing a Physics Engine Without External Libraries](#2-implementing-a-physics-engine-without-external-libraries)
    - [How to represent gravity that constantly acts on objects?](#how-to-represent-gravity-that-constantly-acts-on-objects)
    - [Dividing the cases where gravity acts more strongly than the sum of other forces](#dividing-the-cases-where-gravity-acts-more-strongly-than-the-sum-of-other-forces)
  - [3. Improving UX](#3-improving-ux)
    - [How to show a smooth drag effect when the mouse movement speed is fast?](#how-to-show-a-smooth-drag-effect-when-the-mouse-movement-speed-is-fast)
    - [After one limb is extended, can the extended part be bent by moving the other hand/foot?](#after-one-limb-is-extended-can-the-extended-part-be-bent-by-moving-the-other-handfoot)
  - [4. Smoothly Displaying Animation Effects](#4-smoothly-displaying-animation-effects)
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

_Climbing, Mathematics, Physics_ - I gathered **elements I love** to conceptualize this idea.

Rather than just knowing how to use a specific library, I wanted to show the process of logically developing ideas based on math and physics formulas that everyone has learned. I wanted to challenge the **unfamiliar problem of expressing human joint movements and implementing a physics engine.**

I thought it would be nice to have a service where you can **practice climbing movements even if you don't go to a climbing gym**.<br/>
So I planned this game not just for fun, but to have something to learn from.

1. Developing the habit of thinking about lower body movements
   - When actually raising the center of gravity, 
      it's more efficient in terms of stamina to first raise the feet and raise the center of gravity with lower body strength, not just pulling up with the arms.
2. Practicing route finding
   - Route finding: Judging which moves and sequence to grab holds by looking at the holds.

<br>

# Challenges

## 1. Expressing Joint Movements

### How can the arms (legs) bend according to the movement of the hands (feet)?

Each body part was created as a `new Graphics()` object.

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
<sub>* Upper Arm: Refers to the part of the arm from the shoulder to the elbow.</sub>
<sub>* Forearm: Refers to the part of the arm from the elbow to the wrist.</sub>

The forearms and upper arms of the arms (legs) are represented as `Line` objects that can be drawn with a start point and x,y changes (`upperArmDxy`).
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

`drawLimb.js` [full code](https://github.com/pmjuu/climick-client/blob/fa8a889aa2af6bd1adef90b82cf5acc76fd1103f/src/utils/drawLimb.js)

#### Process of Calculating Angles and Body Part Coordinates

<img width="720" alt="image" src="https://github.com/pmjuu/climick-client/assets/50537876/ff9c319f-c2fe-4525-9a62-d1e357e7c955">

The coordinates of the hand and shoulder are always known. Therefore, in the above figure, `theta1` and `theta2` can be calculated.

```javascript
// src/utils/moveJoint.js

const handToShoulder = getDistance(shoulder, cursorInContainer);
const h = Math.sqrt(limbLength ** 2 - (handToShoulder / 2) ** 2) || 0; // Height of the isosceles triangle HES
const theta1 = getAngleDegrees(handToShoulder / 2, h);
const theta2 = getAngleDegrees(
  flagX * (shoulder.x - cursorInContainer.x),
  shoulder.y - cursorInContainer.y
);
```

The lengths of the forearm and upper arm are set to be equal,<br>
and by calculating the angle (`theta1` - `theta2`) that the upper arm makes with the ground, the elbow (`elbow`) coordinates can be calculated.

```javascript
const elbow = {
  x: shoulder.x - flagX - limbLength * getCos(theta1 - theta2) * flagX,
  y: shoulder.y + limbLength * getSin(theta1 - theta2),
};
```

Based on the elbow (`elbow`) coordinates, the upper arm (`upperArm`) and forearm (`foreArm`) are drawn.

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

🔽 The arms bend naturally according to the hand’s position

<img src="https://user-images.githubusercontent.com/50537876/234890662-804eff9e-91fd-4595-992e-d616d4e817d2.gif" width=150>

### When extending the hands, can other body parts move naturally accordingly?

Climbing movements are the result of complex movements of several body parts.<br>
(ex. Reaching out to grab a distant object by dragging the hand, moving the torso in the direction of the hand while moving other joints)

Initially, I raised the center of gravity by extending the hands upwards, raising the torso, and extending the hands.<br>
However, this movement was unnatural and uncomfortable from the user’s perspective.

Therefore, when extending one hand, I implemented the movement through the following steps.

1. First, execute the function `moveJoint()` that moves the arm joints.<br>
   In this process, if the distance from the hand to the shoulder exceeds the arm length, `theta2` is returned,

2. Then execute the function `moveBodyTo()` that moves the torso.<br>
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
3. `moveBodyTo()` changes the position of the torso and within the function executes `moveJointBody()` to move other limbs naturally according to the torso’s position.

<br>

## 2. Implementing a Physics Engine Without External Libraries

>  **Motivation for implementing without external libraries** <br>
I thought I could implement it directly without a 3rd party library because as long as I can represent the body’s parts’ accelerated circular motion under gravity acceleration, it would suffice.

### How to represent gravity that constantly acts on objects?
1. Create a gravity function that acts on all objects. ❌
    - Advantages
      - Can be used universally for objects other than body parts.
      - Easy to maintain.
    - Problems
      - Body parts are connected to other parts, so in addition to simple downward gravity, other forces like tension act.
      - Implementing logic to calculate the sum of forces and apply it to body movement was time-consuming.<br>
        <img src="https://github.com/pmjuu/climick-client/assets/50537876/e966878d-f274-4c08-bf18-e965f4551732" width="300px" height="230px">
2. Create a human body gravity function in the form of a `Pixi.JS`-based plugin. ✅
    - Gravity always acts, but assuming that <u>in certain situations, gravity acts more strongly than the sum of other forces</u>, causing body parts to undergo downward accelerated circular motion or the player to move downward, I structured the logic accordingly.

### Dividing the Cases Where Gravity Acts More Strongly Than the Sum of Other Forces

#### 1. After drag and drop, if one hand (foot) falls off the hold
  The arm (leg) undergoes accelerated circular motion in the direction of gravity with the shoulder (hip) as the rotation axis.

  - How to know if a hand has fallen off a hold? <br>
    - ~~After `pointerdown` event is triggered on each hold, if a pointerup event occurs on the `canvas`, execute the gravity function.~~<br>
      ⇒ Since the hands and feet are always on holds, holds cannot detect `pointerdown` events. 
    - Detect based on hold positions.<br>
      When a `pointerup` event occurs on the hands/feet, if the hand/foot is not within the defined hold coordinates, execute the gravity function. (Arms/legs undergo accelerated circular motion with the shoulder/hip as the rotation axis.) 
      * At this time, it is considered that HP (health points) are consumed significantly, so HP decreases rapidly.

  - How to represent accelerated circular motion? 
      - Execute the `gravityRotate()` function to increase the rotation angular velocity (`angleVelocity`) of the upper arm and forearm at a constant acceleration. 
      - Since gravity always acts downward, until the angle between the line perpendicular to the ground and the arm is achieved,
  increase the upper arm’s angle (`upperArm.angle`) and forearm’s angle (`foreArm.angle`).

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
        return drawLimb( ... ); // After rotation ends, draw new limbs with angles reset to 0.
      }

      requestAnimationFrame(rotateArm);
    }

    rotateArm();
    ```

#### 2. If both hands fall off the holds

The whole body undergoes accelerated downward motion.

  -	Save the number of hands/feet within the hold coordinate range in a variable.
    -	Each is initially 1, and every time `onDragEnd()` is executed, check whether the hands/feet are in hold positions and update the variable accordingly.
  -	When executing the `onDragStart()` function, check how many hands there are, and if it’s 0, execute `fallDown()` function.
  -	Executing `fallDown()` will cause the player to move downward with the descent speed (`descentVelocity`) increasing at a constant acceleration until the `playerContainer` touches the ground.
  
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

#### 3. If the center of gravity’s x-coordinate is not between both feet

The center of gravity is pulled down by gravity until one arm is extended.

  *	When the drag ends and `onDragEnd()` function is executed, execute `checkGravityCenter()` function to check if the center of gravity’s x-coordinate is between both feet.
  * If the center of gravity’s x-coordinate is not between both feet, execute `descendByGravity()` function to move the torso downward.
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
  * At this time, it is considered that the player’s HP is consumed significantly, so HP decreases rapidly.

<br>

## 3. Improving UX

### How to show a smooth drag effect when the mouse movement speed is fast?
<sub>* `hand`: Refers to hand/foot.</sub>

#### Previous Code

-	Register the `pointermove` event on the `hand` object to execute the `onDragging()` function when dragging the hand with the cursor.
-	In the `onDragging()` function, execute the `moveJoint()` function, and in the `moveJoint()` function, update the `hand`‘s x,y coordinates to the cursor’s x,y coordinates to move the `hand`.

#### Problems
- The hand movement speed couldn’t keep up with the mouse drag speed, causing intermittent actions during drag and degrading the user experience.

#### Cause
- When the cursor movement speed is fast, the `hand`‘s x,y coordinates were not updated in real-time to follow the cursor, 
  resulting in frequent instances where the cursor’s position exceeds the `hand`’s position.

#### Solution
-	Register the `addEventListener("pointermove", onDragging)` event not on the `hand` object but on the background wall represented by `document.querySelector(".wall")`.
    ```js
    const wall = document.querySelector(".wall");
    wall.addEventListener("pointermove", onDragging);
    ```
-	Even if the cursor position exceeds the `hand`’s coordinate range (i.e., the distance from the shoulder to the cursor becomes greater than the arm length (`limbLength * 2`)), update the `hand`’s coordinates to ensure that the `shoulder→hand vector` is in the same direction as the `shoulder→cursor vector` but with a fixed length equal to the arm length.

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

#### Result
- Even if the user moves the cursor quickly so that the cursor position slightly exceeds the hand, the hand moves towards the cursor.
- Even if the hand is dragged beyond the arm length, the hand remains attached to the arm but moves in the direction of the cursor.

<br>

### After one limb is extended, can the extended part be bent by moving the other hand/foot?

#### Problems
- After one arm/leg is extended (by dragging or dropping due to gravity making the arm/leg fall downward), when dragging the other hand/foot, the previously extended limb did not bend.
- Bending the extended limb by directly dragging the extended hand/foot was possible, but it was inconvenient from the user’s perspective.

  <img src="https://github.com/pmjuu/climick-client/assets/50537876/cec50377-8633-4ffe-bbef-65788f4a1121" width=250>

#### Cause
- When one arm/leg is extended, dragging the other hand/foot did not execute the torso movement function.
- To prevent limbs from detaching from the body, the torso movement function was designed to not work if one limb is extended.

#### Solution
- Create a function `rearrangeBody()` that rearranges body parts.
- Call this function rearrangeBody() either when a `pointerup` event occurs or after a limb is extended straight down by gravity.
- In `rearrangeBody()`, assign the direction in which the hands/feet are positioned based on the shoulder/hip to a `flag` variable, and execute `moveBodyTo()` to rearrange the body parts.

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

#### Result
- After a limb is extended and the pointerup event occurs, execute the rearrangeBody function to slightly bend the extended part, allowing the next drag action to occur.

  <img src="https://github.com/pmjuu/climick-client/assets/50537876/36cbe67d-3bb8-4796-8230-1935c7ad185c" width=250>

<br>

## 4. Smoothly Displaying Animation Effects

This game includes animation effects caused by gravity (arms/legs falling downward, falling when releasing both hands).<br>
To display these smoothly, I initially used `setInterval()`, but due to some differences, I switched to `requestAnimationFrame()`.

### `setInterval()` vs `requestAnimationFrame()`

#### Number of Calls per Second
* `setInterval()` can set the number of calls per second by passing an argument.
* `rAF()` determines the number of executions per second based on the browser’s resources and the computer’s CPU performance (default 60 FPS).

#### Execution Method
* When creating animations with `setInterval()`, just set the func and delay.
  ```js
  setInterval(func, delay);
  ```
* For `rAF()`, to run the animation, the callback of `rAF()` needs to call `rAF()` again inside.
  ```js
  requestAnimationFrame(render);

  function render() {
    ...
    requestAnimationFrame(render);
  }
  ```

#### How to Stop Execution
* `setInterval()` returns a unique id value, so passing that id value to `clearInterval()` stops it.
* `rAF()` also returns a unique id value, so passing that id value to `cancelAnimationFrame()` stops it.

#### Smoothness of Frames
* Animations implemented with `setInterval()` may have slight frame skipping or missing frames.
* `rAF()` is optimized for animations, so it runs at an appropriate frame rate regardless of the animation environment, and solves the problem of `setInterval()` running even when the tab is not active or the animation is outside the page.

#### Whether Called in Background
When multiple tabs are open and the current web page is inactive,
* `setInterval()` continues to execute every time it is called in the background,
* `rAF()` is called only when the screen repaints, so it does not execute in the background and waits.

#### Why I Chose `requestAnimationFrame()`
* If you give animation commands before repainting finishes, the animation does not proceed smoothly as desired.<br>
If you put the animation to apply after the repaint is finished by putting it in the callback of `requestAnimationFrame()`, natural animations are created.
* Unlike `setInterval()`, animations are called in sync with the frame creation’s initial stage, allowing for smoother operations.

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

### Why I Chose `Pixi.JS`

* **Performance**
  - It only includes features related to WebGL 2D rendering, making it extremely fast and lightweight.
* **Cross-platform Compatibility**
  - Designed to operate smoothly across various platforms and devices.
* **Ease of Use**
  - Provides an intuitive and simple API.
  - The official documentation is well-organized and rich in examples.

### Why I Chose NoSQL `MongoDB`

* **Schema Flexibility**
  - Offers more flexible schemas compared to SQL, capable of handling various data types and structures.
  - Without a fixed structure, it can be flexibly adapted when data structures are frequently added, deleted, or modified.
* **Intuitive Data Model**
  - Stores data in documents instead of rows, which are based on `JSON`. Therefore, it's easy to understand the hierarchical structure of data without complex join operations between multiple tables.
* **Scale-out Structure**
  - Allows for horizontal scaling by distributing the database across multiple servers, thereby increasing capacity.

<br>

# Feature

\*Hold: Refers to stone-shaped holds attached to the wall that can be grabbed or stepped on by hands and feet.

- All objects on the light blue background are holds that can be grabbed or stepped on.
- Users can drag and move the player’s hands/feet/torso.
- If the player’s hands/feet are dragged and placed on a hold, they are fixed. Otherwise, the hands/feet fall downward.
- If the center of gravity’s x-coordinate is not between both feet, the center of gravity is pulled down by gravity until one arm is extended.
- If the hands/feet fall off the holds or the center of gravity is not between both feet, it is considered that HP (health points) are consumed significantly, so HP decreases rapidly.
- If both hands grab the TOP hold, it is a complete climb (success) and the record is registered in the ranking information.
- Rankings are sorted in ascending order of climbing time. If the times are the same, the person with more remaining HP has a higher rank.

<br>

# Timeline

### Project Timeline: 2023.04.03(Mon) ~ 2023.04.28(Fri)

- Week 1: Planning and Design
- Weeks 2-3: Feature Development
- Week 4: Writing Test Code, Presentation

<br>

# Video

Clicking the thumbnail takes you to a YouTube link of the game demonstration video.

🔽 First Climbing Route

[![Video Label](http://img.youtube.com/vi/w5qo4VSKXTo/0.jpg)](https://youtu.be/w5qo4VSKXTo)

# Repository Link

[Server](https://github.com/pmjuu/climick-server)

<br>

# Memoir

This was my first time making a game with the `Canvas API`. Also, there were no similar projects to reference during feature development, and implementing functions purely based on my logic without libraries for joint movements and the physics engine was not easy. Nevertheless, considering the reusability of functions and step-by-step logic construction, solving unfamiliar problems was a rewarding experience.

I really love climbing. Especially, the sense of accomplishment when succeeding in a route that seemed impossible becomes a part of the driving force of my life.<br>
I hope that through this game, others can also experience the joy of achieving goals that seem impossible.
