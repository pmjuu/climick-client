import {
  getAngleDegrees,
  getCos,
  getDistance,
  getRadians,
  getSin,
} from "../../src/utils/math";

describe("test math functions", () => {
  it("getRadians", () => {
    expect(getRadians(null)).toBe(0);
    expect(getRadians(0)).toBe(0);
    expect(getRadians(90)).toBe(Math.PI / 2);
    expect(getRadians(180)).toBe(Math.PI);
  });

  it("getAngleDegrees", () => {
    expect(getAngleDegrees(0, 0)).toBe(0);
    expect(getAngleDegrees(10, 0)).toBe(0);
    expect(getAngleDegrees(0, 10)).toBe(90);
    expect(getAngleDegrees(10, 10)).toBe(45);
  });

  it("getCos", () => {
    expect(getCos(0)).toBe(1);
    expect(getCos(60).toFixed(1)).toBe("0.5");
    expect(getCos(90).toFixed(0)).toBe("0");
  });

  it("getSin", () => {
    expect(getSin(0)).toBe(0);
    expect(getSin(30).toFixed(1)).toBe("0.5");
    expect(getSin(90)).toBe(1);
  });

  it("getDistance", () => {
    expect(getDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
    expect(getDistance({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(10);
    expect(getDistance({ x: 0, y: 0 }, { x: 30, y: 40 })).toBe(50);
  });
});
