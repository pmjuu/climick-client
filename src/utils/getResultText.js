import { Text } from "pixi.js";

const getResultText = string => {
  const resultText = new Text(string, {
    fontSize: 100,
    fill: "#fff",
    dropShadow: true,
    dropShadowBlur: 10,
  });
  resultText.alpha = 0.5;
  resultText.anchor.set(-0.15, 5);

  return resultText;
};

export default getResultText;
