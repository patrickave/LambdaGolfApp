// NameSetup — Full-screen prompt for first-time users to pick their name from the member list
import { useState } from "react";
import { useMembers } from "../hooks/useMembers";

export default function NameSetup({ onNameSelected }) {
  const { members } = useMembers();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const filtered = members.filter((m) =>
    m.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (selected) {
      // Store in both localStorage and cookie
      document.cookie = `lambdagolf_player_name=${encodeURIComponent(selected)}; path=/; max-age=31536000`;
      onNameSelected(selected);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <img src={`${import.meta.env.BASE_URL}lambda-logo.jpg`} alt="Lambda Golf" className="w-20 h-20 rounded-full mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Lambda Golf
        </h1>
        <p className="text-[#b7e4c7] text-center mb-8">
          Welcome! Pick your name to get started.
        </p>

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-lg border-2 border-[#52b788] bg-white focus:outline-none focus:border-[#2d6a4f] mb-4"
        />

        <div className="bg-white rounded-xl max-h-64 overflow-y-auto mb-6 shadow-lg">
          {filtered.map((name) => (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`w-full text-left px-4 py-3 min-h-[48px] border-b border-gray-100 last:border-b-0 transition-colors ${
                selected === name
                  ? "bg-[#d8f3dc] text-[#1b4332] font-semibold"
                  : "text-gray-800 hover:bg-gray-50"
              }`}
            >
              {name}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-3 text-gray-400">No members found</p>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
            selected
              ? "bg-[#52b788] text-white shadow-lg active:scale-95"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {selected ? `Continue as ${selected}` : "Select your name"}
        </button>
      </div>
    </div>
  );
}
