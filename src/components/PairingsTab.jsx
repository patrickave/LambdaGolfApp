// PairingsTab — Admin assigns players to available tee time slots in foursomes
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWeekDates } from "../hooks/useWeekDates";
import { generateTeeTimeSlots, formatTime } from "../data/teeTimes";
import { members } from "../data/members";

export default function PairingsTab() {
  const { saturdayStr, sundayStr } = useWeekDates();
  const [signups] = useLocalStorage("lambdagolf_signups", {});
  const [teeTimes] = useLocalStorage("lambdagolf_tee_times", {
    saturday: generateTeeTimeSlots(),
    sunday: generateTeeTimeSlots(),
  });
  const [pairings, setPairings] = useLocalStorage("lambdagolf_pairings", {});

  // Get available tee times for a day
  const getAvailableSlots = (day) => {
    return (teeTimes[day] || []).filter((s) => s.status === "available");
  };

  // Get all players signed up for a day (including guests)
  const getPlayersForDay = (day) => {
    const players = [];
    const guestKey = day === "saturday" ? "satGuest" : "sunGuest";
    for (const name of members) {
      if (signups[name]?.[day]) {
        players.push(name);
        if (signups[name][guestKey]) {
          players.push(`${signups[name][guestKey]} (guest of ${name.split(" ")[0]})`);
        }
      }
    }
    return players;
  };

  // Get all assigned players for a day
  const getAssignedPlayers = (day) => {
    const dayPairings = pairings[day] || {};
    const assigned = new Set();
    for (const players of Object.values(dayPairings)) {
      if (players) players.forEach((p) => p && assigned.add(p));
    }
    return assigned;
  };

  const assignPlayer = (day, time, slotIndex, playerName) => {
    setPairings((prev) => {
      const dayPairings = { ...prev[day] };
      const slots = [...(dayPairings[time] || [null, null, null, null])];
      slots[slotIndex] = playerName || null;
      dayPairings[time] = slots;
      return { ...prev, [day]: dayPairings };
    });
  };

  const renderDay = (day, label) => {
    const availableSlots = getAvailableSlots(day);
    const allPlayers = getPlayersForDay(day);
    const assignedPlayers = getAssignedPlayers(day);
    const unassigned = allPlayers.filter((p) => !assignedPlayers.has(p));

    if (availableSlots.length === 0) {
      return (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#1b4332] mb-3">{label}</h3>
          <p className="text-gray-400 text-sm">
            No tee times marked available yet — go to Tee Times tab to add them
          </p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#1b4332] mb-3">{label}</h3>

        {/* Unassigned pool */}
        {unassigned.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-amber-700 mb-2">
              Unassigned ({unassigned.length}):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {unassigned.map((name) => (
                <span
                  key={name}
                  className="bg-white text-amber-800 text-xs px-2 py-1 rounded-lg border border-amber-200"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tee time pairing cards */}
        <div className="space-y-3">
          {availableSlots.map((slot) => {
            const slots = pairings[day]?.[slot.time] || [null, null, null, null];
            const filledCount = slots.filter(Boolean).length;
            return (
              <div
                key={slot.time}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2 bg-[#f0fdf4] border-b border-gray-100">
                  <span className="font-bold text-[#1b4332] font-mono">
                    {formatTime(slot.time)}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    filledCount === 4 ? "bg-[#2d6a4f] text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {filledCount}/4
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-6">P{i + 1}</span>
                      {slots[i] ? (
                        <div className="flex-1 flex items-center justify-between bg-[#d8f3dc] rounded-lg px-3 py-2 min-h-[40px]">
                          <span className="text-sm font-medium text-[#1b4332]">
                            {slots[i]}
                          </span>
                          <button
                            onClick={() => assignPlayer(day, slot.time, i, null)}
                            className="text-[#2d6a4f] hover:text-red-500 text-lg leading-none ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <select
                          value=""
                          onChange={(e) => assignPlayer(day, slot.time, i, e.target.value)}
                          className="flex-1 px-3 py-2 min-h-[40px] rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2d6a4f]"
                        >
                          <option value="">— Select player —</option>
                          {allPlayers
                            .filter((p) => !assignedPlayers.has(p) || slots.includes(p))
                            .filter((p) => !slots.includes(p))
                            .map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderDay("saturday", saturdayStr)}
      {renderDay("sunday", sundayStr)}
    </div>
  );
}
