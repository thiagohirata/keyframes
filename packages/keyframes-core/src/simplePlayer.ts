import type { Animation } from "./types";
import { type UpdateFn, renderAnimationFrame } from "./animation";

type SimplePlayerOptions = {
  frameDuration?: number;
};

type FrameRenderedListener = { (): void };

export function createPlayer<R = any, T = any>(
  updateFn: UpdateFn<R, T>,
  animation: Animation<R, T>,
  options?: SimplePlayerOptions
) {
  const frameDuration = options?.frameDuration ?? 1000 / 60;
  const listeners: FrameRenderedListener[] = [];
  return {
    currentAnimation: animation,
    currentFrame: 0,
    currentLoop: 0,
    stopped: false,
    stop: function () {
      this.stopped = true;
    },
    setAnimation: function (newAnimation?: Animation<R, T>) {
      this.currentAnimation = newAnimation;
      this.currentFrame = 0;
      this.currentLoop = 0;
    },
    play: function (newAnimation?: Animation<R, T>) {
      if (newAnimation !== undefined) {
        this.setAnimation(newAnimation);
      }
      this.stopped = false;
      const intervalId = setInterval(() => {
        if (this.stopped) {
          clearInterval(intervalId);
          return;
        }
        if (this.currentFrame >= this.currentAnimation.frameCount) {
          if (
            this.currentLoop < this.currentAnimation.loopCount ||
            this.currentAnimation.loopCount < 0
          ) {
            this.currentLoop++;
            this.currentFrame = 0;
          } else {
            clearInterval(intervalId);
          }
        }

        renderAnimationFrame(
          updateFn,
          this.currentAnimation,
          this.currentFrame
        );
        listeners.forEach((fn) => fn?.());
        this.currentFrame++;
      }, frameDuration);
    },
    renderFrame: function (frame: number) {
      this.currentFrame = frame;
      renderAnimationFrame(updateFn, this.currentAnimation, this.currentFrame);
      listeners.forEach((fn) => fn?.());
      this.currentFrame++;
    },
    onFrameRendered: function (h) {
      listeners.push(h);
    },
  };
}

export type Player<R, T> = ReturnType<typeof createPlayer<R, T>>;
