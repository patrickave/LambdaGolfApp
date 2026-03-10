// App — Root component handling routing between NameSetup, PlayerDashboard, AdminLogin, and AdminDashboard
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useWeekDates } from "./hooks/useWeekDates";
import SiteLogin from "./components/SiteLogin";
import NameSetup from "./components/NameSetup";
import PlayerDashboard from "./components/PlayerDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { useState, useEffect } from "react";

export default function App() {
  const [siteAuth, setSiteAuth] = useLocalStorage("lambdagolf_site_session", false);
  const [playerName, setPlayerName] = useLocalStorage("lambdagolf_player_name", "");
  const [isAdmin, setIsAdmin] = useLocalStorage("lambdagolf_admin_session", false);
  const [view, setView] = useState("player"); // "player" | "admin-login" | "admin"
  const { weekKey } = useWeekDates();
  const [storedWeek, setStoredWeek] = useLocalStorage("lambdagolf_week", "");

  // Reset data if week has changed
  useEffect(() => {
    if (storedWeek && storedWeek !== weekKey) {
      window.localStorage.removeItem("lambdagolf_signups");
      window.localStorage.removeItem("lambdagolf_tee_times");
      window.localStorage.removeItem("lambdagolf_pairings");
    }
    setStoredWeek(weekKey);
  }, [weekKey, storedWeek, setStoredWeek]);

  // If admin session exists, go straight to admin view
  useEffect(() => {
    if (isAdmin && view === "admin-login") {
      setView("admin");
    }
  }, [isAdmin, view]);

  // Site-wide password gate
  if (!siteAuth) {
    return <SiteLogin onLogin={() => setSiteAuth(true)} />;
  }

  // No name set — show name picker
  if (!playerName) {
    return <NameSetup onNameSelected={(name) => setPlayerName(name)} />;
  }

  // Admin login screen
  if (view === "admin-login") {
    return (
      <AdminLogin
        onLogin={() => {
          setIsAdmin(true);
          setView("admin");
        }}
        onBack={() => setView("player")}
      />
    );
  }

  // Admin dashboard
  if (view === "admin" && isAdmin) {
    return <AdminDashboard onBack={() => setView("player")} />;
  }

  // Player dashboard (default)
  return (
    <PlayerDashboard
      playerName={playerName}
      onChangeName={() => setPlayerName("")}
      onAdminClick={() => setView(isAdmin ? "admin" : "admin-login")}
    />
  );
}
