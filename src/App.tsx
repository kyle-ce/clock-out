import React, { useEffect } from "react";
import clsx from "clsx";
import { useShiftCalculator } from "./hooks/useShiftCalculator";
import { formatTime } from "./hooks/useTimeFormat";
import { ShiftDetails } from "./components/ShiftDetails";
import { ResultCard } from "./components/ResultCard";

export default function ClockoutApp() {
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);
  // Use custom hook for main shift state
  const {
    startTime,
    setStartTime,
    workMinutesTotal,
    setWorkMinutesTotal,
    lunchDuration,
    setLunchDuration,
    endTime,
    lunchTime,
    isCalculating,
  } = useShiftCalculator({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div
          className={clsx(
            "text-center mb-4 lg:mb-12 transition-all duration-1000 ease",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          )}
        >
          <h1 className="text-2xl lg:text-5xl font-bold text-slate-900 mb-2 lg:mb-4">
            Clock Out Calculator
          </h1>
          <p className="text-base lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Calculate your exact clock-out time based on your shift schedule
          </p>
        </div>

        {/* Results Section - show above form on mobile */}
        <div className="flex flex-row gap-2 mb-3 md:hidden">
          {/* Clock Out Time - Primary Result */}
          <div
            className={clsx(
              "bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow p-2 text-white flex-1 flex flex-col items-center justify-center min-w-0 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            )}
          >
            <div className="w-full flex items-center justify-between mb-1">
              <span className="text-xs font-semibold opacity-90">
                Clock-out
              </span>
            </div>
            <div
              className={clsx(
                "text-2xl font-bold mb-0.5 transition-all duration-300",
                isCalculating ? "opacity-60 scale-95" : "opacity-100 scale-100"
              )}
            >
              {formatTime(endTime) || "--:--"}
            </div>
            <div className="text-[10px] text-blue-100">End time</div>
          </div>
          {/* Suggested Lunch Time */}
          <div
            className={clsx(
              "bg-white rounded-xl shadow border border-slate-200/60 p-2 flex-1 flex flex-col items-center justify-center min-w-0 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            )}
          >
            <div className="text-xs font-semibold text-slate-900 mb-1">
              Lunch
            </div>
            <div
              className={clsx(
                "text-xl font-bold text-emerald-600 mb-0.5 transition-all duration-300",
                isCalculating ? "opacity-60 scale-95" : "opacity-100 scale-100"
              )}
            >
              {formatTime(lunchTime) || "--:--"}
            </div>
            <div className="text-[10px] text-slate-500">+5h</div>
          </div>
        </div>

        {/* Main Content Grid */}

        <div
          className={clsx(
            "grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8 lg:h-[520px] transition-all duration-1000 ease",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {/* Input Section */}
          <div className="lg:col-span-2 h-full flex flex-col">
            <ShiftDetails
              startTime={startTime}
              setStartTime={setStartTime}
              lunchDuration={lunchDuration}
              setLunchDuration={setLunchDuration}
              workMinutesTotal={workMinutesTotal}
              setWorkMinutesTotal={setWorkMinutesTotal}
            />
          </div>

          {/* Results Section - hidden on mobile, visible on md+ */}
          <div className="hidden md:flex flex-col md:flex-row lg:flex-col h-full space-y-3 sm:space-y-4 md:space-y-0 md:space-x-3 sm:md:space-x-4 lg:space-x-0 lg:space-y-6">
            <ResultCard
              label="Clock-out Time"
              value={formatTime(endTime)}
              sublabel="Your calculated clock out time"
              color="blue"
              isCalculating={isCalculating}
            />
            <ResultCard
              label="Suggested Lunch"
              value={formatTime(lunchTime)}
              sublabel="5 hours after start time per California law requirement"
              color="green"
              isCalculating={isCalculating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
