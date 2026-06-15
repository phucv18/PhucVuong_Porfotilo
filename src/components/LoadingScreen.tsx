import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["SÁNG TẠO", "NHỊP ĐIỆU", "CẢM XÚC", "ĐỘT PHÁ"];

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2500; // Count over 2500ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      const progressPercentage = Math.min(progress / duration, 1);
      const currentCount = Math.floor(progressPercentage * 100);

      setCount(currentCount);

      if (progressPercentage < 1) {
        requestAnimationFrame(step);
      } else {
        // Hold on 100 for a split second, then finish
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    requestAnimationFrame(step);
  }, [onComplete]);

  // Rotate terms every 700ms
  useEffect(() => {
    const termTimer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 700);
    return () => clearInterval(termTimer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-[9999] flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none overflow-hidden">
      {/* Top Left Label */}
      <div className="flex justify-between items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xs text-stone-500 uppercase tracking-[0.3em] font-mono"
        >
          STUDIO PORTFOLIO // SHOWCASE ©2026
        </motion.div>
        
        <div className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
          PHÚC VƯƠNG — CINEMATIC STORYTELLING
        </div>
      </div>

      {/* Center Word Rotator */}
      <div className="relative flex justify-center items-center h-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(5px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-display-italic text-stone-200 uppercase tracking-wider text-center"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Counter & Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
          </div>

          <div className="text-7xl sm:text-8xl md:text-9xl font-display-italic text-white tabular-nums leading-none tracking-tighter">
            {String(count).padStart(3, "0")}
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="h-[2px] w-full bg-stone-900 overflow-hidden relative">
          <motion.div
            className="h-full absolute left-0 top-0 origin-left accent-gradient"
            style={{ width: `${count}%` }}
            transition={{ type: "tween", ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
