"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAnalyticsSummary, getTrades } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user || !user.loggedIn) return;
    setLoading(true);
    try {
      const [summaryData, tradesData] = await Promise.all([
        getAnalyticsSummary(),
        getTrades()
      ]);
      setSummary(summaryData);
      setRecentTrades(tradesData.slice(0, 4));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || !user.loggedIn)) {
      router.push("/login");
    } else if (!authLoading && user?.loggedIn) {
      fetchData();
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user || !user.loggedIn)) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center font-mono">
        <p className="text-zinc-500 animate-pulse tracking-[0.5em]">AUTHENTICATING_</p>
      </div>
    );
  }

  const STATS = [
    { label: "Total PnL", value: `$${summary?.total_pnl?.toFixed(2) || "0.00"}`, change: "All Time", up: (summary?.total_pnl || 0) >= 0 },
    { label: "Win Rate", value: `${summary?.total_trades > 0 ? ((summary.win_trades / summary.total_trades) * 100).toFixed(1) : 0}%`, change: `${summary?.win_trades || 0} Wins`, up: true },
    { label: "Total Trades", value: summary?.total_trades || 0, change: "Logged", up: true },
    { label: "Losses", value: summary?.loss_trades || 0, change: "Trades", up: false },
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-white p-4 md:p-8 font-mono">

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-black tracking-tighter uppercase">Command Center_</h1>
            <p className="text-zinc-500 text-xs tracking-[0.2em]">Welcome back, {user?.username}</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/trades")}
            className="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-xl text-xs font-bold hover:border-green-500/50 transition-colors"
          >
            VIEW FULL LOG →
          </motion.button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0d0d14] border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors group"
            >
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-black tabular-nums">{stat.value}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  stat.up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="w-full h-[1px] bg-zinc-800 mt-4 group-hover:bg-green-500/30 transition-colors" />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Chart Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-[#0d0d14] border border-zinc-800 rounded-2xl p-6 min-h-[400px] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Equity Curve</h2>
              <div className="flex gap-2 text-[10px]">
                {["1D", "1W", "1M", "ALL"].map(t => (
                  <button key={t} className="px-2 py-1 hover:text-green-400 transition-colors">{t}</button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full bg-gradient-to-t from-green-500/[0.02] to-transparent rounded-xl border border-dashed border-zinc-800/50 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-zinc-700 text-xs italic uppercase tracking-[0.5em]">Chart Engine Ready_</span>
                </motion.div>
                <div className="w-full h-full flex items-end px-4 pb-4 gap-1">
                    {loading ? (
                       <div className="w-full h-full flex items-center justify-center">
                          <p className="text-zinc-800 text-[10px]">Loading visualization...</p>
                       </div>
                    ) : (
                      [40, 70, 45, 90, 65, 80, 50, 100, 85, 110].map((h, i) => (
                          <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ delay: 0.6 + (i * 0.05), duration: 1 }}
                              className="flex-1 bg-green-500/20 border-t border-green-500/40 rounded-t-sm"
                          />
                      ))
                    )}
                </div>
            </div>
          </motion.div>

          {/* Sidebar: Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0d0d14] border border-zinc-800 rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Latest Trades</h2>
            <div className="space-y-6">
              {loading ? (
                <p className="text-zinc-600 text-xs">Loading activity...</p>
              ) : recentTrades.length > 0 ? (
                recentTrades.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${(item.pnl || 0) >= 0 ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <p className="text-xs font-bold">{item.symbol}</p>
                        <p className="text-[10px] text-zinc-600 uppercase">{item.side}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold ${(item.pnl || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {(item.pnl || 0) >= 0 ? `+${item.pnl}` : item.pnl}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-700 text-[10px]">No recent trades logged_</p>
              )}
            </div>

            <button 
              onClick={() => router.push("/trades")}
              className="w-full mt-10 py-3 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
            >
               Analyze All Logs
            </button>
          </motion.div>

        </div>

        {/* Floating Background Text */}
        <div className="fixed bottom-10 left-10 opacity-[0.02] select-none pointer-events-none">
          <h1 className="text-9xl font-black">ALPHA</h1>
        </div>
      </div>
    </div>
  );
}
