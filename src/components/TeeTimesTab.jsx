// TeeTimesTab — Admin manages tee time slot statuses (default/available/pending) for each day
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWeekDates } from "../hooks/useWeekDates";
import { generateTeeTimeSlots, formatTime } from "../data/teeTimes";
import { useState } from "react";

const STATUS_CYCLE = ["default", "available", "traded", "released"];
const STATUS_STYLES = {
  default: "bg-gray-100 border-gray-200 text-gray-500",
  available: "bg-[#d8f3dc] border-[#52b788] text-[#1b4332]",
  traded: "bg-blue-50 border-blue-300 text-blue-800",
  released: "bg-red-50 border-red-300 text-red-700",
};
const STATUS_LABELS = {
  default: "",
  available: "Available",
  traded: "Traded",
  released: "Released",
};

export default function TeeTimesTab() {
  const { saturdayStr, sundayStr } = useWeekDates();
  const [teeTimes, setTeeTimes] = useLocalStorage("lambdagolf_tee_times", {
    saturday: generateTeeTimeSlots(),
    sunday: generateTeeTimeSlots(),
  });
  const [editingNote, setEditingNote] = useState(null);

  const cycleStatus = (day, index) => {
    setTeeTimes((prev) => {
      const slots = [...prev[day]];
      const current = slots[index].status;
      const nextIdx = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
      slots[index] = { ...slots[index], status: STATUS_CYCLE[nextIdx] };
      return { ...prev, [day]: slots };
    });
  };

  const updateNote = (day, index, note) => {
    setTeeTimes((prev) => {
      const slots = [...prev[day]];
      slots[index] = { ...slots[index], note };
      return { ...prev, [day]: slots };
    });
  };

  const renderColumn = (day, label) => {
    const slots = teeTimes[day] || generateTeeTimeSlots();
    return (
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-[#1b4332] mb-2 text-center">{label}</h3>
        <div className="space-y-1.5">
          {slots.map((slot, i) => {
            const noteKey = `${day}-${i}`;
            return (
              <div key={slot.time} className="relative">
                <button
                  onClick={() => cycleStatus(day, i)}
                  className={`w-full rounded-lg border-2 px-2 py-2 min-h-[44px] text-sm font-medium transition-all ${STATUS_STYLES[slot.status]}`}
                >
                  <span className="font-mono">{formatTime(slot.time)}</span>
                  {STATUS_LABELS[slot.status] && (
                    <span className="ml-1 text-xs opacity-75">
                      {STATUS_LABELS[slot.status]}
                    </span>
                  )}
                  {slot.note && <span className="ml-1 text-xs">📝</span>}
                </button>
                <button
                  onClick={() => setEditingNote(editingNote === noteKey ? null : noteKey)}
                  className="absolute right-1 top-1 text-xs text-gray-400 hover:text-gray-600 px-1"
                >
                  ⋯
                </button>
                {editingNote === noteKey && (
                  <input
                    type="text"
                    placeholder="Add note..."
                    value={slot.note}
                    onChange={(e) => updateNote(day, i, e.target.value)}
                    onBlur={() => setEditingNote(null)}
                    className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    autoFocus
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">
        Tap a time slot to cycle: Default → Available → Traded → Released
      </p>
      <div className="flex gap-3">
        {renderColumn("saturday", saturdayStr)}
        {renderColumn("sunday", sundayStr)}
      </div>
    </div>
  );
}
