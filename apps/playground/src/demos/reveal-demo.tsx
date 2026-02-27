import { useState } from "react";
import { Scene, Reveal } from "react-kino";
import { SelectControl } from "../controls/select-control";
import { SliderControl } from "../controls/slider-control";

const ANIMATION_OPTIONS = [
  { label: "Fade", value: "fade" },
  { label: "Fade Up", value: "fade-up" },
  { label: "Fade Down", value: "fade-down" },
  { label: "Scale", value: "scale" },
  { label: "Blur", value: "blur" },
];

export function RevealDemo() {
  const [animation, setAnimation] = useState("fade-up");
  const [duration, setDuration] = useState(600);
  const [at, setAt] = useState(0.3);
  const [key, setKey] = useState(0);

  const handleChange = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setKey((k) => k + 1);
  };

  return {
    controls: (
      <>
        <SelectControl
          label="Animation"
          value={animation}
          options={ANIMATION_OPTIONS}
          onChange={handleChange(setAnimation)}
        />
        <SliderControl
          label="Duration (ms)"
          value={duration}
          min={100}
          max={2000}
          step={100}
          onChange={handleChange(setDuration)}
        />
        <SliderControl
          label="Trigger at"
          value={at}
          min={0}
          max={1}
          step={0.05}
          onChange={handleChange(setAt)}
        />
      </>
    ),
    preview: (
      <div key={key} style={{ padding: "40px 0" }}>
        <Scene duration="300vh">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Reveal
              animation={animation as "fade" | "fade-up" | "fade-down" | "scale" | "blur"}
              duration={duration}
              at={at}
            >
              <div
                style={{
                  padding: "40px 60px",
                  background: "#1e1e1e",
                  borderRadius: 12,
                  border: "1px solid #2a2a2a",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
                  Revealed Content
                </div>
                <div style={{ color: "#888", fontSize: 14 }}>
                  animation: {animation} | at: {at}
                </div>
              </div>
            </Reveal>
          </div>
        </Scene>
      </div>
    ),
  };
}
