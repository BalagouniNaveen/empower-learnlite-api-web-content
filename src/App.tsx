import React from "react";
import { Outlet, Link } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 shadow bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            LearnLite
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
