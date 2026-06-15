import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hls from "hls.js";
import { HeroData } from "../types";

interface HeroSectionProps {
  data: HeroData;
  onScrollTo: (selector: string) => void;
}

export default function HeroSection({ data, onScrollTo }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);

  // Monitor scroll height to apply beautiful pill shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize and load the high-fidelity HLS Mux video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log("HLS auto-play blocked", err));
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari fallback
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => console.log("Native streams blocked", err));
      });
    }
  }, []);

  // Rotate hero tag roles every 2000ms
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % data.roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [data.roles]);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between bg-transparent overflow-hidden select-none"
    >
      {/* FLOATING NAVBAR PILL */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-flex items-center rounded-full transition-all duration-500 border ${
            isScrolled
              ? "bg-[#0E0E0E]/90 border-white/10 backdrop-blur-xl shadow-2xl shadow-black/60 px-5 py-2.5"
              : "bg-white/5 border-white/5 backdrop-blur-md px-6 py-3"
          }`}
        >
          {/* logo ring */}
          <button
            onClick={() => onScrollTo("#hero")}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 border border-white/15 overflow-hidden transition-all duration-300 hover:scale-110 mr-3 cursor-pointer"
          >
            <span className="absolute inset-0 bg-stone-950 rounded-full transition-all duration-300 group-hover:scale-0"></span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 accent-gradient transition-all duration-300 rounded-full z-0 animate-pulse"></span>
            <span className="relative z-10 font-display-italic italic font-bold text-xs text-white group-hover:text-black">
              PV
            </span>
          </button>

          <span className="w-px h-5 bg-white/10 mr-4 hidden sm:block"></span>

          {/* nav links */}
          <div className="flex items-center gap-1 sm:gap-2 mr-3 sm:mr-4">
            {data.navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onScrollTo(link.anchor)}
                className="text-xs font-semibold text-stone-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all cursor-pointer uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}
          </div>

          <span className="w-px h-5 bg-white/10 mr-3 sm:mr-4"></span>

          {/* dynamic hi button */}
          <button
            onClick={() => onScrollTo("#contact")}
            className="relative group inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold text-white uppercase tracking-widest cursor-pointer overflow-hidden border border-white/20 hover:border-transparent transition-all"
          >
            <span className="absolute inset-0 accent-gradient scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></span>
            <span className="relative z-10 flex items-center gap-1 group-hover:text-black transition-colors duration-300">
              CÙNG TRÒ CHUYỆN 🚀
            </span>
          </button>
        </motion.div>
      </div>

      {/* CORE HERO INTERACTIVE CONTENT */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-24 flex flex-col justify-center items-center text-center z-20 relative pt-24 md:pt-32">
        {/* Display Title (Name) */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-8xl md:text-9xl font-display-italic italic leading-none tracking-tighter text-white mb-6 uppercase"
        >
          {data.heading}
        </motion.h1>

        {/* Role cycle container */}
        <div className="h-10 flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={roleIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45 }}
              className="text-lg sm:text-2xl font-display-italic italic text-stone-300 tracking-wider flex items-center gap-2"
            >
              <span>{data.rolePrefix ?? "Một"}</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-sans text-xs uppercase tracking-widest font-semibold font-mono accent-gradient-text">
                {data.roles[roleIndex]}
              </span>
              <span>{data.roleSuffix ?? "đại diện tại Việt Nam"}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Description paragraphs */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-stone-300 max-w-xl mb-10 leading-relaxed font-light tracking-wide"
        >
          {data.subheading}
        </motion.p>

        {/* Call-to-Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4 justify-center relative z-20"
        >
          {/* See Works */}
          <button
            onClick={() => onScrollTo("#projects")}
            className="btn-modern-outline group relative inline-flex items-center justify-center rounded-full text-white font-extrabold text-sm uppercase tracking-widest px-10 py-5 cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0"></span>
            <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
              XEM DỰ ÁN 🎬
            </span>
          </button>

          {/* Contact button */}
          <button
            onClick={() => onScrollTo("#contact")}
            className="btn-modern group relative inline-flex items-center justify-center rounded-full text-white font-extrabold text-sm uppercase tracking-widest px-10 py-5 cursor-pointer"
          >
            <span className="relative z-10 drop-shadow-md">ĐẶT LỊCH TƯ VẤN</span>
          </button>
        </motion.div>
      </div>

      {/* Floating Depth Graphics */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Floating purple blob */}
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-[#7e22ce]/20 rounded-full blur-[80px] animate-float-slow"></div>
        {/* Floating pink blob */}
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#be185d]/20 rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Modern 3D-like Icon floating */}
        <div className="absolute top-[35%] right-[15%] animate-float-fast drop-shadow-[0_0_30px_rgba(219,39,119,0.5)] opacity-80" style={{ transform: 'translateZ(100px)' }}>
            <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#6b21a8] to-[#be185d] border border-white/20 shadow-2xl skew-x-[10deg] -rotate-12 blur-[1px]">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
            </div>
        </div>
        
        <div className="absolute bottom-[30%] left-[18%] animate-float-fast drop-shadow-[0_0_40px_rgba(249,115,22,0.4)] opacity-70" style={{ animationDelay: '1.5s', transform: 'translateZ(150px)' }}>
             <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#f97316] to-[#be185d] border border-white/20 shadow-2xl -skew-x-[5deg] rotate-[20deg] blur-[1.5px]">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>
            </div>
        </div>
      </div>

      {/* SCROLL-DOWN INDICATOR */}
      <div className="w-full flex flex-col items-center justify-center pb-8 z-20 relative">
        <span className="text-[10px] text-stone-500 uppercase tracking-[0.25em] font-mono mb-3">
          SCROLL DOWN
        </span>
        <div className="w-[1px] h-10 bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-transparent via-stone-400 to-transparent animate-scroll-down"></div>
        </div>
      </div>
    </section>
  );
}
