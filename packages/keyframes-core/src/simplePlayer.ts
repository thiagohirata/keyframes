import type { Animation } from "./types";
import { type UpdateFn, renderAnimationFrame } from "./animation";

type SimplePlayerOptions = {
  frameDuration?: number;
};

type FrameRenderedListener = { (): void };

type Player = {
  currentFrame: number;
  currentLoop: number;
  stopped: boolean;
  stop: { (): void };
  play: { (): void };
  renderFrame: { (frame: number): void };
  onFrameRendered: { (handler: FrameRenderedListener): void };
};

export function createPlayer<R, T>(
  updateFn: UpdateFn<R, T>,
  animation: Animation<R, T>,
  options?: SimplePlayerOptions
): Player {
  const { loopCount = 0, frameCount } = animation;
  const frameDuration = options?.frameDuration ?? 1000 / 60;

  const listeners: FrameRenderedListener[] = [];
  return {
    currentFrame: 0,
    currentLoop: 0,
    stopped: false,
    stop: function () {
      this.stopped = true;
    },
    play: function () {
      this.stopped = false;
      const intervalId = setInterval(() => {
        if (this.stopped) {
          clearInterval(intervalId);
          return;
        }
        if (this.currentFrame >= frameCount) {
          if (this.currentLoop < loopCount || loopCount < 0) {
            this.currentLoop++;
            this.currentFrame = 0;
          } else {
            clearInterval(intervalId);
          }
        }

        renderAnimationFrame(updateFn, animation, this.currentFrame);
        listeners.forEach((fn) => fn?.());
        this.currentFrame++;
      }, frameDuration);
    },
    renderFrame: function (frame: number) {
      this.currentFrame = frame;
      renderAnimationFrame(updateFn, animation, this.currentFrame);
      listeners.forEach((fn) => fn?.());
      this.currentFrame++;
    },
    onFrameRendered: function (h) {
      listeners.push(h);
    },
  };
}
