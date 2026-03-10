// AdminDashboard — Tabbed admin interface with Signups, Tee Times, Pairings, and Members tabs
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import SignupsTab from "./SignupsTab";
import TeeTimesTab from "./TeeTimesTab";
import PairingsTab from "./PairingsTab";
import MembersTab from "./MembersTab";

const TABS = [
  { id: "signups", label: "Signups" },
  { id: "teetimes", label: "Tee Times" },
  { id: "pairings", label: "Pairings" },
  { id: "members", label: "Members" },
];

export default function AdminDashboard({ onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState("signups");

  const handleResetWeek = () => {
    if (window.confirm("Reset everything? This clears all signups, tee times, and pairings.")) {
      setDoc(doc(db, "state", "lambdagolf_signups"), { value: {} });
      setDoc(doc(db, "state", "lambdagolf_tee_times"), { value: {} });
      setDoc(doc(db, "state", "lambdagolf_pairings"), { value: {} });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf5] pb-20">
      {/* Header */}
      <div className="bg-black text-white px-5 pt-12 pb-4 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}lambda-logo.jpg`} alt="Lambda Golf" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs font-medium hover:bg-gray-700 transition-colors"
            >
              ← Player View
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-red-900 text-red-300 text-xs font-medium hover:bg-red-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
                activeTab === tab.id
                  ? "bg-[#52b788] text-white shadow"
                  : "text-[#b7e4c7] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 mt-5 max-w-lg mx-auto">
        {activeTab === "signups" && <SignupsTab />}
        {activeTab === "teetimes" && <TeeTimesTab />}
        {activeTab === "pairings" && <PairingsTab />}
        {activeTab === "members" && <MembersTab />}

        {/* Reset Week */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={handleResetWeek}
            className="w-full py-3 rounded-xl bg-red-100 text-red-700 font-semibold text-sm hover:bg-red-200 transition-colors"
          >
            Reset Week — Clear All Signups, Tee Times & Pairings
          </button>
        </div>
      </div>
    </div>
  );
}
