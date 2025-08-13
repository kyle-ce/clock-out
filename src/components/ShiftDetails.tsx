import React from "react";
import { Clock, Utensils } from "lucide-react";
import clsx from "clsx";
import { ShiftInput } from "./ShiftInput";
import { parseDurationInput } from "../hooks/useTimeFormat";

interface ShiftDetailsProps {
  startTime: string;
  setStartTime: (val: string) => void;
  lunchDuration: number;
  setLunchDuration: (val: number) => void;
  workMinutesTotal: number;
  setWorkMinutesTotal: (val: number) => void;
}

export const ShiftDetails: React.FC<ShiftDetailsProps> = ({
  startTime,
  setStartTime,
  lunchDuration,
  setLunchDuration,
  workMinutesTotal,
  setWorkMinutesTotal,
}) => {
  const [workDurationInput, setWorkDurationInput] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Only update input if not focused and value changed from outside
  React.useEffect(() => {
    if (!isFocused) {
      const h = Math.floor(workMinutesTotal / 60);
      const m = workMinutesTotal % 60;
      setWorkDurationInput(`${h}:${m.toString().padStart(2, "0")}`);
    }
  }, [workMinutesTotal, isFocused]);

  function handleWorkDurationInputChange(val: string) {
    setWorkDurationInput(val);
    if (!val.trim()) {
      setInputError("Shift length is required");
      return;
    }
    const mins = parseDurationInput(val);
    if (mins === null || mins < 1 || mins > 16 * 60) {
      setInputError("Enter a valid duration (e.g. 8, 8:30, 830, 8.5)");
      return;
    }
    setInputError(null);
    setWorkMinutesTotal(mins);
  }

  function handleFocus() {
    setIsFocused(true);
  }
  function handleBlur() {
    setIsFocused(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-3 sm:p-4 lg:p-8 flex-1 flex flex-col transform transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-4 lg:mb-6 flex items-center gap-2">
        Shift Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label
            className={clsx(
              "text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"
            )}
          >
            <Clock className="w-5 h-5 text-blue-600 transition-transform duration-200 group-hover:rotate-12" />
            Clock-in Time
          </label>
          <input
            type="time"
            onChange={(e) => setStartTime(e.target.value)}
            value={startTime}
            className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium hover:border-slate-400 focus:scale-[1.02]"
          />
        </div>
        <div>
          <label
            className={clsx(
              "text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"
            )}
          >
            <Utensils className="w-5 h-5 text-emerald-600 transition-transform duration-200 group-hover:rotate-12" />
            Lunch Duration
          </label>
          <select
            value={lunchDuration}
            onChange={(e) => setLunchDuration(Number(e.target.value))}
            className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium bg-white hover:border-slate-400 focus:scale-[1.02] cursor-pointer appearance-none"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>
      </div>
      <div className="mt-3 lg:mt-6">
        <label className="block text-sm font-semibold text-slate-800 mb-1">
          Shift Length
        </label>
        <div className="text-xs text-slate-500 mb-2">
          Enter hours or hours:minutes (e.g. 8, 8:30, 830, 8.5)
        </div>
        <ShiftInput
          value={workDurationInput}
          onChange={handleWorkDurationInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          error={inputError}
        />
      </div>
    </div>
  );
};
