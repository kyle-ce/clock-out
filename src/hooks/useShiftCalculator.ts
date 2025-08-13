import { useState, useEffect } from "react";

export function useShiftCalculator({
  initialStartTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
  initialShiftMinutes = 8 * 60,
  initialLunchMinutes = 15,
}) {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [workMinutesTotal, setWorkMinutesTotal] = useState(initialShiftMinutes);
  const [lunchDuration, setLunchDuration] = useState(initialLunchMinutes);
  const [endTime, setEndTime] = useState("");
  const [lunchTime, setLunchTime] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

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
    setLunchTime(addHoursToTime(startTime, 5));
  }, [startTime]);

  useEffect(() => {
    if (!startTime || !workMinutesTotal || !lunchDuration) {
      setEndTime("");
      return;
    }
    setIsCalculating(true);
    const calculateEndTime = () => {
      const workHrs = Math.floor(workMinutesTotal / 60);
      const workMins = workMinutesTotal % 60;
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
  }, [startTime, lunchDuration, workMinutesTotal]);

  return {
    startTime,
    setStartTime,
    workMinutesTotal,
    setWorkMinutesTotal,
    lunchDuration,
    setLunchDuration,
    endTime,
    lunchTime,
    isCalculating,
  };
}
