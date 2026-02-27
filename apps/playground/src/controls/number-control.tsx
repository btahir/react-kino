interface NumberControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function NumberControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: NumberControlProps) {
  return (
    <div className="control-row">
      <label>{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
