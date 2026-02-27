import { useState } from "react";
import { Scene, Counter } from "react-kino";
import { NumberControl } from "../controls/number-control";
import { SliderControl } from "../controls/slider-control";

export function CounterDemo() {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1000);
  const [at, setAt] = useState(0.1);
  const [span, setSpan] = useState(0.5);

  return {
    controls: (
      <>
        <NumberControl label="From" value={from} onChange={setFrom} />
        <NumberControl label="To" value={to} onChange={setTo} />
        <SliderControl
          label="Trigger at"
          value={at}
          min={0}
          max={1}
          step={0.05}
          onChange={setAt}
        />
        <SliderControl
          label="Span"
          value={span}
          min={0.05}
          max={1}
          step={0.05}
          onChange={setSpan}
        />
      </>
    ),
    preview: (
      <div style={{ padding: "40px 0" }}>
        <Scene duration="300vh">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Counter
              from={from}
              to={to}
              at={at}
              span={span}
              className="counter-value"
            />
            <style>{`.counter-value { font-size: 72px; font-weight: 700; font-family: monospace; color: #7c3aed; }`}</style>
            <div style={{ color: "#888", fontSize: 14 }}>
              {from} &rarr; {to} | at: {at} | span: {span}
            </div>
          </div>
        </Scene>
      </div>
    ),
  };
}
