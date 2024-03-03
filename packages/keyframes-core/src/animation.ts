import type { Animation, Layer } from "./types";

export type UpdateFn<R, T> = (ref: R, newValue: T | Partial<T>) => void;

export function renderAnimationFrame<R, T>(
  updateFn: UpdateFn<R, T>,
  animation: Animation<R, T>,
  frame: number
) {
  for (const layer of animation.layers) {
    renderLayer(updateFn, layer, frame);
  }
}

export function renderLayer<R, T>(
  updateFn: UpdateFn<R, T>,
  layer: Layer<R, T>,
  frame: number
) {
  const keyframe = layer.keyframes?.[frame];
  if (keyframe) {
    updateFn(layer.ref, keyframe);
  }
}
