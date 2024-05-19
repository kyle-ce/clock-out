import "./App.css";
import { useState } from "react";
import Select from "./components/Select";
import Time from "./components/Time";
import { FaQuestionCircle } from "react-icons/fa";

function App() {
  const [startTime, setStartTime] = useState("08:57");
  const [duration, setDuration] = useState(30);

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(parseInt(e.target.value));
  };

  const calculateEndTime = (hours = 0) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    // Add 8 hours to start hours for total shift
    const totalStartMinutes = (startHours + hours) * 60 + startMinutes;
    const endTotalMinutes = totalStartMinutes + duration;
    // Adjust the total minutes to be within 24 hours
    const adjustedEndTotalMinutes = endTotalMinutes % (24 * 60);
    const endHours = Math.floor(adjustedEndTotalMinutes / 60);
    const endMinutes = adjustedEndTotalMinutes % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")}`;
    return endTime;
  };

  const calculateLunchTime = (hours = 5) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    // Add hours to start hours for total shift
    const totalStartMinutes = (startHours + hours) * 60 + startMinutes;
    // Adjust the total minutes to be within 24 hours
    const adjustedEndTotalMinutes = totalStartMinutes % (24 * 60);
    const endHours = Math.floor(adjustedEndTotalMinutes / 60);
    const endMinutes = adjustedEndTotalMinutes % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")}`;
    return endTime;
  };

  const lunchOptions = [
    { value: 0, label: "0 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "60 minutes" },
  ];

  return (
    <div className="container mx-auto mt-8 ">
      <div className="max-w-md p-8 mx-auto bg-gray-100 rounded-lg shadow-md">
        <h1 className="mb-8 text-2xl font-bold text-center ">Clockout</h1>
        <div className="mb-6">
          <Time
            value={startTime}
            label="Starting Time"
            onChange={handleStartTimeChange}
          />
        </div>
        <div className="mb-6">
          <Select
            options={lunchOptions}
            defaultValue={lunchOptions[1].value}
            onChange={handleDurationChange}
            label="Lunch Duration"
          />
        </div>
        <div classname="mb=6">
          <Time value={calculateLunchTime()} label="Lunch Time" readOnly />
        </div>
        <div>
          <Time value={calculateEndTime(8)} label="Clockout Time" readOnly />
        </div>
        <button onClick={() => alert("Cesar needs to learn basic math.")}>
          <FaQuestionCircle className="fill-yellow-500" />
        </button>
      </div>
    </div>
  );
}

export default App;
