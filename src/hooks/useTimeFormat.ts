export function formatTime(time: string) {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  let hour = Number(hourStr);
  const minute = Number(minuteStr);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export function parseDurationInput(val: string): number | null {
  let v = val.trim();
  if (/^\d+$/.test(v)) {
    if (v.length <= 2) return Number(v) * 60;
    if (v.length === 3) return Number(v[0]) * 60 + Number(v.slice(1));
    if (v.length === 4) return Number(v.slice(0, 2)) * 60 + Number(v.slice(2));
  }
  if (/^\d{1,2}(\.\d+)$/.test(v)) {
    const [h, dec] = v.split(".");
    return Number(h) * 60 + Math.round(Number("0." + dec) * 60);
  }
  if (/^\d{1,2}[:.,]\d{1,2}$/.test(v)) {
    const [h, m] = v.split(/[:.,]/).map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }
  return null;
}
