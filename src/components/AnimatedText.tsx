import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedText({ text, className = "", style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const totalChars = text.length;
  let charCumulativeIndex = 0;

  const words = text.split(" ");

  return (
    <p
      ref={containerRef}
      className={`${className} flex flex-wrap justify-center text-center leading-relaxed h-fit`}
      style={style}
    >
      {words.map((word, wordIdx) => {
        const characters = word.split("");
        
        return (
          <span key={wordIdx} className="inline-flex flex-row whitespace-nowrap">
            {characters.map((char, charIdx) => {
              const charIndex = charCumulativeIndex;
              charCumulativeIndex++;

              const rangeStart = charIndex / totalChars;
              const rangeEnd = Math.min(1.0, (charIndex + 5) / totalChars);

              const opacity = useTransform(scrollYProgress, [rangeStart, rangeEnd], [0.2, 1.0]);

              return (
                <span key={charIdx} className="relative inline-block select-none">
                  <span className="invisible">{char}</span>
                  <motion.span style={{ opacity }} className="absolute inset-0 select-none">
                    {char}
                  </motion.span>
                </span>
              );
            })}
            
            {wordIdx < words.length - 1 && (
              <span className="inline-block" style={{ width: "0.26em" }}>
                &nbsp;
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
}
