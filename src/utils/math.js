export const getRadians = degrees => (degrees / 180) * Math.PI;
export const getAngleDegrees = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
export const getCos = degrees => Math.cos(getRadians(degrees));
export const getSin = degrees => Math.sin(getRadians(degrees));

// getDistance: 두 물체의 x,y 좌표 사이 거리를 구함.
export const getDistance = (matter1, matter2) => {
  const result = Math.sqrt(
    (matter1.x - matter2.x) ** 2 + (matter1.y - matter2.y) ** 2
  );

  if (result === undefined) {
    console.error("distance error...", matter1, matter2);
  }

  return result;
};
