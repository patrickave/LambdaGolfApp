// PlayerDashboard — Main player view showing day toggles, tee time assignment, and guest input
import { useWeekDates } from "../hooks/useWeekDates";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatTime } from "../data/teeTimes";

export default function PlayerDashboard({ playerName, onChangeName, onAdminClick }) {
  const { saturdayStr, sundayStr, weekKey } = useWeekDates();
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
            <img src="/lambda-logo.jpg" alt="Lambda Golf" className="w-16 h-16 rounded-full" />
            <h1 className="text-2xl font-bold">Lambda Golf</h1>
          </div>
          <div className="flex flex-col items-end gap-1 pt-1">
            <button
              onClick={onAdminClick}
              className="text-gray-400 text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              Admin
            </button>
            <button
              onClick={onChangeName}
              className="text-sm text-gray-400 opacity-60 hover:opacity-100"
            >
              Not you?
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4 max-w-lg mx-auto">
        {/* Saturday toggle */}
        <DayCard
          day="saturday"
          label={saturdayStr}
          isOn={mySignup.saturday}
          guest={mySignup.satGuest}
          teeTime={satTeeTime}
          onToggle={() => updateSignup({ saturday: !mySignup.saturday, satGuest: !mySignup.saturday ? mySignup.satGuest : "" })}
          onGuestChange={(val) => updateSignup({ satGuest: val })}
        />

        {/* Sunday toggle */}
        <DayCard
          day="sunday"
          label={sundayStr}
          isOn={mySignup.sunday}
          guest={mySignup.sunGuest}
          teeTime={sunTeeTime}
          onToggle={() => updateSignup({ sunday: !mySignup.sunday, sunGuest: !mySignup.sunday ? mySignup.sunGuest : "" })}
          onGuestChange={(val) => updateSignup({ sunGuest: val })}
        />

        {/* Tee Time Display */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-6">
          <h3 className="font-semibold text-[#1b4332] mb-3">Your Tee Times</h3>
          {satTeeTime || sunTeeTime ? (
            <div className="space-y-4">
              {satTeeTime && (
                <div>
                  <p className="text-lg">
                    <span className="font-medium">Saturday:</span>{" "}
                    <span className="text-[#2d6a4f] font-bold">{formatTime(satTeeTime.time)}</span>
                  </p>
                  {satTeeTime.groupMates.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Playing with: {satTeeTime.groupMates.join(", ")}
                    </p>
                  )}
                </div>
              )}
              {sunTeeTime && (
                <div>
                  <p className="text-lg">
                    <span className="font-medium">Sunday:</span>{" "}
                    <span className="text-[#2d6a4f] font-bold">{formatTime(sunTeeTime.time)}</span>
                  </p>
                  {sunTeeTime.groupMates.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
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

        <p className="text-center text-gray-400 text-sm mt-6">
          Tap to update anytime before Friday at noon
        </p>
      </div>
    </div>
  );
}

// DayCard — Toggle card for a single day (Saturday or Sunday)
function DayCard({ label, isOn, guest, teeTime, onToggle, onGuestChange }) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border-2 transition-all duration-200 ${
        isOn
          ? "bg-[#d8f3dc] border-[#52b788]"
          : "bg-white border-gray-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center min-h-[48px]"
      >
        <span className={`text-lg font-semibold ${isOn ? "text-[#1b4332]" : "text-gray-600"}`}>
          {label}
        </span>
        <span
          className={`w-14 h-8 rounded-full flex items-center transition-all duration-200 ${
            isOn ? "bg-[#2d6a4f] justify-end" : "bg-gray-300 justify-start"
          }`}
        >
          <span className="w-6 h-6 bg-white rounded-full shadow mx-1" />
        </span>
      </button>

      {isOn && (
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
