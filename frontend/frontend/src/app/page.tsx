"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">

      {/* TITLE */}
      <h1 className="text-5xl font-bold mb-6">
        Trading Journal Pro 📊
      </h1>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-lg mb-10 text-center max-w-xl">
        Track your trades, analyze performance, and become a disciplined trader.
      </p>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <Link href="/login">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl">
            Register
          </button>
        </Link>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-5 text-gray-500 text-sm">
        Built with Next.js + FastAPI 🚀
      </div>
    </div>
  );
}