// PlayerDashboard — Main player view showing day toggles, tee time assignment, and guest input
import { useState } from "react";
import { useWeekDates } from "../hooks/useWeekDates";
import { useFirestore } from "../hooks/useFirestore";
import { formatTime } from "../data/teeTimes";

export default function PlayerDashboard({ playerName, onChangeName, onAdminClick }) {
  const { saturdayStr, sundayStr, weekKey, satLocked, sunLocked } = useWeekDates();
  const [signups, setSignups] = useFirestore("lambdagolf_signups", {});
  const [pairings, setPairings] = useFirestore("lambdagolf_pairings", {});

  const rawSignup = signups[playerName] || {};

  // Normalize signup data — handle both old (satGuest string) and new (satGuests array) format
  const getGuests = (signup, key) => {
    const arrayKey = key + "s"; // satGuest -> satGuests
    if (Array.isArray(signup[arrayKey])) return signup[arrayKey];
    if (signup[key] && typeof signup[key] === "string") return [signup[key]];
    return [];
  };

  const mySignup = {
    saturday: rawSignup.saturday || false,
    sunday: rawSignup.sunday || false,
    satGuests: getGuests(rawSignup, "satGuest"),
    sunGuests: getGuests(rawSignup, "sunGuest"),
  };

  const updateSignup = (updates) => {
    const current = { ...mySignup, ...updates };
    setSignups((prev) => ({
      ...prev,
      [playerName]: current,
    }));
  };

  // Remove player and their guests from pairings for a given day
  const removeFromPairings = (day) => {
    const dayPairings = pairings[day];
    if (!dayPairings) return;
    const guests = day === "saturday" ? mySignup.satGuests : mySignup.sunGuests;
    const guestLabels = new Set(guests.map((g) => `${g} (guest of ${playerName.split(" ")[0]})`));

    const updated = {};
    for (const [time, players] of Object.entries(dayPairings)) {
      if (players) {
        updated[time] = players.map((p) =>
          p === playerName || guestLabels.has(p) ? null : p
        );
      } else {
        updated[time] = players;
      }
    }
    setPairings((prev) => ({ ...prev, [day]: updated }));
  };

  // Find player's tee time assignment and group mates
  const findMyTeeTime = (day) => {
    const dayPairings = pairings[day];
    if (!dayPairings) return null;
    for (const [time, players] of Object.entries(dayPairings)) {
      if (players && players.includes(playerName)) {
        const groupMates = players.filter((p) => p && p !== playerName);
        return { time, groupMates };
      }
    }
    return null;
  };

  const satTeeTime = findMyTeeTime("saturday");
  const sunTeeTime = findMyTeeTime("sunday");

  return (
    <div className="min-h-screen bg-[#f8faf5] pb-20">
      {/* Header */}
      <div className="bg-black text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}lambda-logo.jpg`} alt="Lambda Golf" className="w-16 h-16 rounded-full" />
            <h1 className="text-2xl font-bold">Lambda Golf</h1>
          </div>
          <button
            onClick={onAdminClick}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs font-medium hover:bg-gray-700 transition-colors mt-1"
          >
            Admin
          </button>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4 max-w-lg mx-auto">
        {/* Player name with "not you" */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-[#1b4332]">{playerName}</h2>
          <button
            onClick={onChangeName}
            className="mt-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            Not you? Switch player
          </button>
        </div>

        {/* Tee Time Display — prominent, at the top */}
        <div className={`rounded-2xl p-5 shadow-sm border-2 ${
          satTeeTime || sunTeeTime
            ? "bg-gray-50 border-gray-800"
            : "bg-white border-gray-100"
        }`}>
          <h3 className={`text-xl font-bold mb-3 ${
            satTeeTime || sunTeeTime ? "text-[#1e3a5f]" : "text-gray-400"
          }`}>
            YOUR TEE TIMES
          </h3>
          {satTeeTime || sunTeeTime ? (
            <div className="space-y-3">
              {satTeeTime && (
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    Saturday — {formatTime(satTeeTime.time)}
                  </p>
                  {satTeeTime.groupMates.length > 0 && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      Playing with: {satTeeTime.groupMates.join(", ")}
                    </p>
                  )}
                </div>
              )}
              {sunTeeTime && (
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    Sunday — {formatTime(sunTeeTime.time)}
                  </p>
                  {sunTeeTime.groupMates.length > 0 && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      Playing with: {sunTeeTime.groupMates.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Tee time TBD — check back soon</p>
          )}
        </div>

        {/* Saturday toggle */}
        <DayCard
          label={saturdayStr}
          isOn={mySignup.saturday}
          guests={mySignup.satGuests}
          timeLocked={satLocked}
          onToggle={(turnOff) => {
            if (turnOff) {
              removeFromPairings("saturday");
              updateSignup({ saturday: false, satGuests: [] });
            } else {
              updateSignup({ saturday: true });
            }
          }}
          onAddGuest={(name) => updateSignup({ satGuests: [...mySignup.satGuests, name] })}
          onRemoveGuest={(i) => updateSignup({ satGuests: mySignup.satGuests.filter((_, idx) => idx !== i) })}
        />

        {/* Sunday toggle */}
        <DayCard
          label={sundayStr}
          isOn={mySignup.sunday}
          guests={mySignup.sunGuests}
          timeLocked={sunLocked}
          onToggle={(turnOff) => {
            if (turnOff) {
              removeFromPairings("sunday");
              updateSignup({ sunday: false, sunGuests: [] });
            } else {
              updateSignup({ sunday: true });
            }
          }}
          onAddGuest={(name) => updateSignup({ sunGuests: [...mySignup.sunGuests, name] })}
          onRemoveGuest={(i) => updateSignup({ sunGuests: mySignup.sunGuests.filter((_, idx) => idx !== i) })}
        />

        <p className="text-center text-gray-400 text-sm mt-6">
          Signups lock 24 hours before tee time
        </p>
        <p className="text-center text-gray-400 text-sm">
          Please update the group on the Text Message Thread
        </p>
      </div>
    </div>
  );
}

// DayCard — Toggle card with auto-lock after selection, lock icon to unlock and cancel
function DayCard({ label, isOn, guests = [], timeLocked, onToggle, onAddGuest, onRemoveGuest }) {
  const [userLocked, setUserLocked] = useState(true);
  const [showCancelMsg, setShowCancelMsg] = useState(false);
  const [newGuest, setNewGuest] = useState("");

  // Auto-lock is active when the day is selected and user hasn't unlocked
  const isLocked = isOn && userLocked;

  // 24-hour time lockout
  if (timeLocked) {
    return (
      <div
        className={`rounded-2xl p-5 shadow-sm border-2 transition-all duration-200 ${
          isOn
            ? "bg-[#d8f3dc] border-[#52b788] opacity-75"
            : "bg-gray-50 border-gray-200 opacity-75"
        }`}
      >
        <div className="flex justify-between items-center min-h-[48px]">
          <span className={`text-lg font-semibold ${isOn ? "text-[#1b4332]" : "text-gray-600"}`}>
            {label}
          </span>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-1">
            🔒 Locked
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Signups are locked. Please let the text thread know if anything changes.
        </p>
      </div>
    );
  }

  const handleToggle = () => {
    if (isOn) {
      // Turning off — show cancel message
      onToggle(true);
      setShowCancelMsg(true);
      setUserLocked(true);
      setTimeout(() => setShowCancelMsg(false), 5000);
    } else {
      // Turning on — auto-lock after
      onToggle(false);
      setUserLocked(true);
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border-2 transition-all duration-200 ${
        isOn
          ? "bg-[#d8f3dc] border-[#52b788]"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center min-h-[48px]">
        <span className={`text-lg font-semibold ${isOn ? "text-[#1b4332]" : "text-gray-600"}`}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {isOn && (
            <button
              onClick={() => setUserLocked(!userLocked)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                userLocked ? "bg-[#b7e4c7] hover:bg-[#95d5ab]" : "bg-amber-100"
              }`}
              title={userLocked ? "Unlock to change" : "Lock selection"}
            >
              {userLocked ? "🔒" : "🔓"}
            </button>
          )}
          <button
            onClick={handleToggle}
            disabled={isLocked}
            className={isLocked ? "cursor-not-allowed" : ""}
          >
            <span
              className={`w-14 h-8 rounded-full flex items-center transition-all duration-200 ${
                isOn ? "bg-[#2d6a4f] justify-end" : "bg-gray-300 justify-start"
              } ${isLocked ? "opacity-50" : ""}`}
            >
              <span className="w-6 h-6 bg-white rounded-full shadow mx-1" />
            </span>
          </button>
        </div>
      </div>

      {showCancelMsg && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-xl">
          <p className="text-sm text-amber-800 font-medium">
            Please let the group know you cannot make it.
          </p>
        </div>
      )}

      {isOn && (
        <div className="mt-3 pt-3 border-t border-[#b7e4c7]">
          <label className="text-sm text-[#2d6a4f] font-medium">
            Bringing guests?
          </label>
          {guests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {guests.map((g, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-white text-[#1b4332] text-sm font-medium px-3 py-1 rounded-full border border-[#b7e4c7]">
                  {g}
                  <button
                    onClick={() => onRemoveGuest(i)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newGuest.trim()) {
                onAddGuest(newGuest.trim());
                setNewGuest("");
              }
            }}
            className="flex gap-2 mt-2"
          >
            <input
              type="text"
              placeholder="Guest name"
              value={newGuest}
              onChange={(e) => setNewGuest(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-[#b7e4c7] bg-white text-sm focus:outline-none focus:border-[#2d6a4f]"
            />
            <button
              type="submit"
              disabled={!newGuest.trim()}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                newGuest.trim()
                  ? "bg-[#2d6a4f] text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
