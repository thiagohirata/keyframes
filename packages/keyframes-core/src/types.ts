export type Interpolation = "none" | "linear";

export type KeyFrame<T> = {
  value: T;
  interpolation?: Interpolation;
};

export type Layer<R, T> = {
  ref: R;
  label?: string;
  interpolation?: Interpolation;
  keyframes: Record<number, KeyFrame<T> | T | Partial<T>>;
};

export type Animation<R, T> = {
  layers: Layer<R, T>[];
  frameCount: number;
  loopCount?: number;
};
