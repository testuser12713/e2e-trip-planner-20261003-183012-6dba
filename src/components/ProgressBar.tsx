export interface ProgressBarProps {
  value: number;
  label: string;
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value));
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const percent = clampPercent(value);

  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-valuetext={label}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress__label" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
