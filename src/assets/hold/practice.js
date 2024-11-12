const cloud = { x: 365, y: 360 };
const apple = { x: 550, y: 470 };
const tree = { x: 550, y: 680, leafHeight: 20 };
const diagonal = { x: 520, y: 330, width: 40, height: 20 };

const practiceHolds = {
  floor: { x: -9, y: 760, width: 999, height: 20, type: "rect", color: "#999" },
  start: { x: 420, y: 560, width: 70, height: 20, type: "rect", color: "blue" },
  top: {
    x: 490,
    y: 100,
    radius: 30,
    type: "circle",
    color: "gold",
    text: "top",
  },
  a0: {
    x: tree.x,
    y: tree.y,
    width: 20,
    height: 80,
    type: "rect",
    color: "#744700",
  },
  a1: {
    x: tree.x - 40,
    y: tree.y,
    width: 100,
    height: tree.leafHeight,
    type: "rect",
    color: "green",
  },
  a2: {
    x: tree.x - 30,
    y: tree.y - tree.leafHeight * 1,
    width: 80,
    height: tree.leafHeight,
    type: "rect",
    color: "green",
  },
  a3: {
    x: tree.x - 20,
    y: tree.y - tree.leafHeight * 2,
    width: 60,
    height: tree.leafHeight,
    type: "rect",
    color: "green",
  },
  a4: {
    x: tree.x - 10,
    y: tree.y - tree.leafHeight * 3,
    width: 40,
    height: tree.leafHeight,
    type: "rect",
    color: "green",
  },
  a5: {
    x: tree.x,
    y: tree.y - tree.leafHeight * 4,
    width: 20,
    height: tree.leafHeight,
    type: "rect",
    color: "green",
  },
  b1: { x: 350, y: 670, width: 50, height: 20, type: "rect", color: "navy" },
  p1: {
    x: diagonal.x,
    y: diagonal.y,
    width: diagonal.width,
    height: diagonal.height,
    type: "rect",
    color: "purple",
  },
  p2: {
    x: diagonal.x - 50,
    y: diagonal.y - 60,
    width: diagonal.width,
    height: diagonal.height,
    type: "rect",
    color: "purple",
  },
  p3: {
    x: diagonal.x - 100,
    y: diagonal.y - 120,
    width: diagonal.width,
    height: diagonal.height,
    type: "rect",
    color: "purple",
  },
  c0: { x: 550, y: 200, radius: 20, type: "star", color: "goldenrod" },
  c1: { x: apple.x, y: apple.y, radius: 23, type: "circle", color: "darkred" },
  c2: {
    x: apple.x + 15,
    y: apple.y - 22,
    width: 15,
    height: 5,
    type: "ellipse",
    color: "#8fce00",
  },
  c3: {
    x: apple.x,
    y: apple.y - 33,
    width: 5,
    height: 15,
    type: "rect",
    color: "#744700",
  },
  d1: {
    x: cloud.x + 15,
    y: cloud.y + 45,
    width: 15,
    height: 70,
    type: "rect",
    color: "#6495ed",
  },
  d2: {
    x: cloud.x + 50,
    y: cloud.y + 85,
    width: 15,
    height: 70,
    type: "rect",
    color: "#6495ed",
  },
  f0: { x: cloud.x, y: cloud.y, radius: 20, type: "circle", color: "#fff" },
  f1: {
    x: cloud.x + 30,
    y: cloud.y - 5,
    radius: 25,
    type: "circle",
    color: "#fff",
  },
  f2: {
    x: cloud.x + 55,
    y: cloud.y,
    radius: 20,
    type: "circle",
    color: "#fff",
  },
  f3: {
    x: cloud.x + 80,
    y: cloud.y + 2,
    radius: 15,
    type: "circle",
    color: "#fff",
  },
};

export default practiceHolds;