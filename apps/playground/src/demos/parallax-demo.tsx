import { useState } from "react";
import { Parallax } from "react-kino";
import { SliderControl } from "../controls/slider-control";
import { ToggleControl } from "../controls/toggle-control";

export function ParallaxDemo() {
  const [speed, setSpeed] = useState(0.5);
  const [horizontal, setHorizontal] = useState(false);

  return {
    controls: (
      <>
        <SliderControl
          label="Speed"
          value={speed}
          min={0}
          max={2}
          step={0.1}
          onChange={setSpeed}
        />
        <ToggleControl
          label="Horizontal"
          value={horizontal}
          onChange={setHorizontal}
        />
      </>
    ),
    preview: (
      <div
        style={{
          height: "300vh",
          padding: "20vh 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Parallax
            speed={speed}
            direction={horizontal ? "horizontal" : "vertical"}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: 16,
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              speed: {speed}
            </div>
          </Parallax>
        </div>
      </div>
    ),
  };
}
