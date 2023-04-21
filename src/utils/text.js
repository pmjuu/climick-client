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
  "* 손/발/몸통 중 하나를 드래그하면 게임을 시작합니다",
  {
    fontFamily: "Arial",
    fontSize: 20,
    fill: "#fff",
  }
);
introText.position.set(10, 650);

export const instabilityWarning = new Text("!", {
  fontFamily: "Arial",
  fontSize: 30,
  fill: "red",
});
