import React from "react";
import { motion } from "motion/react";
import { Briefcase, Calendar, Star, Building2, Flame } from "lucide-react";
import { ExperienceData } from "../types";

interface ExperienceSectionProps {
  data: ExperienceData;
}

export default function ExperienceSection({ data }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="relative bg-transparent py-24 sm:py-32 px-6 sm:px-12 md:px-16 overflow-hidden border-t border-white/5 select-none fade-rise"
    >
      {/* Soft gradient blur balls matching target design standard */}
      <div className="absolute top-[30%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-15%] w-[40vw] h-[40vw] rounded-full bg-[#89AACC]/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-24 relative z-10">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-16 lg:mb-20">
          <div className="h-px w-8 bg-white/20"></div>
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-stone-500 font-bold">
            {data.heading || "KINH NGHIỆM LÀM VIỆC"}
          </span>
        </div>

        {/* Timeline Engine Layout */}
        <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-8 md:pl-16 flex flex-col gap-12 sm:gap-16">
          
          {/* Vertical dynamic highlight bar */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-[#89AACC] via-[#4E85BF] to-transparent origin-top"></div>

          {data.milestones.map((item, index) => {
            const isFreelance = index === 0;

            return (
              <motion.div
                key={item.role + index}
                initial={{ opacity: 0.15, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative group text-left"
              >
                {/* Glowing Active indicator node on the absolute left timeline track */}
                <span className="absolute -left-[41px] md:-left-[73px] top-1.5 w-6 h-6 rounded-full bg-[#0A0A0A] border-2 border-white/15 flex items-center justify-center transition-all duration-300 group-hover:border-[#89AACC] group-hover:scale-110 z-20">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#89AACC] opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"></span>
                  
                  {/* Subtle pulsing animation */}
                  <span className="absolute inset-0 rounded-full bg-[#89AACC]/20 scale-150 animate-ping opacity-0 group-hover:opacity-100"></span>
                </span>

                {/* Main Glass block container */}
                <div className="liquid-glass rounded-[28px] p-6 sm:p-8 hover:border-white/15 hover:bg-white/[0.03] transition-all duration-300 relative overflow-hidden">
                  
                  {/* Ambient top glow strip */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#89AACC]/40 to-transparent"></div>

                  {/* Top line with Timespan tag and Employer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    
                    {/* Time span tag */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] uppercase font-bold text-[#89AACC] tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.time}
                    </span>

                    {/* Quick project emblem */}
                    <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {isFreelance ? "UPWORK & FIVERR ELITE" : "TAROT MUSEUM PROJECT"}
                    </span>
                  </div>

                  {/* Row content */}
                  <h3 className="text-xl sm:text-2xl font-display-italic italic font-bold text-white tracking-wide mb-1">
                    {item.role}
                  </h3>

                  <div className="text-xs font-semibold text-stone-300 uppercase tracking-widest mb-4">
                    {item.employer}
                  </div>

                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light tracking-wide select-text">
                    {item.details}
                  </p>

                  {/* Highlights Pill */}
                  <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-2.5">
                    {isFreelance ? (
                      <>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#89AACC]/10 text-[#89AACC] border border-[#89AACC]/20 text-[10px] uppercase tracking-wider font-semibold font-mono">
                          <Flame className="w-3 h-3" /> Owen Fashion TVC
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10 text-[10px] uppercase tracking-wider font-semibold font-mono">
                          Hiệu quả Thương mại
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#89AACC]/10 text-[#89AACC] border border-[#89AACC]/20 text-[10px] uppercase tracking-wider font-semibold font-mono">
                          Talking Box Commercial
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10 text-[10px] uppercase tracking-wider font-semibold font-mono">
                          Sản xuất 4K Pipeline
                        </span>
                      </>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
