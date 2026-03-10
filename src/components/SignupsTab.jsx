// SignupsTab — Admin read-only view of all member signups with filtering
import { useState } from "react";
import { members } from "../data/members";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function SignupsTab() {
  const [signups] = useLocalStorage("lambdagolf_signups", {});
  const [filter, setFilter] = useState("all"); // "all" | "saturday" | "sunday" | "none"

  const satCount = members.filter((m) => signups[m]?.saturday).length;
  const sunCount = members.filter((m) => signups[m]?.sunday).length;
  const noResponse = members.filter((m) => !signups[m]?.saturday && !signups[m]?.sunday);

  const filteredMembers = members.filter((name) => {
    const signup = signups[name];
    if (filter === "saturday") return signup?.saturday;
    if (filter === "sunday") return signup?.sunday;
    if (filter === "none") return !signup?.saturday && !signup?.sunday;
    return true;
  });

  return (
    <div>
      {/* Filter badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter(filter === "all" ? "all" : "all")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "all" ? "bg-[#2d6a4f] text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          All ({members.length})
        </button>
        <button
          onClick={() => setFilter(filter === "saturday" ? "all" : "saturday")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "saturday" ? "bg-[#2d6a4f] text-white" : "bg-[#d8f3dc] text-[#1b4332]"
          }`}
        >
          Saturday ({satCount})
        </button>
        <button
          onClick={() => setFilter(filter === "sunday" ? "all" : "sunday")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "sunday" ? "bg-[#2d6a4f] text-white" : "bg-[#d8f3dc] text-[#1b4332]"
          }`}
        >
          Sunday ({sunCount})
        </button>
        <button
          onClick={() => setFilter(filter === "none" ? "all" : "none")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors min-h-[36px] ${
            filter === "none" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700"
          }`}
        >
          No Response ({noResponse.length})
        </button>
      </div>

      {/* Member rows — read-only */}
      <div className="space-y-2">
        {filteredMembers.map((name) => {
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
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] flex items-center ${
                      signup.saturday
                        ? "bg-[#2d6a4f] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    Sat
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] flex items-center ${
                      signup.sunday
                        ? "bg-[#2d6a4f] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    Sun
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <p className="text-gray-400 text-sm text-center mt-4">No members match this filter</p>
      )}
    </div>
  );
}
