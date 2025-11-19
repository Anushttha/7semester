"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MoodCarousel() {
  const outfits = ["/hello1.png", "/hello1.png", "/hello1.png"];

  return (
    <section className="py-16 px-4">
      <h2 className="text-3xl font-heading mb-6 text-center uppercase">
        Mood Looks
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {outfits.map((src, i) => (
          <motion.div
            key={i}
            className="relative min-w-[224px] h-[288px]"
            whileHover={{ scale: 1.1 }}
          >
            <Image
              src={src}
              alt={`Outfit ${i + 1}`}
              fill
              className="object-cover rounded-2xl border-2 border-gray-800 shadow-md"
              priority={i === 0}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
