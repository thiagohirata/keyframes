export type Layer<R, T> = {
  ref: R;
  label?: string;
  keyframes: Record<number, T | Partial<T>>;
};

export type Animation<R, T> = {
  layers: Layer<R, T>[];
  frameCount: number;
  loopCount?: number;
};
