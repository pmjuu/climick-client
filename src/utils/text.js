import { Text } from "pixi.js";

export const getResultText = string => {
  const resultText = new Text(string, {
    fontSize: 100,
    fill: "#fff",
    dropShadow: true,
    dropShadowBlur: 10,
  });
  resultText.alpha = 0.5;
  resultText.position.set(400, 230);

  return resultText;
};

export const introText = new Text(
  "Drag either a hand, foot, or torso\nto start the game",
  {
    fontFamily: "Arial",
    fontSize: 20,
    fill: "#fff",
    align: "center",
  }
);
introText.position.set(10, 650);

export const instabilityWarning = new Text("!", {
  fontFamily: "Arial",
  fontSize: 30,
  fill: "red",
});
