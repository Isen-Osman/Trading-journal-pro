"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard" },
  { icon: "📈", label: "Trade Log", path: "/trades" },
  { icon: "📊", label: "Analytics", path: "/analytics" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user || !user.loggedIn) return null;

  return (
    <nav className="fixed left-0 top-0 h-full w-16 hover:w-56 bg-[#0a0a0e]/95 border-r border-zinc-800/50 backdrop-blur-md z-50 flex flex-col items-start py-6 px-3 gap-1 transition-all duration-300 group/nav overflow-hidden shadow-2xl">
      
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-8 px-1 w-full">
        <div className="w-8 h-8 min-w-[32px] bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 text-sm">
          📊
        </div>
        <span className="font-mono font-bold text-xs tracking-tighter uppercase whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200">
          Journal<span className="text-green-400">PRO</span>
        </span>
      </Link>

      {/* Nav items */}
      <div className="flex flex-col gap-1 w-full">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className={`flex items-center gap-3 w-full px-1 py-3 rounded-xl transition-all group/item
              ${pathname === item.path
                ? "bg-green-500/10 text-green-400"
                : "hover:bg-green-500/10 hover:text-green-400 text-zinc-500"
              }`}
          >
            <span className="text-base min-w-[32px] text-center">{item.icon}</span>
            <span className="font-mono text-xs font-bold tracking-widest uppercase whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200">
              {item.label}
            </span>
            {pathname === item.path && (
              <div className="ml-auto w-1 h-4 bg-green-400 rounded-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
            )}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full border-t border-zinc-800/50 my-4" />

      {/* User Info */}
      <div className="flex items-center gap-3 w-full px-1 py-2 mb-2">
        <div className="w-8 h-8 min-w-[32px] bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-green-500">
          {user.username?.substring(0, 2).toUpperCase() || "TR"}
        </div>
        <div className="flex flex-col opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200 overflow-hidden">
          <span className="text-[10px] font-black text-white uppercase truncate">
            {user.username || "Trader"}
          </span>
          <span className="text-[8px] text-green-500 font-bold uppercase tracking-[0.2em]">
            Online
          </span>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="flex items-center gap-3 w-full px-1 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
      >
        <span className="text-base min-w-[32px] text-center">🚪</span>
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200">
          Logout
        </span>
      </button>

      {/* Time at bottom */}
      <div className="mt-auto px-1 flex items-center gap-2 w-full">
        <div className="w-1.5 h-1.5 min-w-[6px] bg-green-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
        <span className="font-mono text-[9px] text-zinc-600 whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200 tracking-widest">
          {mounted ? time : "00:00:00"} UTC
        </span>
      </div>
    </nav>
  );
}
