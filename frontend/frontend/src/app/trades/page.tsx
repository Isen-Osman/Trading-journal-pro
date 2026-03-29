"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getTrades, createTrade } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

export default function TradesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state aligned with backend TradeCreate schema
  const [formData, setFormData] = useState({
    symbol: "",
    side: "LONG",
    entry_price: 0,
    quantity: 1,
    status: "OPEN",
    exit_price: 0,
    emotion: "Neutral",
    notes: ""
  });

  const fetchData = async () => {
    if (!user || !user.loggedIn) return;
    setLoading(true);
    try {
      const data = await getTrades();
      setTrades(data);
    } catch (error: any) {
      console.error("Error fetching trades:", error.response?.data || error.message);
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

  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        symbol: formData.symbol,
        entry_price: formData.entry_price,
        quantity: formData.quantity,
        side: formData.side,
        status: formData.status,
        exit_price: formData.exit_price || null
      };
      
      await createTrade(payload);
      setShowModal(false);
      setFormData({
        symbol: "",
        side: "LONG",
        entry_price: 0,
        quantity: 1,
        status: "OPEN",
        exit_price: 0,
        emotion: "Neutral",
        notes: ""
      });
      fetchData();
    } catch (error: any) {
      console.error("Error creating trade:", error.response?.data || error.message);
      alert("Error creating trade: " + (error.response?.data?.detail || error.message));
    }
  };

  if (authLoading || (!user || !user.loggedIn)) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center font-mono">
        <p className="text-zinc-500 animate-pulse tracking-[0.5em]">AUTHENTICATING_</p>
      </div>
    );
  }

  const filteredTrades = trades.filter(t => {
    if (filter === "ALL") return true;
    const isWin = (t.exit_price && t.entry_price) ? (t.side === "LONG" ? t.exit_price > t.entry_price : t.exit_price < t.entry_price) : false;
    return filter === "WIN" ? isWin : !isWin;
  });

  return (
    <div className="min-h-screen bg-[#060608] text-white p-4 md:p-8 font-mono">

      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-6xl mx-auto relative z-10">

        {/* Header & Stats Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-black tracking-tighter mb-2">TRADE LOG_</h1>
            <p className="text-zinc-500 text-sm uppercase tracking-widest">History & Performance Analysis</p>
          </motion.div>

          <div className="flex gap-4">
            {["ALL", "WIN", "LOSS"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg border text-xs font-bold tracking-widest transition-all ${
                  filter === f 
                  ? "bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20" 
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trades", val: trades.length, color: "text-blue-400" },
            { label: "Open Trades", val: trades.filter(t => t.status === "OPEN").length, color: "text-white" },
            { label: "Symbols", val: new Set(trades.map(t => t.symbol)).size, color: "text-green-400" },
            { label: "Account Status", val: "ACTIVE", color: "text-emerald-400" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0d0d14] border border-zinc-800 p-4 rounded-xl"
            >
              <div className="text-[10px] text-zinc-600 uppercase mb-1">{s.label}</div>
              <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Table */}
        <div className="bg-[#0a0a0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0d0d14] border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Symbol</th>
                  <th className="px-6 py-4 font-medium">Side</th>
                  <th className="px-6 py-4 font-medium">Entry/Exit</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Quantity</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-zinc-600">Loading trades...</td>
                    </tr>
                  ) : filteredTrades.map((trade, i) => (
                    <motion.tr
                      key={trade.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(trade.created_at || Date.now()).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-white">{trade.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          trade.side === "LONG" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {trade.side}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 tabular-nums">
                        {trade.entry_price} <span className="text-zinc-700 mx-1">→</span> {trade.exit_price || "—"}
                      </td>
                      <td className={`px-6 py-4 font-bold tabular-nums ${
                        trade.status === "OPEN" ? "text-blue-400" : "text-zinc-500"
                      }`}>
                        {trade.status}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs italic">{trade.quantity}</td>
                      <td className="px-6 py-4">
                        <button className="text-zinc-700 hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && filteredTrades.length === 0 && (
            <div className="py-20 text-center text-zinc-600">
              <p className="text-sm">No trades found for this filter_</p>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 bg-green-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl shadow-green-500/40 flex items-center gap-2 z-50"
        >
          <span className="text-xl">+</span>
          <span className="text-xs uppercase tracking-tighter">New Trade</span>
        </motion.button>

        {/* Create Trade Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0d0d14] border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl"
              >
                <h2 className="text-xl font-black mb-6 uppercase tracking-tighter">Log New Trade_</h2>
                <form onSubmit={handleCreateTrade} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Symbol</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-[#060608] border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-green-500 outline-none"
                      value={formData.symbol}
                      onChange={e => setFormData({...formData, symbol: e.target.value})}
                      placeholder="e.g. BTC/USD"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Side</label>
                      <select 
                        className="w-full bg-[#060608] border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-green-500 outline-none"
                        value={formData.side}
                        onChange={e => setFormData({...formData, side: e.target.value})}
                      >
                        <option value="LONG">LONG</option>
                        <option value="SHORT">SHORT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Quantity</label>
                      <input 
                        type="number" 
                        required
                        step="0.0001"
                        className="w-full bg-[#060608] border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-green-500 outline-none"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Entry Price</label>
                      <input 
                        type="number" 
                        step="0.000001"
                        required
                        className="w-full bg-[#060608] border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-green-500 outline-none"
                        value={formData.entry_price}
                        onChange={e => setFormData({...formData, entry_price: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Status</label>
                      <select 
                        className="w-full bg-[#060608] border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-green-500 outline-none"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>
                  {formData.status === "CLOSED" && (
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Exit Price</label>
                      <input 
                        type="number" 
                        step="0.000001"
                        className="w-full bg-[#060608] border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-green-500 outline-none"
                        value={formData.exit_price}
                        onChange={e => setFormData({...formData, exit_price: parseFloat(e.target.value)})}
                      />
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-zinc-800 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-500 text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-400 transition-colors"
                    >
                      Confirm Trade
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
