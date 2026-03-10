// SiteLogin — Password gate for accessing the app (password: lambdagolf)
import { useState } from "react";

export default function SiteLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === "golf") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <img src="/lambda-logo.jpg" alt="Lambda Golf" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Lambda Golf
        </h1>
        <p className="text-[#b7e4c7] text-center mb-8">
          Enter the group password to continue
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            className={`w-full px-4 py-3 rounded-xl text-lg border-2 bg-white focus:outline-none mb-4 ${
              error ? "border-red-400" : "border-[#52b788] focus:border-[#2d6a4f]"
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
      </div>
    </div>
  );
}
