"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TICKERS = [
  { symbol: "BTC/USD", price: "67,432.10", change: "+2.34%", up: true },
  { symbol: "ETH/USD", price: "3,521.88", change: "+1.12%", up: true },
  { symbol: "AAPL", price: "189.45", change: "-0.87%", up: false },
  { symbol: "TSLA", price: "245.32", change: "+4.21%", up: true },
  { symbol: "SPY", price: "521.67", change: "-0.23%", up: false },
  { symbol: "NVDA", price: "875.20", change: "+3.67%", up: true },
  { symbol: "GLD", price: "187.34", change: "+0.45%", up: true },
  { symbol: "EUR/USD", price: "1.0823", change: "-0.12%", up: false },
];

const STATS = [
  { label: "Win Rate", value: "68.4%", sub: "last 30 days" },
  { label: "Avg R:R", value: "2.3x", sub: "risk/reward" },
  { label: "Total PnL", value: "+$12,430", sub: "this month" },
  { label: "Trades", value: "247", sub: "tracked" },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  const [transitioning, setTransitioning] = useState(false);

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

  const navigateTo = (path: string) => {
    setTransitioning(true);
    setTimeout(() => router.push(path), 500);
  };

  // Variants за анимација на листата со картички
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white overflow-x-hidden relative">

      {/* Плав/Зелен сјај што пулсира во позадина */}
      <motion.div
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[100px]" />
      </motion.div>

      {/* Транзициски Overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Top Ticker Bar */}
      <div className="border-b border-zinc-800/50 bg-[#0a0a0e]/80 backdrop-blur-md sticky top-0 z-40 overflow-hidden">
        <div className="flex">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 px-4 py-2 whitespace-nowrap"
          >
            {[...TICKERS, ...TICKERS].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-mono border-r border-zinc-800/50 pr-8">
                <span className="text-zinc-500">{t.symbol}</span>
                <span className="text-white font-bold">{t.price}</span>
                <span className={t.up ? "text-green-400" : "text-red-400"}>{t.change}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800/30 relative z-10">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
            📊
          </div>
          <span className="font-mono font-bold text-sm tracking-tighter uppercase">
            TradingJournal<span className="text-green-400 font-black">PRO</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-6"
        >
          <span className="font-mono text-[10px] text-zinc-500 hidden md:block tracking-widest">
            {mounted ? time : "00:00:00"} UTC
          </span>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            <span className="text-[10px] text-zinc-400 font-mono font-bold tracking-widest">SYSTEM ONLINE</span>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 pt-24 pb-20 relative z-10">

        {/* Animated Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-full px-5 py-2 backdrop-blur-sm">
            <span className="text-green-400 text-[10px] font-mono tracking-[0.3em] uppercase">
              Engineered for Alpha
            </span>
          </div>
        </motion.div>

        {/* Title со Reveal ефект */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-mono font-black leading-[0.9] mb-4 text-5xl md:text-8xl tracking-tighter"
          >
            STOP GUESSING.
          </motion.h1>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-mono font-black leading-[0.9] text-5xl md:text-8xl tracking-tighter"
            style={{
              background: "linear-gradient(to right, #00ff88, #00aaff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            START KNOWING.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-zinc-500 text-lg max-w-xl mx-auto mb-14 font-mono leading-relaxed"
        >
          The only journal that tracks your <span className="text-white">emotions</span> as closely as your <span className="text-white">PnL</span>.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/register")}
            className="w-full sm:w-auto bg-green-500 text-black font-mono font-black px-10 py-5 rounded-xl text-sm tracking-widest uppercase transition-colors"
          >
            Initialize Account →
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("/login")}
            className="w-full sm:w-auto font-mono font-bold px-10 py-5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all text-sm tracking-widest uppercase"
          >
            Sign In
          </motion.button>
        </div>

        {/* Stats Row with Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-[#0e0e16]/50 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/30 transition-colors group"
            >
              <div className="font-mono font-black text-3xl text-green-400 mb-1 group-hover:scale-110 transition-transform origin-left">{s.value}</div>
              <div className="text-white text-xs font-bold mb-1 tracking-widest uppercase">{s.label}</div>
              <div className="text-zinc-600 text-[10px] font-mono uppercase">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Terminal Preview со „Typing“ анимација */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#0a0a0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#0d0d14]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">system_log // v2.0.4</span>
            <div className="w-12" />
          </div>

          <div className="p-8 font-mono text-[11px] overflow-x-auto">
            <div className="flex gap-6 text-zinc-600 mb-5 uppercase tracking-[0.2em] border-b border-zinc-800/50 pb-4">
              <span className="w-24">Asset</span>
              <span className="w-16">Side</span>
              <span className="w-24">Entry</span>
              <span className="w-20">Net PnL</span>
              <span className="w-24">Psychology</span>
              <span className="w-12">R:R</span>
            </div>
            {[
              { symbol: "BTC/USD", type: "LONG", entry: "64,200", pnl: "+$3,200", emotion: "😌 NEUTRAL", rr: "2.4", up: true },
              { symbol: "AAPL", type: "SHORT", entry: "192.50", pnl: "+$430", emotion: "😤 IMPATIENT", rr: "1.8", up: true },
              { symbol: "ETH/USD", type: "LONG", entry: "3,480", pnl: "-$90", emotion: "😨 ANXIOUS", rr: "0.6", up: false },
              { symbol: "NVDA", type: "LONG", entry: "820.00", pnl: "+$552", emotion: "😌 DISCIPLINED", rr: "3.1", up: true },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 py-4 border-b border-zinc-800/30 hover:bg-green-500/[0.02] transition-colors group"
              >
                <span className="w-24 text-white font-bold group-hover:text-green-400 transition-colors">{t.symbol}</span>
                <span className={`w-16 font-bold ${t.type === "LONG" ? "text-green-500/70" : "text-red-500/70"}`}>{t.type}</span>
                <span className="w-24 text-zinc-500 tracking-tighter">{t.entry}</span>
                <span className={`w-20 font-mono font-bold ${t.up ? "text-green-400" : "text-red-400"}`}>{t.pnl}</span>
                <span className="w-24 text-zinc-400 text-[10px]">{t.emotion}</span>
                <span className="w-12 text-zinc-600">{t.rr}</span>
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mt-6 text-green-500 font-bold"
            >
              &gt; awaiting new trade data... _
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#08080c]">
        <span className="font-mono text-[10px] text-zinc-600 tracking-[0.4em] uppercase">Trading Journal Pro © 2024</span>
        <div className="flex gap-8">
          <span className="font-mono text-[10px] text-zinc-700 hover:text-zinc-400 cursor-pointer transition-colors uppercase tracking-widest">Privacy</span>
          <span className="font-mono text-[10px] text-zinc-700 hover:text-zinc-400 cursor-pointer transition-colors uppercase tracking-widest">Terms</span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Built with Next.js + FastAPI</span>
        </div>
      </footer>
    </div>
  );
}