import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Award, Sparkles, Sliders, Music, Film, Layers } from "lucide-react";
import { SkillsData } from "../types";

interface ServicesSectionProps {
  data: SkillsData;
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const [hoveredSoftware, setHoveredSoftware] = useState<string | null>(null);

  // Helper colors for app-like soft glows on hover
  const getAppTheme = (name: string) => {
    switch (name) {
      case "Premiere Pro":
        return { initial: "Pr", color: "text-blue-400", border: "border-blue-500/30", bg: "rgba(0,10,60,0.5)", bar: "bg-blue-500" };
      case "After Effects":
        return { initial: "Ae", color: "text-purple-400", border: "border-purple-500/30", bg: "rgba(30,0,60,0.5)", bar: "bg-purple-500" };
      case "Photoshop":
        return { initial: "Ps", color: "text-sky-400", border: "border-sky-500/30", bg: "rgba(0,30,60,0.5)", bar: "bg-sky-500" };
      case "Illustrator":
        return { initial: "Ai", color: "text-amber-500", border: "border-amber-500/30", bg: "rgba(60,30,0,0.5)", bar: "bg-amber-500" };
      case "Figma":
        return { initial: "Fg", color: "text-rose-400", border: "border-rose-500/30", bg: "rgba(60,0,20,0.5)", bar: "bg-rose-500" };
      default:
        return { initial: "Pv", color: "text-white", border: "border-white/20", bg: "rgba(20,20,20,0.5)", bar: "accent-gradient" };
    }
  };

  return (
    <section
      id="skills"
      className="relative bg-transparent py-24 sm:py-32 px-6 sm:px-12 md:px-16 overflow-hidden border-t border-white/5 select-none fade-rise"
    >
      {/* Visual background lights */}
      <div className="absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#8EADCC]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-24 relative z-10">
        
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-16 lg:mb-20">
          <div className="h-px w-8 bg-white/20"></div>
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-stone-500 font-bold">
            {data.heading || "CHUYÊN MÔN / SKILLS DASHBOARD"}
          </span>
        </div>

        {/* Dashboard 3-part layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Card 1: Software suite (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-[32px] liquid-glass">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-display-italic italic text-white leading-none mb-1">
                    Hệ sinh thái Phần mềm
                  </h3>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500">
                    Sản xuất, dựng phim & phát triển giao diện
                  </p>
                </div>
                <Award className="w-5 h-5 text-[#89AACC] opacity-75 animate-bounce" />
              </div>

              {/* Grid of app icons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 my-8">
                {data.software.map((app) => {
                  const style = getAppTheme(app.name);
                  const isHovered = hoveredSoftware === app.name;

                  return (
                    <div
                      key={app.name}
                      onMouseEnter={() => setHoveredSoftware(app.name)}
                      onMouseLeave={() => setHoveredSoftware(null)}
                      className={`relative aspect-square rounded-2xl border ${
                        isHovered ? style.border : "border-white/5 bg-white/[0.02]"
                      } transition-all duration-300 flex flex-col items-center justify-center p-3 cursor-pointer group`}
                      style={{
                        backgroundColor: isHovered ? style.bg : "transparent",
                        transform: isHovered ? "scale(1.08)" : "scale(1)",
                      }}
                    >
                      {/* App Initial Emblem */}
                      <span className={`text-2xl sm:text-3xl font-extrabold tracking-tighter ${style.color} select-none transition-transform duration-300 group-hover:scale-110`}>
                        {style.initial}
                      </span>
                      
                      <span className="text-[10px] text-stone-400 font-semibold mt-2 text-center truncate w-full">
                        {app.name}
                      </span>

                      {/* Display active percentage pill on card inside */}
                      {isHovered && (
                        <div className="absolute top-[6px] right-[6px] bg-white/10 border border-white/10 rounded-full px-1.5 py-0.5 text-[9px] font-mono text-white">
                          {app.percentage}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Interactive Percentage Bar Display */}
            <div className="h-16 pt-4 border-t border-white/5 flex flex-col justify-end">
              {hoveredSoftware ? (
                <div className="w-full">
                  {data.software.filter(app => app.name === hoveredSoftware).map(app => {
                    const style = getAppTheme(app.name);
                    return (
                      <div key={app.name} className="animate-role-fade-in w-full">
                        <div className="flex justify-between items-center text-xs font-mono text-stone-300 mb-2">
                          <span className="uppercase tracking-wider">Hiệu suất sử dụng: {app.name}</span>
                          <span className="font-bold text-white">{app.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${app.percentage}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full ${style.bar} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-stone-500 font-mono italic animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#89AACC]" />
                  <span>Rê chuột lên biểu tượng để hiển thị mức độ chuyên sâu...</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Specialty Formats (Col span 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] liquid-glass flex flex-col justify-between">
            <div className="mb-6">
              <h3 className="text-xl font-display-italic italic text-white leading-none mb-1">
                Sở trường Định dạng
              </h3>
              <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500">
                Hiệu quả tối đa cho từng kênh truyền thông
              </p>
            </div>

            <div className="flex flex-col gap-3 py-2">
              {data.formats.map((format, i) => (
                <div
                  key={format.name}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 flex items-start gap-3.5 group"
                >
                  <div className="w-4 h-4 rounded-full border border-[#89AACC]/40 flex items-center justify-center p-0.5 mt-0.5 group-hover:scale-110 group-hover:border-[#89AACC] transition-all">
                    <div className="w-full h-full rounded-full bg-[#89AACC] scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-stone-100 tracking-wide mb-1">
                      {format.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                      {format.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Part 3: Core Strengths (3 Column Banner below) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-8 lg:mt-12">
          {data.coreStrengths.map((strength, i) => {
            const getIcon = (idx: number) => {
              switch (idx) {
                case 0: return <Film className="w-5 h-5 text-blue-400" />;
                case 1: return <Layers className="w-5 h-5 text-purple-400" />;
                case 2: return <Music className="w-5 h-5 text-[#89AACC]" />;
                default: return <Sliders className="w-5 h-5 text-white" />;
              }
            };

            return (
              <div
                key={strength.title}
                className="p-6 rounded-[24px] liquid-glass hover:border-white/15 transition-all duration-300 flex flex-col text-left class-interactive"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white">
                  {getIcon(i)}
                </div>
                <h4 className="text-sm font-semibold uppercase text-white tracking-widest mb-2">
                  {strength.title}
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  {strength.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
