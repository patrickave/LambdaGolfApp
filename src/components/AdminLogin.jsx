// AdminLogin — Simple password gate for admin mode (hardcoded password: lambdagolf)
import { useState } from "react";

export default function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === "lambdagolfadmin") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-lg border-2 bg-white focus:outline-none mb-4 ${
              error ? "border-red-400 shake" : "border-[#52b788] focus:border-[#2d6a4f]"
            }`}
            autoFocus
          />
          {error && (
            <p className="text-red-300 text-sm text-center mb-4">
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            className="w-full py-4 rounded-xl text-lg font-bold bg-[#52b788] text-white shadow-lg active:scale-95 transition-transform"
          >
            Enter
          </button>
        </form>
        <button
          onClick={onBack}
          className="w-full mt-4 py-3 text-[#b7e4c7] text-center hover:text-white transition-colors"
        >
          Back to player view
        </button>
      </div>
    </div>
  );
}
