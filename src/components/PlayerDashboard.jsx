// PlayerDashboard — Main player view showing day toggles, tee time assignment, and guest input
import { useState } from "react";
import { useWeekDates } from "../hooks/useWeekDates";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatTime } from "../data/teeTimes";

export default function PlayerDashboard({ playerName, onChangeName, onAdminClick }) {
  const { saturdayStr, sundayStr, weekKey, satLocked, sunLocked } = useWeekDates();
  const [signups, setSignups] = useLocalStorage("lambdagolf_signups", {});
  const [pairings] = useLocalStorage("lambdagolf_pairings", {});

  const mySignup = signups[playerName] || {
    saturday: false,
    sunday: false,
    satGuest: "",
    sunGuest: "",
  };

  const updateSignup = (updates) => {
    setSignups((prev) => ({
      ...prev,
      [playerName]: { ...mySignup, ...updates },
    }));
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
            ? "bg-red-50 border-red-400"
            : "bg-white border-gray-100"
        }`}>
          <h3 className={`text-xl font-bold mb-3 ${
            satTeeTime || sunTeeTime ? "text-red-600" : "text-gray-400"
          }`}>
            YOUR TEE TIMES
          </h3>
          {satTeeTime || sunTeeTime ? (
            <div className="space-y-3">
              {satTeeTime && (
                <div>
                  <p className="text-lg font-bold text-red-700">
                    Saturday — {formatTime(satTeeTime.time)}
                  </p>
                  {satTeeTime.groupMates.length > 0 && (
                    <p className="text-sm text-red-600/70 mt-0.5">
                      Playing with: {satTeeTime.groupMates.join(", ")}
                    </p>
                  )}
                </div>
              )}
              {sunTeeTime && (
                <div>
                  <p className="text-lg font-bold text-red-700">
                    Sunday — {formatTime(sunTeeTime.time)}
                  </p>
                  {sunTeeTime.groupMates.length > 0 && (
                    <p className="text-sm text-red-600/70 mt-0.5">
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
          guest={mySignup.satGuest}
          timeLocked={satLocked}
          onToggle={(turnOff) => {
            if (turnOff) {
              updateSignup({ saturday: false, satGuest: "" });
            } else {
              updateSignup({ saturday: true });
            }
          }}
          onGuestChange={(val) => updateSignup({ satGuest: val })}
        />

        {/* Sunday toggle */}
        <DayCard
          label={sundayStr}
          isOn={mySignup.sunday}
          guest={mySignup.sunGuest}
          timeLocked={sunLocked}
          onToggle={(turnOff) => {
            if (turnOff) {
              updateSignup({ sunday: false, sunGuest: "" });
            } else {
              updateSignup({ sunday: true });
            }
          }}
          onGuestChange={(val) => updateSignup({ sunGuest: val })}
        />

        <p className="text-center text-gray-400 text-sm mt-6">
          Signups lock 24 hours before tee time
        </p>
      </div>
    </div>
  );
}

// DayCard — Toggle card with auto-lock after selection, lock icon to unlock and cancel
function DayCard({ label, isOn, guest, timeLocked, onToggle, onGuestChange }) {
  const [userLocked, setUserLocked] = useState(true);
  const [showCancelMsg, setShowCancelMsg] = useState(false);

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

      {isOn && !isLocked && (
        <div className="mt-3 pt-3 border-t border-[#b7e4c7]">
          <label className="text-sm text-[#2d6a4f] font-medium">
            Bringing a guest?
          </label>
          <input
            type="text"
            placeholder="Enter guest name"
            value={guest}
            onChange={(e) => onGuestChange(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-[#b7e4c7] bg-white text-sm focus:outline-none focus:border-[#2d6a4f]"
          />
        </div>
      )}
    </div>
  );
}
