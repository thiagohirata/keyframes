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
  const keyframe = pLayer.keyframes?.[frame];
  if (keyframe) {
    updateFn(
      pLayer.ref,
      typeof keyframe === "object" && "value" in keyframe
        ? keyframe.value
        : keyframe
    );
  } else {
    //interpolate
    const nextKeyframeIdx = pLayer.keyframesIndexes.findIndex((v) => v > frame);

    if (nextKeyframeIdx > 0) {
      const nextKeyFrameFrame = pLayer.keyframesIndexes[nextKeyframeIdx];
      const nextKeyframe = pLayer.keyframes[nextKeyFrameFrame];
      if (
        (typeof nextKeyframe === "number" &&
          pLayer.interpolation === "linear") ||
        (typeof nextKeyframe === "object" &&
          nextKeyframe &&
          "interpolation" in nextKeyframe &&
          nextKeyframe.interpolation === "linear")
      ) {
        const prevKeyFrameFrame = pLayer.keyframesIndexes[nextKeyframeIdx - 1];
        const prevKeyframe = pLayer.keyframes[prevKeyFrameFrame];

        if (prevKeyframe && nextKeyframe) {
          const prevKeyframeValue =
            typeof prevKeyframe === "object" && "value" in prevKeyframe
              ? prevKeyframe.value
              : prevKeyframe;
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
        }
      }
    }
  }
}
