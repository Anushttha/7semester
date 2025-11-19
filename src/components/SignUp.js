"use client";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-heading mb-8 bg-gradient-glow text-transparent bg-clip-text">Join Aazmaao</h1>
      <form className="flex flex-col gap-4 w-80">
        <input className="p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-neon outline-none" placeholder="Email" />
        <input className="p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-neon outline-none" placeholder="Password" type="password" />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 bg-gradient-glow py-3 rounded-full font-semibold shadow-lg">Sign Up</motion.button>
      </form>
    </div>
  );
}
