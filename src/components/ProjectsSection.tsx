import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X, Film, Eye, Sparkles, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectsData, ProjectItem } from "../types";
import UploadInstructions from "./UploadInstructions";

interface ProjectsSectionProps {
  data: ProjectsData;
}

const isGoogleDriveUrl = (url: string | null): boolean => {
  return url ? url.includes("drive.google.com") : false;
};

const getGoogleDriveEmbedUrl = (url: string | null): string => {
  if (!url) return "";
  if (url.includes("/preview")) return url;
  
  // Try to find the file ID
  const matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matches && matches[1]) {
    return `https://drive.google.com/file/d/${matches[1]}/preview`;
  }
  return url;
};

const getGoogleDriveImageUrl = (url: string | null): string => {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;
  
  const matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matches && matches[1]) {
    return `https://lh3.googleusercontent.com/d/${matches[1]}=w800`;
  }
  return url;
};

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const current = scrollRef.current;
    const maxScroll = current.scrollWidth - current.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const progress = (current.scrollLeft / maxScroll) * 100;
    setScrollProgress(progress);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const current = scrollRef.current;
    
    // Calculate scroll step based on container width
    const scrollAmount = current.clientWidth * 0.75; 
    const targetScroll = current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
    
    current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      handleScroll();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatic Smooth Slider Loop (Clicks/Ticks every 2s for perfect pacing)
  useEffect(() => {
    if (activeVideo || isUploadModalOpen) return;

    const interval = setInterval(() => {
      if (!scrollRef.current || isDragging || isPaused) return;

      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;

      // Calculate approximate page-width step dynamically
      const cardWidth = container.scrollWidth / data.list.length;
      let nextScrollLeft = container.scrollLeft + cardWidth;

      // If we are close or at the absolute right end, go back to start
      if (nextScrollLeft >= maxScroll + 10) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isDragging, isPaused, activeVideo, isUploadModalOpen, data.list.length]);

  return (
    <section
      id="projects"
      className="relative bg-transparent py-24 sm:py-32 px-6 sm:px-12 md:px-16 overflow-hidden border-t border-white/5 select-none fade-rise"
    >
      {/* Decorative blurry backgrounds */}
      <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#4E85BF]/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-24 relative z-10">
        
        {/* Section Heading & Navigation Controls */}
        <div className="flex items-center justify-between gap-4 mb-12 lg:mb-16 flex-wrap">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-white/20"></div>
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-stone-500 font-bold">
                {data.heading || "DỰ ÁN CHỌN LỌC"}
              </span>
            </div>
            <span className="text-stone-400 font-sans text-xs italic ml-11 max-w-sm sm:max-w-md">
              Kéo/Vuốt ngang hoặc click mũi tên để khám phá tất cả thước phim.
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Nav Arrows */}
            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Previous Project"
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer hover:border-white/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Next Project"
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer hover:border-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Film className="w-3.5 h-3.5 text-[#89AACC]" />
              SẢN PHẨM EDIT
            </span>
          </div>
        </div>

        {/* Horizontal Filmstrip Slider Track Container */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={() => {
            handleMouseLeave();
            setIsPaused(false);
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-6 sm:gap-8 lg:gap-10 pb-8 scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {data.list.map((proj) => (
            <div 
              key={proj.number} 
              className="w-[290px] sm:w-[350px] lg:w-[410px] shrink-0 snap-start"
            >
              <ProjectCard
                proj={proj}
                onPlay={(videoUrl, name) => {
                  setActiveVideo(videoUrl);
                  setActiveProjectName(name);
                }}
              />
            </div>
          ))}
        </div>

        {/* Customized Cinematic Bottom Scroll Progress Line */}
        <div className="mt-8 flex items-center justify-between max-w-sm mx-auto sm:mx-0">
          <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="absolute h-full bg-[#89AACC] rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(137,170,204,0.5)]"
              style={{
                width: `${Math.max(4, scrollProgress)}%`,
                left: 0,
              }}
            />
          </div>
          <div className="ml-6 flex items-center text-[10px] font-mono text-stone-500 tracking-widest uppercase">
            <span>DISCOVER</span>
            <span className="text-[#89AACC] ml-1.5 font-bold">{Math.round(scrollProgress)}%</span>
          </div>
        </div>

      </div>

      {/* Cinematic Modal Player Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#060606]/98 backdrop-blur-2xl z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            {/* Absolute close background mask */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => {
              setActiveVideo(null);
              setActiveProjectName(null);
            }} />

            {/* Video Player Card Frame (Responsive 16:9 aspect) */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-[1280px] liquid-glass !bg-black/80 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl z-10 flex flex-col justify-between"
            >
              {/* Header Title Bar inside Modal */}
              <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between text-left gap-4 backdrop-blur-sm">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#89AACC]">
                    CINEMATIC SHOWCASE
                  </span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-sm font-semibold text-white tracking-wide truncate max-w-[240px] sm:max-w-none">
                      {activeProjectName}
                    </h4>
                    {isGoogleDriveUrl(activeVideo) && (
                      <a
                        href={activeVideo || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 px-2.5 py-1 rounded-full font-mono transition-all uppercase tracking-wider relative z-50 cursor-pointer"
                      >
                        Mở Google Drive ↗
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveVideo(null);
                    setActiveProjectName(null);
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer relative z-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* The Video Element */}
              <div className="aspect-video w-full bg-black relative text-center flex items-center justify-center">
                {isGoogleDriveUrl(activeVideo) ? (
                  <iframe
                    src={getGoogleDriveEmbedUrl(activeVideo)}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={activeProjectName || "Google Drive Video Player"}
                  />
                ) : (
                  <video
                    src={activeVideo || ""}
                    autoPlay
                    controls
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Footer info bar */}
              <div className="px-6 py-4 bg-stone-900/10 text-stone-500 font-mono text-[9px] uppercase tracking-widest text-center">
                PHUC VUONG -- BẢN QUYỀN HẬU KỲ SẢN PHẨM KHÁCH HÀNG 2026
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload & Cloud Storage Instructions Modal Guide */}
      <UploadInstructions isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </section>
  );
}

/* INDIVIDUAL GRID CARD COMPONENT SHELLS */
interface ProjectCardProps {
  proj: ProjectItem;
  onPlay: (videoUrl: string, name: string) => void;
}

function ProjectCard({ proj, onPlay }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="liquid-glass rounded-[32px] p-5 flex flex-col justify-between group transition-all duration-300 hover:border-white/20 select-none cursor-pointer h-full"
      onClick={() => onPlay(proj.videoUrl, proj.name)}
    >
      <div>
        {/* Aspect Ratio Video Preview Area */}
        <div className="relative w-full aspect-[16/10] rounded-[22px] overflow-hidden bg-stone-900 mb-6 border border-white/5 shadow-inner">
          
          {/* Static High-Res Thumbnail Image */}
          <img
            src={getGoogleDriveImageUrl(proj.thumbUrl)}
            alt={proj.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 z-10 ${
              isHovered 
                ? (isGoogleDriveUrl(proj.videoUrl) ? "scale-105 brightness-50" : "opacity-0 scale-105") 
                : "opacity-100 scale-100"
            }`}
          />

          {/* Video Preview on Hover (Auto-played, looped, muted) */}
          <div className="absolute inset-0 w-full h-full z-0 bg-stone-900 flex items-center justify-center">
            {isHovered && !isGoogleDriveUrl(proj.videoUrl) && (
              <video
                src={proj.videoUrl}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover opacity-80"
              />
            )}
            {isHovered && isGoogleDriveUrl(proj.videoUrl) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60 z-20 backdrop-blur-sm">
                <Play className="w-8 h-8 text-[#89AACC] mb-2 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#89AACC]/80">Google Drive Video</span>
              </div>
            )}
          </div>

          {/* Floating Hover Indicator Label */}
          <div className="absolute inset-0 bg-[#0A0A0A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-black/75 border border-white/20 backdrop-blur-md text-xs font-bold text-white uppercase tracking-widest scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-3.5 h-3.5 fill-current text-[#89AACC]" />
              XEM SHOWREEL ↗
            </span>
          </div>

          {/* Number badge */}
          <span className="absolute top-4 left-4 z-20 text-xs font-mono font-black text-white/50 bg-[#0A0A0A]/60 px-3 py-1 rounded-full border border-white/5">
            {proj.number}
          </span>
        </div>

        {/* Text Area */}
        <div className="px-1 text-left">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#89AACC] font-semibold mb-1 block">
            {proj.category}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight mb-2 group-hover:text-[#89AACC] transition-colors line-clamp-1">
            {proj.name}
          </h3>
          <p className="text-xs text-stone-400 font-light leading-relaxed mb-6 line-clamp-2 sm:line-clamp-3">
            {proj.desc}
          </p>
        </div>
      </div>

      {/* View/Xem Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // halt click bubble
          onPlay(proj.videoUrl, proj.name);
        }}
        className="relative w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#89AACC]/50 group-hover:bg-[#89AACC]/10 text-stone-200 group-hover:text-[#89AACC] font-extrabold text-[11px] uppercase tracking-widest cursor-pointer transition-all duration-500 ease-[0.16,1,0.3,1] flex items-center justify-center gap-2 overflow-hidden shadow-none group-hover:shadow-[0_0_20px_rgba(137,170,204,0.15)] group-hover:-translate-y-0.5"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0"></span>
        <Eye className="w-4 h-4 relative z-10" />
        <span className="relative z-10">BẤM XEM CHI TIẾT</span>
      </button>
    </motion.div>
  );
}
