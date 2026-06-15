import React, { useState, useEffect, useRef } from "react";
import contentDataRaw from "./data/contentData.json";
import { ContentData } from "./types";
import Hls from "hls.js";

import LoadingScreen from "./components/LoadingScreen";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [data, setData] = useState<ContentData>(contentDataRaw as ContentData);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch the latest content on mount from the API server (or fallback to local file)
  useEffect(() => {
    async function fetchLatestContent() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const fetchedData = await res.json();
          setData(fetchedData);
        }
      } catch (err) {
        console.warn("Express content API-server is currently unreached. Using compiled local JSON content.", err);
      }
    }
    fetchLatestContent();
  }, []);

  const handleSaveContent = async (updatedData: ContentData): Promise<boolean> => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        // Live client-side visual upgrade
        setData(updatedData);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to write update payload back to server disk:", err);
      return false;
    }
  };

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

  // Smooth scroll controller targeting specified section elements
  const handleScrollTo = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      id="portfolio-app-wrapper"
      className="min-h-screen bg-transparent text-[#F5F5F5] font-sans selection:bg-[#D4AF37]/30 relative"
      style={{ overflowX: "clip" }}
    >
      {/* GLOBAL BACKGROUND VIDEO */}
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0A0A0A]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-[1.02] opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/80 to-[#0A0A0A] pointer-events-none" />
      </div>

      {/* 1. Fullscreen Counter Loading Overlay */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Main Container rendered when ready */}
      <div className={`transition-opacity duration-1000 ${isLoading ? "opacity-0 pointer-events-none" : "opacity-100 z-10 relative"}`}>
        
        {/* 2. Hero Section with Live Background video streams */}
        <HeroSection data={data.hero} onScrollTo={handleScrollTo} />

        {/* 3. Horizontal Video Mockups Marquee */}
        <MarqueeSection data={data.marquee} />

        {/* 4. About Section with 3D Space tilt and dual accent metrics */}
        <AboutSection data={data.about} onScrollTo={handleScrollTo} />

        {/* 5. Liquid Glass Frosted Skills Dashboard */}
        <ServicesSection data={data.skills} />

        {/* 6. Vertical Active Timelines */}
        <ExperienceSection data={data.experience} />

        {/* 7. Grid Portfolio cards with live popups */}
        <ProjectsSection data={data.projects} />

        {/* 8. Upside down cinematic video contact & form */}
        <ContactSection data={data.contact} />

        {/* 9. Real-Time Admin Panel Panelist Overlay Trigger */}
        <AdminPanel data={data} onSave={handleSaveContent} />

      </div>
    </div>
  );
}
