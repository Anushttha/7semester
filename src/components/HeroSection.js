"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex flex-col justify-center items-center text-center h-screen relative">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-heading font-bold bg-gradient-to-r from-emerald to-neon text-transparent bg-clip-text uppercase"
      >
        Your Style. Your Mood. Your AI Stylist.
      </motion.h1>

      <motion.img
        src="/hello1.png"
        alt="AI Avatar"
        className="mt-8 w-64 h-64 object-cover rounded-full shadow-lg border-4 border-emerald"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      />

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="mt-10">
        <Link
          href="/signup"
          className="px-8 py-4 bg-gradient-glow rounded-full font-semibold text-lg shadow-lg hover:shadow-neon"
        >
          Try with AI
        </Link>
      </motion.div>
    </section>
  );
}
