import type { Animation } from "./types";
import { type UpdateFn, renderAnimationFrame } from "./animation";

type SimplePlayerOptions = {
  frameDuration?: number;
};

type FrameRenderedListener = { (): void };

export function createPlayer<R = any, T = any>(
  updateFn: UpdateFn<R, T>,
  options?: SimplePlayerOptions,
  ...animationStack: Animation<R, T>[]
) {
  const frameDuration = options?.frameDuration ?? 1000 / 60;
  const frameRenderedListeners: FrameRenderedListener[] = [];
  return {
    currentAnimation: animationStack?.[0],
    animationStack: animationStack?.slice(1) || ([] as Animation<R, T>[]),
    currentFrame: 0,
    currentLoop: 0,
    stopped: false,
    stop: function () {
      this.stopped = true;
    },
    setAnimation: function (...animationStack: Animation<R, T>[]) {
      this.animationStack = [...animationStack];
      this.currentAnimation = this.animationStack.shift();
      this.currentFrame = 0;
      this.currentLoop = 0;
    },
    tick: function () {
      if (this.currentFrame >= this.currentAnimation.frameCount) {
        if (
          this.currentLoop < this.currentAnimation.loopCount ||
          this.currentAnimation.loopCount < 0
        ) {
          this.currentLoop++;
          this.currentFrame = 0;
        } else {
          const hasMoreAnimation = this.animationStack?.length > 0;
          if (hasMoreAnimation) {
            this.currentAnimation = this.animationStack.shift();
            this.currentFrame = 0;
            this.currentLoop = 0;
          } else {
            this.stopped = true;
          }
        }
      }
      this.renderFrame();
    },
    play: function (
      newAnimation?: Animation<R, T>,
      ...animationStack: Animation<R, T>[]
    ) {
      if (newAnimation !== undefined) {
        this.setAnimation(newAnimation, ...animationStack);
      }
      this.stopped = false;
      const intervalId = setInterval(() => {
        if (this.stopped) {
          clearInterval(intervalId);
          return;
        }
        this.tick();
      }, frameDuration);
    },
    renderFrame: function (frame?: number) {
      if (frame != null) {
        this.currentFrame = frame;
      }
      renderAnimationFrame(updateFn, this.currentAnimation, this.currentFrame);
      frameRenderedListeners.forEach((fn) => fn?.());
      this.currentFrame++;
    },
    onFrameRendered: function (h: FrameRenderedListener) {
      frameRenderedListeners.push(h);
    },
  };
}

export type Player<R, T> = ReturnType<typeof createPlayer<R, T>>;
