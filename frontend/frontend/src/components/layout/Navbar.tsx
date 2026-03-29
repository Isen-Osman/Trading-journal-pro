"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user || !user.loggedIn) return null;

  return (
    <nav className="bg-[#0a0a0e] border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-[10px] font-black text-black">
            📊
          </div>
          <span className="font-mono font-bold text-xs tracking-tighter uppercase hidden sm:block">
            TradingJournal<span className="text-green-500">PRO</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/trades" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Trade Log
          </Link>
          <Link href="/analytics" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Analytics
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">
            {user.username || "Trader"}
          </span>
          <span className="text-[8px] text-green-500 font-bold uppercase tracking-[0.2em]">
            Online
          </span>
        </div>
        
        <button 
          onClick={logout}
          className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white hover:border-red-500/50 transition-all uppercase tracking-widest"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
