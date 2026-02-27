interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
}: SliderControlProps) {
  return (
    <div className="control-row">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label>{label}</label>
        <span className="value-display">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
