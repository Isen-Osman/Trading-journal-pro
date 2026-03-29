"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const { register, setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Popolni gi site polja");
      return;
    }
    if (password !== confirmPassword) {
      setError("Lozinkite ne se isti");
      return;
    }
    if (password.length < 8) {
      setError("Lozinkata mora da ima najmalku 8 karakteri");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await register(username, email, password);

      // Optionally auto-login if backend returns token on register
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        setUser({
          username: username,
          email: email,
          loggedIn: true
        });
        setIsExiting(true);
        setTimeout(() => router.push("/dashboard"), 500);
      } else {
        // Just redirect to login if no auto-login
        router.push("/login");
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Registracijata ne uspea. Probaj pak.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.07, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-green-500/20">
              📊
            </div>
            <span className="text-white font-bold text-lg tracking-widest uppercase">
              Trading Journal
            </span>
          </motion.div>
          <p className="text-zinc-600 text-xs tracking-widest uppercase">
            Track · Analyze · Improve
          </p>
        </div>

        <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-semibold mb-1">Create account</h2>
          <p className="text-zinc-500 text-sm mb-7">Start tracking your trades today</p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 overflow-hidden text-red-400 text-xs"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 mb-7">
            <div>
              <label className="block text-zinc-500 text-[10px] tracking-widest uppercase mb-2 font-bold">Username</label>
              <input
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0d0d14] border border-zinc-800 focus:border-green-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-700 focus:ring-1 focus:ring-green-500/20"
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-[10px] tracking-widest uppercase mb-2 font-bold">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0d14] border border-zinc-800 focus:border-green-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-700 focus:ring-1 focus:ring-green-500/20"
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-[10px] tracking-widest uppercase mb-2 font-bold">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0d14] border border-zinc-800 focus:border-green-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-700 focus:ring-1 focus:ring-green-500/20"
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-[10px] tracking-widest uppercase mb-2 font-bold">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                className={`w-full bg-[#0d0d14] border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-700 ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-zinc-800 focus:border-green-500"
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-[10px] mt-1 font-bold italic">Lozinkite ne se isti!</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegister}
            disabled={loading || isExiting}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black font-black py-4 rounded-xl transition-all duration-200 tracking-widest uppercase text-xs shadow-lg shadow-green-500/10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                 Creating...
              </span>
            ) : "Create Account →"}
          </motion.button>

          <p className="text-center mt-6 text-zinc-600 text-xs font-medium">
            Already have account?{" "}
            <button
              onClick={() => {
                setIsExiting(true);
                setTimeout(() => router.push("/login"), 400);
              }}
              className="text-green-500 hover:text-green-400 font-bold transition-colors"
            >
              Login
            </button>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-zinc-800 text-[10px] tracking-[0.3em] font-bold"
        >
          NEXT.JS + FASTAPI STACK
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
