interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleControl({ label, value, onChange }: ToggleControlProps) {
  return (
    <div className="toggle-row">
      <label>{label}</label>
      <div className="toggle-switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-track" />
      </div>
    </div>
  );
}
