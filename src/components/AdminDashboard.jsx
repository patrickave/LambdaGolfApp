// AdminDashboard — Tabbed admin interface with Signups, Tee Times, and Pairings tabs
import { useState } from "react";
import SignupsTab from "./SignupsTab";
import TeeTimesTab from "./TeeTimesTab";
import PairingsTab from "./PairingsTab";

const TABS = [
  { id: "signups", label: "Signups" },
  { id: "teetimes", label: "Tee Times" },
  { id: "pairings", label: "Pairings" },
];

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("signups");

  return (
    <div className="min-h-screen bg-[#f8faf5] pb-20">
      {/* Header */}
      <div className="bg-black text-white px-5 pt-12 pb-4 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img src="/lambda-logo.jpg" alt="Lambda Golf" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={onBack}
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            ← Player View
          </button>
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
      </div>
    </div>
  );
}
