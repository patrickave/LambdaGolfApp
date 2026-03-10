// SignupsTab — Admin view of all member signups with override capability
import { members } from "../data/members";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function SignupsTab() {
  const [signups, setSignups] = useLocalStorage("lambdagolf_signups", {});

  const toggleDay = (name, day) => {
    const current = signups[name] || { saturday: false, sunday: false, satGuest: "", sunGuest: "" };
    setSignups((prev) => ({
      ...prev,
      [name]: { ...current, [day]: !current[day] },
    }));
  };

  const satCount = members.filter((m) => signups[m]?.saturday).length;
  const sunCount = members.filter((m) => signups[m]?.sunday).length;
  const noResponse = members.filter((m) => !signups[m]?.saturday && !signups[m]?.sunday);

  return (
    <div>
      {/* Count badges */}
      <div className="flex gap-3 mb-4">
        <span className="bg-[#d8f3dc] text-[#1b4332] px-3 py-1 rounded-full text-sm font-semibold">
          {satCount} playing Saturday
        </span>
        <span className="bg-[#d8f3dc] text-[#1b4332] px-3 py-1 rounded-full text-sm font-semibold">
          {sunCount} playing Sunday
        </span>
      </div>

      {/* Member rows */}
      <div className="space-y-2">
        {members.map((name) => {
          const signup = signups[name] || { saturday: false, sunday: false, satGuest: "", sunGuest: "" };
          const hasResponse = signup.saturday || signup.sunday;

          return (
            <div
              key={name}
              className={`bg-white rounded-xl p-3 border transition-colors ${
                hasResponse ? "border-gray-100" : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${!hasResponse ? "text-amber-700" : ""}`}>
                    {name}
                  </p>
                  {(signup.satGuest || signup.sunGuest) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {signup.satGuest && `Sat guest: ${signup.satGuest}`}
                      {signup.satGuest && signup.sunGuest && " · "}
                      {signup.sunGuest && `Sun guest: ${signup.sunGuest}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => toggleDay(name, "saturday")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      signup.saturday
                        ? "bg-[#2d6a4f] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Sat
                  </button>
                  <button
                    onClick={() => toggleDay(name, "sunday")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-colors ${
                      signup.sunday
                        ? "bg-[#2d6a4f] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    Sun
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {noResponse.length > 0 && (
        <p className="text-sm text-amber-600 mt-4">
          {noResponse.length} member{noResponse.length !== 1 ? "s" : ""} haven't responded yet
        </p>
      )}
    </div>
  );
}
