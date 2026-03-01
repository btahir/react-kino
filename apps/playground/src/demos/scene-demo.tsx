import { useState } from "react";
import { Scene } from "react-kino";
import { SliderControl } from "../controls/slider-control";
import { ToggleControl } from "../controls/toggle-control";

export function SceneDemo() {
  const [durationVh, setDurationVh] = useState(200);
  const [pin, setPin] = useState(true);

  const code = `<Scene duration="${durationVh}vh" pin={${pin}}>\n  {(progress) => (\n    <div>{(progress * 100).toFixed(1)}%</div>\n  )}\n</Scene>`;

  return {
    controls: (
      <>
        <SliderControl
          label="Duration (vh)"
          value={durationVh}
          min={100}
          max={500}
          step={50}
          onChange={setDurationVh}
        />
        <ToggleControl label="Pin" value={pin} onChange={setPin} />
      </>
    ),
    code,
    preview: (
      <div style={{ padding: "40px 0" }}>
        <Scene duration={`${durationVh}vh`} pin={pin}>
          {(progress) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: "#dc2626",
                }}
              >
                {(progress * 100).toFixed(1)}%
              </div>
              <div style={{ color: "#888", fontSize: 14 }}>
                Scroll to see progress update
              </div>
              <div
                style={{
                  width: 200,
                  height: 4,
                  background: "#2a2a2a",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress * 100}%`,
                    height: "100%",
                    background: "#dc2626",
                    transition: "width 50ms linear",
                  }}
                />
              </div>
            </div>
          )}
        </Scene>
      </div>
    ),
  };
}
