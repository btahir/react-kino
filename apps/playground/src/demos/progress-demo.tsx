import { useState } from "react";
import { Progress } from "react-kino";
import { SelectControl } from "../controls/select-control";
import { SliderControl } from "../controls/slider-control";

const TYPE_OPTIONS = [
  { label: "Bar", value: "bar" },
  { label: "Dots", value: "dots" },
  { label: "Ring", value: "ring" },
];

const POSITION_OPTIONS = [
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

export function ProgressDemo() {
  const [type, setType] = useState("bar");
  const [position, setPosition] = useState("top");
  const [color, setColor] = useState("#dc2626");
  const [progressValue, setProgressValue] = useState(0.5);

  const code = `<Progress\n  type="${type}"\n  position="${position}"\n  color="${color}"\n  progress={${progressValue}}\n/>`;

  return {
    controls: (
      <>
        <SelectControl
          label="Type"
          value={type}
          options={TYPE_OPTIONS}
          onChange={setType}
        />
        <SelectControl
          label="Position"
          value={position}
          options={POSITION_OPTIONS}
          onChange={setPosition}
        />
        <div className="control-row">
          <label>Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <SliderControl
          label="Progress"
          value={progressValue}
          min={0}
          max={1}
          step={0.01}
          onChange={setProgressValue}
        />
      </>
    ),
    code,
    preview: (
      <div
        style={{
          position: "relative",
          height: "100%",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Progress
          type={type as "bar" | "dots" | "ring"}
          position={position as "top" | "bottom" | "left" | "right"}
          color={color}
          progress={progressValue}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              fontFamily: "monospace",
              color,
            }}
          >
            {(progressValue * 100).toFixed(0)}%
          </div>
          <div style={{ color: "#888", fontSize: 14, marginTop: 8 }}>
            Drag the progress slider to control the indicator
          </div>
        </div>
      </div>
    ),
  };
}
