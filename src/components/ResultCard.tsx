import React from "react";
import clsx from "clsx";

interface ResultCardProps {
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
  isCalculating?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  sublabel,
  color = "blue",
  isCalculating,
}) => {
  const bg =
    color === "blue"
      ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
      : "bg-white text-emerald-600 border border-slate-200/60";
  return (
    <div
      className={clsx(
        bg,
        "rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center justify-center min-w-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      )}
    >
      <div className="w-full flex items-center justify-center mb-2">
        <span
          className={clsx(
            "text-sm lg:text-base font-semibold opacity-90 tracking-wide uppercase",
            color === "blue" ? "text-white" : "text-slate-900"
          )}
        >
          {label}
        </span>
      </div>
      <div
        className={clsx(
          "text-4xl lg:text-5xl font-extrabold mb-2 transition-all duration-300 text-center tracking-tight",
          isCalculating ? "opacity-60 scale-95" : "opacity-100 scale-100"
        )}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value || "--:--"}
      </div>
      {sublabel && (
        <div
          className={clsx(
            "text-xs lg:text-sm mt-1 text-center leading-snug",
            color === "blue" ? "text-blue-100" : "text-slate-500"
          )}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
