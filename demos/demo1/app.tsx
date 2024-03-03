import React from "react";
import { createRoot } from "react-dom/client";
import type { Animation, UpdateFn } from "keyframes-core/src";
import { createPlayer } from "keyframes-core/src/simplePlayer";

const sampleAnimation: Animation<string, string | number> = {
  loopCount: -1,
  frameCount: 60,
  layers: [
    {
      ref: "color",
      keyframes: {
        0: "rgb(255,0,0)",
        10: "rgb(205,0,0)",
        20: "rgb(155,0,0)",
        30: "rgb(105,0,0)",
        40: "rgb(55,0,0)",
        50: "rgb(180,0,0)",
      },
    },
    {
      ref: "size",
      keyframes: {
        0: 1,
        5: 1.1,
        15: 1.2,
        25: 1.3,
        35: 1.4,
        45: 1.5,
        55: 1.25,
      },
    },
  ],
};

type State = {
  color: string;
  size: number;
};
const reducer = (state: State, action: [string, string | number]) => {
  return { ...state, [action[0]]: action[1] };
};

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    color: "red",
    size: 1,
  });
  const updateFn: UpdateFn<string, string | number> = React.useCallback(
    (ref, value) => {
      console.log("UPDATE FN CALLED");
      dispatch([ref, value]);
    },
    []
  );
  const [player] = React.useState(() =>
    createPlayer(updateFn, sampleAnimation)
  );
  return (
    <div>
      <h1>Demo 1</h1>
      <button type="button" onClick={() => player.play()}>
        Play
      </button>
      <button type="button" onClick={() => player.stop()}>
        Stop
      </button>
      <div
        style={{
          backgroundColor: state.color,
          width: 100 * state.size + "px",
          height: 100 * state.size + "px",
          position: "absolute",
        }}
      ></div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);

new EventSource("/esbuild").addEventListener("change", () => location.reload());
