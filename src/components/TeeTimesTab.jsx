// TeeTimesTab — Admin manages tee time slot statuses (default/available/pending) for each day
import { useFirestore } from "../hooks/useFirestore";
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
  const [teeTimes, setTeeTimes] = useFirestore("lambdagolf_tee_times", {
    saturday: generateTeeTimeSlots(),
    sunday: generateTeeTimeSlots(),
  });
  const [editingNote, setEditingNote] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "available" | "traded" | "released"

  const allSlots = [...(teeTimes.saturday || []), ...(teeTimes.sunday || [])];
  const availCount = allSlots.filter((s) => s.status === "available").length;
  const tradedCount = allSlots.filter((s) => s.status === "traded").length;
  const releasedCount = allSlots.filter((s) => s.status === "released").length;

  const cycleStatus = (day, index) => {
    setTeeTimes((prev) => {
      const slots = [...(prev[day] || generateTeeTimeSlots())];
      const current = slots[index].status;
      const nextIdx = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
      slots[index] = { ...slots[index], status: STATUS_CYCLE[nextIdx] };
      return { ...prev, [day]: slots };
    });
  };

  const updateNote = (day, index, note) => {
    setTeeTimes((prev) => {
      const slots = [...(prev[day] || generateTeeTimeSlots())];
      slots[index] = { ...slots[index], note };
      return { ...prev, [day]: slots };
    });
  };

  const renderColumn = (day, label) => {
    const allDaySlots = teeTimes[day] || generateTeeTimeSlots();
    const slots = allDaySlots.map((slot, i) => ({ ...slot, originalIndex: i }));
    const filtered = filter === "all" ? slots : slots.filter((s) => s.status === filter);
    return (
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-[#1b4332] mb-2 text-center">{label}</h3>
        <div className="space-y-1.5">
          {filtered.map((slot) => {
            const i = slot.originalIndex;
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
      {/* Filter badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "all" ? "bg-[#2d6a4f] text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter(filter === "available" ? "all" : "available")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "available" ? "bg-[#2d6a4f] text-white" : "bg-[#d8f3dc] text-[#1b4332]"
          }`}
        >
          Available ({availCount})
        </button>
        <button
          onClick={() => setFilter(filter === "traded" ? "all" : "traded")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "traded" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800"
          }`}
        >
          Traded ({tradedCount})
        </button>
        <button
          onClick={() => setFilter(filter === "released" ? "all" : "released")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "released" ? "bg-red-600 text-white" : "bg-red-50 text-red-700"
          }`}
        >
          Released ({releasedCount})
        </button>
      </div>
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
