// Generate tee time slots from 8:30am to 4:54pm in 9-minute intervals
export function generateTeeTimeSlots() {
  const slots = [];
  let hour = 8;
  let minute = 30;

  while (hour < 16 || (hour === 16 && minute <= 54)) {
    const timeStr = `${hour}:${minute.toString().padStart(2, "0")}`;
    slots.push({
      time: timeStr,
      status: "default", // "default" | "available" | "traded" | "released"
      note: "",
    });
    minute += 9;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }
  }

  return slots;
}

// Format time for display (e.g., "7:30am")
export function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  const ampm = hour >= 12 ? "pm" : "am";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")}${ampm}`;
}
