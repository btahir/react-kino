import { useState } from "react";
import { CompareSlider } from "react-kino";
import { SliderControl } from "../controls/slider-control";
import { ToggleControl } from "../controls/toggle-control";

export function CompareSliderDemo() {
  const [initialPosition, setInitialPosition] = useState(0.5);
  const [scrollDriven, setScrollDriven] = useState(false);

  const before = (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1e1e1e, #3b82f6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      Before
    </div>
  );

  const after = (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      After
    </div>
  );

  return {
    controls: (
      <>
        <SliderControl
          label="Initial position"
          value={initialPosition}
          min={0}
          max={1}
          step={0.05}
          onChange={setInitialPosition}
        />
        <ToggleControl
          label="Scroll driven"
          value={scrollDriven}
          onChange={setScrollDriven}
        />
      </>
    ),
    preview: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: "80vh",
          padding: 40,
        }}
      >
        <CompareSlider
          key={`${initialPosition}-${scrollDriven}`}
          before={before}
          after={after}
          initialPosition={initialPosition}
          scrollDriven={scrollDriven}
          className="compare-slider-demo"
        />
        <style>{`.compare-slider-demo { width: 100%; max-width: 600px; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; }`}</style>
      </div>
    ),
  };
}
