import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Code, Palette, Smartphone, Sparkles, ChevronRight } from "lucide-react";
import { AboutData } from "../types";

interface AboutSectionProps {
  data: AboutData;
  onScrollTo: (selector: string) => void;
}

export default function AboutSection({ data, onScrollTo }: AboutSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // Handle 3D Tilting coordinate tracker based on mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate maximum +/- 15 degrees
    const rotateX = ((centerY - y) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section
      id="about"
      className="relative min-h-screen bg-transparent py-24 sm:py-32 px-6 sm:px-12 md:px-16 flex flex-col justify-center items-center overflow-hidden border-t border-white/5 fade-rise"
    >
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#4E85BF]/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#89AACC]/5 blur-[120px] pointer-events-none z-0"></div>

      {/* Modern Floating Depth Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Floating Smile Graphic */}
        <div className="absolute bottom-[10%] left-[5%] animate-float-slow drop-shadow-[0_0_30px_rgba(219,39,119,0.3)] opacity-70" style={{ transform: 'translateZ(50px)' }}>
             <div className="flex items-center justify-center w-28 h-28 rounded-full border border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md shadow-[inset_0_0_20px_rgba(107,33,168,0.5)]">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
            </div>
        </div>

        {/* Floating Cursor/Arrow Graphic */}
        <div className="absolute top-[30%] right-[5%] animate-float-fast drop-shadow-[0_0_40px_rgba(219,39,119,0.3)] opacity-60" style={{ animationDelay: '1.5s', transform: 'translateZ(80px)' }}>
             <div className="flex items-center justify-center w-28 h-28 rounded-full border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md shadow-[inset_0_0_30px_rgba(99,102,241,0.5)] -skew-x-[12deg] rotate-[25deg]">
               <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>
            </div>
        </div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-24 relative z-10">
        
        {/* Header Label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px w-8 bg-white/20"></div>
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-stone-500 font-bold">
            {data.heading}
          </span>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive 3D Perspective Portrait */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div
              className="relative w-full max-w-[420px] aspect-[4/5] perspective-1000 cursor-grab active:cursor-grabbing group mx-auto mb-8 lg:mb-0"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                className="w-full h-full relative"
                animate={{
                  rotateX: rotate.x,
                  rotateY: rotate.y,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Decorative Brackets Frame (Background Layer) */}
                <div 
                  className="absolute inset-0 z-0 bg-[#080808]"
                  style={{ transform: "translateZ(-10px)" }}
                >
                  <div className="absolute -top-5 -left-5 w-16 h-16 border-t-[1.5px] border-l-[1.5px] border-[#D4AF37]/50 z-0 transition-all duration-300 group-hover:border-[#D4AF37]"></div>
                  <div className="absolute -bottom-5 -right-5 w-16 h-16 border-b-[1.5px] border-r-[1.5px] border-[#D4AF37]/50 z-0 transition-all duration-300 group-hover:border-[#D4AF37]"></div>
                </div>

                {/* Main Image Container (White Frame effect) */}
                <div 
                  className="absolute inset-0 bg-[#E8E8E8] sm:p-2.5 p-2 shadow-2xl flex flex-col"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <div className="relative w-full h-full overflow-hidden bg-[#1A1A1A]">
                    
                    {/* Original Background and Portrait Image */}
                    <div 
                      className="absolute inset-0 w-full h-full z-0"
                      style={{ transform: "translateZ(-10px)" }}
                    >
                      <img
                        src={data.interactiveImg}
                        alt="Phúc Vương"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:opacity-0 mix-blend-overlay"></div>
                    </div>

                    {/* Orbiting Icons */}
                    <div className="absolute top-[40%] left-1/2 w-0 h-0 z-20 pointer-events-none">
                      <motion.div
                        className="absolute top-0 left-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                      >
                        {/* AE Element */}
                        <div className="absolute" style={{ transform: "translate(-110px, -70px)" }}>
                          <motion.img
                            src="/assets/AE.png"
                            alt="After Effects"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_20px_rgba(153,0,255,0.6)]"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                        
                        {/* DaVinci Element */}
                        <div className="absolute" style={{ transform: "translate(90px, -30px)" }}>
                          <motion.img
                            src="/assets/davinci-resolve.png"
                            alt="DaVinci Resolve"
                            className="w-12 h-12 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                          />
                        </div>

                        {/* Capcut Element */}
                        <div className="absolute" style={{ transform: "translate(-30px, 120px)" }}>
                          <motion.img
                            src="/assets/Capcut.png"
                            alt="CapCut"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </motion.div>
                    </div>

                  </div>
                </div>

                {/* Hover Helper Text */}
                <div 
                  className="absolute top-6 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" 
                  style={{ transform: "translateZ(20px)" }}
                >
                  <span className="text-[7px] font-mono tracking-[0.2em] text-white/50 bg-black/40 backdrop-blur-md px-2 py-0.5 uppercase">
                    3D INTERACTIVE VIEW
                  </span>
                </div>

                {/* Dark Floating Nameplate at Bottom Center */}
                <div 
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[260px] z-30"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 flex flex-col items-center justify-center text-center py-4 px-6 shadow-2xl">
                    <span className="text-[22px] font-display-italic italic font-semibold text-white tracking-wide mb-1.5 drop-shadow-md whitespace-nowrap">
                      Phúc Vương
                    </span>
                    <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-[0.3em] text-[#D4AF37] font-semibold flex items-center gap-2">
                      VIDEO EDITOR
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Text & Cards */}
          <div className="lg:col-span-7 text-left">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-display-italic italic font-bold tracking-tight text-white mb-6"
            >
              Nghệ thuật kể chuyện phim ảnh
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 0.9, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8 font-light tracking-wide"
            >
              {data.paragraph}
            </motion.p>

            {/* Link trigger to Contact */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-8"
            >
              <button
                onClick={() => onScrollTo("#contact")}
                className="group inline-flex items-center gap-2 text-xs font-bold text-[#89AACC] uppercase tracking-widest hover:text-white transition-colors cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#89AACC]/30 hover:after:bg-white after:transition-colors hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>{data.contactCta}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
