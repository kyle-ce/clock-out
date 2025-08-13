import React from "react";
import clsx from "clsx";
import { parseDurationInput } from "../hooks/useTimeFormat";

interface ShiftInputProps {
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  onFocus?: () => void;
  error?: string | null;
}

export const ShiftInput: React.FC<ShiftInputProps> = (props) => {
  const { value, onChange, onBlur, onFocus, error } = props;
  const mins = parseDurationInput(value);
  const showParsed =
    value.trim() && mins !== null && mins >= 1 && mins <= 16 * 60 && !error;
  const h = mins ? Math.floor(mins / 60) : 0;
  const m = mins ? mins % 60 : 0;
  return (
    <div className="flex flex-col gap-1">
      <input
        type="text"
        pattern="[0-9:.,]*"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        className={clsx(
          "w-full px-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-mono placeholder-slate-400",
          error ? "border-red-400 focus:ring-red-500" : ""
        )}
        style={{ fontSize: "1rem" }}
        placeholder="e.g. 8, 8:30, 830, 8.5"
        aria-label="Shift duration in hours and minutes"
      />
      <div style={{ minHeight: "1.5em" }}>
        {showParsed && (
          <div className="text-lg font-mono text-blue-700 mt-2 transition-all duration-300 opacity-100 translate-y-0">
            {h > 0 ? `${h}h` : ""}
            {m > 0 ? ` ${m}m` : h === 0 ? `0m` : ""}
          </div>
        )}
      </div>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};
