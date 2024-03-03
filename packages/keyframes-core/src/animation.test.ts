import { renderAnimationFrame } from "./animation";
import { Animation } from "./types";

test("keyframe 0 or null", () => {
  let currentValue = -1;
  const animation: Animation<string, string | number | null> = {
    frameCount: 12,
    layers: [
      {
        ref: "mouthSprite",
        keyframes: {
          0: 0,
          2: 1,
          3: 2,
          4: null,
          11: 0,
          12: 0,
        },
      },
    ],
  };
  const updateFn = (ignore, v) => {
    currentValue = v;
  };
  renderAnimationFrame(updateFn, animation, 0);
  expect(currentValue).toBe(0);
  renderAnimationFrame(updateFn, animation, 2);
  expect(currentValue).toBe(1);
  renderAnimationFrame(updateFn, animation, 3);
  expect(currentValue).toBe(2);
  renderAnimationFrame(updateFn, animation, 4);
  expect(currentValue).toBe(null);
  renderAnimationFrame(updateFn, animation, 5);
  expect(currentValue).toBe(null);
  renderAnimationFrame(updateFn, animation, 10);
  expect(currentValue).toBe(null);
  renderAnimationFrame(updateFn, animation, 11);
  expect(currentValue).toBe(0);
});
