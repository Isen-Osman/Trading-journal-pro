"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Vnesi username i password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Pogreshno username ili password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.08, 0.05], scale: [1, 1.2, 1] }}
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
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
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
          <h2 className="text-white text-xl font-semibold mb-1">Welcome back</h2>
          <p className="text-zinc-500 text-sm mb-7">Sign in to your account</p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: "auto", mb: 20 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 overflow-hidden text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 mb-7">
            <div>
              <label className="block text-zinc-500 text-xs tracking-widest uppercase mb-2">Username</label>
              <input
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-[#0d0d14] border border-zinc-800 focus:border-green-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-700 focus:ring-1 focus:ring-green-500/20"
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs tracking-widest uppercase mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-[#0d0d14] border border-zinc-800 focus:border-green-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-700 focus:ring-1 focus:ring-green-500/20"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black font-bold py-3 rounded-xl transition-all duration-200 tracking-widest uppercase text-sm shadow-lg shadow-green-500/10"
          >
            {loading ? (
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Signing in...
              </motion.span>
            ) : (
              "Sign In →"
            )}
          </motion.button>

          <p className="text-center mt-5 text-zinc-600 text-sm">
            No account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-green-500 hover:text-green-400 font-semibold transition-colors"
            >
              Register
            </button>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-zinc-700 text-xs tracking-widest"
        >
          BUILT WITH NEXT.JS + FASTAPI 🚀
        </motion.p>
      </motion.div>
    </div>
  );
}
