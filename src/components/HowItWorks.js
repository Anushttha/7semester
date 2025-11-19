"use client";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { step: "1", text: "Upload your photo and let AI detect your body type." },
    { step: "2", text: "Get outfit recommendations based on your mood and occasion." },
    { step: "3", text: "Try them on virtually and shop instantly on Aazmaao." },
  ];

  return (
    <section className="py-16 px-6 text-center bg-gradient-to-b from-black via-gray-900 to-black">
      <h2 className="text-3xl font-heading mb-10 uppercase">How It Works</h2>
      <div className="flex flex-col gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className="text-lg font-body text-gray-300"
          >
            <span className="text-neon font-bold">{s.step}.</span> {s.text}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
