import type React from "react";
import { useEffect, useState } from "react";
import { Clock, Utensils } from "lucide-react";
import clsx from "clsx";

export default function ClockoutApp() {
  const [startTime, setStartTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
  const [workDuration, setWorkDuration] = useState("8:00");
  const [workHours, setWorkHours] = useState(8);
  const [workMinutes, setWorkMinutes] = useState(0);
  const [endTime, setEndTime] = useState("");
  const [lunchDuration, setLunchDuration] = useState(15);
  const [lunchTime, setLunchTime] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [timeFormat, setTimeFormat] = useState<"24" | "12">("12");

  function formatTime(time: string) {
    if (timeFormat === "24" || !time || time === "--:--") return time;
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return time;
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  function addHoursToTime(time: string, hoursToAdd: number): string {
    const [hourStr, minuteStr] = time.split(":");
    let hours = Number.parseInt(hourStr, 10);
    const minutes = Number.parseInt(minuteStr, 10);

    hours = (hours + hoursToAdd) % 24;
    if (hours < 0) hours += 24;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  useEffect(() => {
    const time = addHoursToTime(startTime, 5);
    setLunchTime(time);
  }, [startTime]);

  useEffect(() => {
    if (!startTime || !workDuration || !lunchDuration) {
      setEndTime("");
      return;
    }

    setIsCalculating(true);

    const calculateEndTime = () => {
      const [workHrs, workMins] = workDuration.split(":").map(Number);
      const lunchMins = Number(lunchDuration);

      const [startHrs, startMins] = startTime.split(":").map(Number);

      let totalMins = startMins + workMins + lunchMins;
      let totalHrs = startHrs + workHrs + Math.floor(totalMins / 60);
      totalMins = totalMins % 60;
      totalHrs = totalHrs % 24;

      const formattedEndTime = `${totalHrs
        .toString()
        .padStart(2, "0")}:${totalMins.toString().padStart(2, "0")}`;
      setEndTime(formattedEndTime);
      setIsCalculating(false);
    };

    const timer = setTimeout(calculateEndTime, 150);
    return () => clearTimeout(timer);
  }, [startTime, lunchDuration, workDuration]);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setStartTime(time);
  };

  const handleWorkedHrsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let workHrs = Number.parseInt(e.target.value) || 0;
    workHrs = Math.max(0, Math.min(12, workHrs));
    setWorkHours(workHrs);
    const buffer = [
      workHrs.toString().padStart(2, "0"),
      workMinutes.toString().padStart(2, "0"),
    ];
    setWorkDuration(buffer.join(":"));
  };

  const handleWorkedMinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let workMins = Number.parseInt(e.target.value) || 0;
    workMins = Math.max(0, Math.min(59, workMins));
    setWorkMinutes(workMins);
    const buffer = [
      workHours.toString().padStart(2, "0"),
      workMins.toString().padStart(2, "0"),
    ];
    setWorkDuration(buffer.join(":"));
  };

  const handleLunchDurationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const ld = Number(e.target.value);
    setLunchDuration(ld);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-4 lg:mb-12">
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
              {/* Stepper toggle */}
              {/* <div className="flex items-center gap-1">
                <button
                  type="button"
                  className={clsx(
                    "px-1 text-xs rounded transition-colors",
                    timeFormat === "24"
                      ? "bg-white/20 text-white font-bold"
                      : "text-white/70 hover:bg-white/10"
                  )}
                  aria-label="24 hour format"
                  onClick={() => setTimeFormat("24")}
                >
                  24
                </button>
                <button
                  type="button"
                  className={clsx(
                    "px-1 text-xs rounded transition-colors",
                    timeFormat === "12"
                      ? "bg-white/20 text-white font-bold"
                      : "text-white/70 hover:bg-white/10"
                  )}
                  aria-label="12 hour format"
                  onClick={() => setTimeFormat("12")}
                >
                  12
                </button>
              </div> */}
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
              {lunchTime || "--:--"}
            </div>
            <div className="text-[10px] text-slate-500">+5h</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8 lg:h-[520px]">
          {/* Input Section */}
          <div className="lg:col-span-2 h-full flex flex-col">
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
                    onChange={handleStartTimeChange}
                    defaultValue={startTime}
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
                    defaultValue={15}
                    onChange={handleLunchDurationChange}
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
                <label className="block text-sm font-semibold text-slate-800 mb-3">
                  Shift Length
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Hours
                    </label>
                    <input
                      min={0}
                      max={12}
                      type="number"
                      value={workHours}
                      onChange={handleWorkedHrsChange}
                      className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium hover:border-slate-400 focus:scale-[1.02]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Minutes
                    </label>
                    <input
                      min={0}
                      max={59}
                      type="number"
                      value={workMinutes}
                      onChange={handleWorkedMinsChange}
                      className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium hover:border-slate-400 focus:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section - hidden on mobile, visible on md+ */}
          <div className="hidden md:flex flex-col md:flex-row lg:flex-col h-full space-y-3 sm:space-y-4 md:space-y-0 md:space-x-3 sm:md:space-x-4 lg:space-x-0 lg:space-y-6">
            {/* Clock Out Time - Primary Result */}
            <div
              className={clsx(
                "bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-3 sm:p-4 lg:p-8 text-white flex-1 flex flex-col justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              )}
            >
              <div className="w-full flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">
                  Clock-out Time
                </h3>
                {/* Stepper toggle */}
                {/* <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={clsx(
                      "px-1 text-xs rounded transition-colors",
                      timeFormat === "24"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/70 hover:bg-white/10"
                    )}
                    aria-label="24 hour format"
                    onClick={() => setTimeFormat("24")}
                  >
                    24
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "px-1 text-xs rounded transition-colors",
                      timeFormat === "12"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/70 hover:bg-white/10"
                    )}
                    aria-label="12 hour format"
                    onClick={() => setTimeFormat("12")}
                  >
                    12
                  </button>
                </div> */}
              </div>
              <div
                className={clsx(
                  "text-4xl lg:text-5xl font-bold mb-2 transition-all duration-300",
                  isCalculating
                    ? "opacity-60 scale-95"
                    : "opacity-100 scale-100"
                )}
              >
                {formatTime(endTime) || "--:--"}
              </div>
              <p className="text-blue-100 text-sm">
                Your calculated clock out time
              </p>
            </div>

            {/* Suggested Lunch Time */}
            <div
              className={clsx(
                "bg-white rounded-2xl shadow-lg border border-slate-200/60 p-3 sm:p-4 lg:p-8 flex-1 flex flex-col justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              )}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Suggested Lunch
              </h3>
              <div
                className={clsx(
                  "text-2xl lg:text-3xl font-bold text-emerald-600 mb-2 transition-all duration-300",
                  isCalculating
                    ? "opacity-60 scale-95"
                    : "opacity-100 scale-100"
                )}
              >
                {formatTime(lunchTime) || "--:--"}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                5 hours after start time per California law requirement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
