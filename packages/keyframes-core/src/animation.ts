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

type PreparedLayer<R, T> = Layer<R, T> & {
  keyframesIndexes: number[];
};

function _prepareLayer<R, T>(
  layer: Layer<R, T> | PreparedLayer<R, T>
): PreparedLayer<R, T> {
  if ("keyrframeIndexes" in layer) return layer as PreparedLayer<R, T>;
  const preparedLayer: PreparedLayer<R, T> = layer as PreparedLayer<R, T>;
  preparedLayer.keyframesIndexes = Object.keys(layer.keyframes).map(Number);
  return preparedLayer;
}

function renderLayer<R, T>(
  updateFn: UpdateFn<R, T>,
  layer: Layer<R, T> | PreparedLayer<R, T>,
  frame: number
) {
  const pLayer = _prepareLayer(layer);
  const nextKeyframeIdx = pLayer.keyframesIndexes.findIndex((v) => v > frame);

  if (nextKeyframeIdx > 0) {
    const nextKeyFrameFrame = pLayer.keyframesIndexes[nextKeyframeIdx];
    const nextKeyframe = pLayer.keyframes[nextKeyFrameFrame];
    const prevKeyFrameFrame = pLayer.keyframesIndexes[nextKeyframeIdx - 1];
    const prevKeyframe = pLayer.keyframes[prevKeyFrameFrame];

    const prevKeyframeValue =
      typeof prevKeyframe === "object" &&
      prevKeyframe &&
      "value" in prevKeyframe
        ? prevKeyframe.value
        : prevKeyframe;
    if (
      nextKeyframe &&
      prevKeyFrameFrame != frame &&
      ((typeof nextKeyframe === "number" &&
        pLayer.interpolation === "linear") ||
        (typeof nextKeyframe === "object" &&
          "interpolation" in nextKeyframe &&
          nextKeyframe.interpolation === "linear"))
    ) {
      const nextKeyframeValue =
        typeof nextKeyframe === "object" && "value" in nextKeyframe
          ? nextKeyframe.value
          : nextKeyframe;
      if (
        typeof prevKeyframeValue === "number" &&
        typeof nextKeyframeValue === "number"
      ) {
        const diff = nextKeyFrameFrame - prevKeyFrameFrame;
        const diffFrame = frame - prevKeyFrameFrame;
        const interpolatedValue =
          prevKeyframeValue +
          ((nextKeyframeValue - prevKeyframeValue) * diffFrame) / diff;
        updateFn(pLayer.ref, interpolatedValue as unknown as T);
      }
    } else {
      updateFn(pLayer.ref, prevKeyframeValue as unknown as T);
    }
  }
}
