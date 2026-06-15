import React from "react";
import { MarqueeData } from "../types";
import { Sparkles } from "lucide-react";

interface MarqueeSectionProps {
  data: MarqueeData;
}

export default function MarqueeSection({ data }: MarqueeSectionProps) {
  // Multiply items an EVEN number of times so the first half matches the second half seamlessly (for the -50% translation)
  const repeatedItems = data.items || [];
  const multipliedItems = [
    ...repeatedItems, ...repeatedItems, ...repeatedItems, ...repeatedItems, ...repeatedItems, 
    ...repeatedItems, ...repeatedItems, ...repeatedItems, ...repeatedItems, ...repeatedItems
  ];

  return (
    <section
      id="marquee-section"
      className="bg-black/30 backdrop-blur-md border-y border-white/5 py-8 overflow-hidden w-full select-none relative"
    >
      {/* Soft gradient mask on left and right edges for fade-out effect */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>

      <div className="flex animate-marquee whitespace-nowrap w-max items-center">
        {multipliedItems.map((item, idx) => (
          <React.Fragment key={`mq-${idx}`}>
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display-italic italic font-bold tracking-wide text-stone-200 px-8 hover:text-[#D4AF37] transition-colors duration-500 cursor-default">
              {item}
            </span>
            <span className="text-[#D4AF37] opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-8 sm:h-8">
                <path d="M12 2C12 7.52285 16.4772 12 22 12C16.4772 12 12 16.4772 12 22C12 16.4772 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" fill="currentColor"/>
              </svg>
            </span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
