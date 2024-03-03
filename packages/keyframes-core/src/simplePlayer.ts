import type { Animation } from "./types";
import { type UpdateFn, renderAnimationFrame } from "./animation";

type SimplePlayerOptions = {
  frameDuration?: number;
};

type FrameRenderedListener = { (): void };

type Player = {
  stop: { (): void };
  play: { (): void };
  onFrameRendered: { (handler: FrameRenderedListener): void };
};

export function createPlayer<R, T>(
  updateFn: UpdateFn<R, T>,
  animation: Animation<R, T>,
  options?: SimplePlayerOptions
): Player {
  const { loopCount = 0, frameCount } = animation;
  const frameDuration = options?.frameDuration ?? 1000 / 60;

  let currentFrame = 0;
  let currentLoop = 0;
  let stopped = false;

  const listeners: FrameRenderedListener[] = [];
  const onFrameRendered = (h) => {
    listeners.push(h);
  };
  const stop = () => {
    stopped = true;
  };

  const play = () => {
    stopped = false;
    const intervalId = setInterval(() => {
      if (stopped) {
        clearInterval(intervalId);
        return;
      }
      renderAnimationFrame(updateFn, animation, currentFrame);
      listeners.forEach((fn) => fn?.());
      currentFrame++;
      if (currentFrame >= frameCount) {
        if (currentLoop < loopCount || loopCount < 0) {
          currentLoop++;
          currentFrame = 0;
        } else {
          clearInterval(intervalId);
        }
      }
    }, frameDuration);
  };
  return { stop, play, onFrameRendered };
}
