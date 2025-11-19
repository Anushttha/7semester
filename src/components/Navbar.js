"use client";
import { FaHome, FaUserAlt, FaShoppingBag, FaTshirt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Navbar() {
  const icons = [FaHome, FaTshirt, FaShoppingBag, FaUserAlt];
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 flex justify-around w-11/12 max-w-md rounded-2xl py-3 shadow-lg">
      {icons.map((Icon, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="text-white text-2xl"
        >
          <Icon />
        </motion.button>
      ))}
    </nav>
  );
}
