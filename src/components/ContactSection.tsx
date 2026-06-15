import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Hls from "hls.js";
import { Mail, Phone, Facebook, Youtube, Github, Send, CheckCircle2, ChevronRight, Activity, Instagram, Music } from "lucide-react";
import { ContactData } from "../types";

interface ContactSectionProps {
  data: ContactData;
}

export default function ContactSection({ data }: ContactSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize flipped background HLS loop video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 8,
        enableWorker: true,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.log("HLS contact screen play issue", err));
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(err => console.log("Native streams blocked", err));
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    // Simulate sending with nice timers
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormState({ name: "", email: "", message: "" });
      }, 5000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative bg-transparent pt-24 sm:pt-32 pb-12 overflow-hidden border-t border-white/5 select-none"
    >
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-24 relative z-20">
        
        {/* Heading Segment */}
        <div className="max-w-3xl text-left mb-16 lg:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-white/20"></div>
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#89AACC]">
              {data.heading || "KẾT NỐI HỢP TÁC"}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display-italic italic font-bold text-white tracking-tight leading-none mb-6 mb-7">
            Hãy bắt đầu một <br />
            chương mới cùng <span className="font-sans font-semibold tracking-wide text-transparent bg-clip-text accent-gradient font-mono">Phúc Vương</span>.
          </h2>

          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-lg">
            {data.subheading}
          </p>
        </div>

        {/* 2 part split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24 items-start text-left mb-24">
          
          {/* Left Side: Connection nodes with glow effects */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Phone */}
            <a
              href={`tel:${data.phone}`}
              className="group p-5 rounded-2xl liquid-glass border border-white/5 hover:border-[#89AACC]/40 transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 group-hover:text-white group-hover:bg-[#89AACC]/20 transition-all duration-300">
                <Phone className="w-5 h-5 text-[#89AACC] group-hover:animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#89AACC]/60 uppercase block mb-0.5">
                  ĐIỆN THOẠI TRỰC TIẾP
                </span>
                <span className="text-base font-bold text-white tracking-wide font-mono group-hover:text-[#89AACC] transition-colors">
                  {data.phone}
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${data.email}`}
              className="group p-5 rounded-2xl liquid-glass border border-white/5 hover:border-[#89AACC]/40 transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 group-hover:text-white group-hover:bg-[#89AACC]/20 transition-all duration-300">
                <Mail className="w-5 h-5 text-[#89AACC]" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#89AACC]/60 uppercase block mb-0.5">
                  GỬI THƯ ĐIỆN TỬ
                </span>
                <span className="text-base font-bold text-white tracking-wide font-mono group-hover:text-[#89AACC] transition-colors truncate block max-w-[220px] sm:max-w-none">
                  {data.email}
                </span>
              </div>
            </a>

            {/* Facebook Link */}
            <a
              href={data.facebookUrl || "https://facebook.com"}
              target="_blank"
              rel="noreferrer"
              className="group p-5 rounded-2xl liquid-glass border border-white/5 hover:border-[#89AACC]/40 transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 group-hover:text-white group-hover:bg-[#89AACC]/20 transition-all duration-300">
                <Facebook className="w-5 h-5 text-[#89AACC]" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#89AACC]/60 uppercase block mb-0.5">
                  MẠNG XÃ HỘI CHÍNH THỨC
                </span>
                <span className="text-base font-bold text-white tracking-wide group-hover:text-[#89AACC] transition-colors">
                  {data.facebook}
                </span>
              </div>
            </a>

            {/* Additional links */}
            <div className="flex gap-4 items-center pl-2 pt-2">
              <span className="text-[10px] font-mono text-stone-600 uppercase tracking-widest">
                NỀN TẢNG KHÁC:
              </span>
              <div className="flex gap-3">
                {data.githubUrl && (
                  <a
                    href={data.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:border-white/30 transition-all"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {data.youtubeUrl && (
                  <a
                    href={data.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-red-500 hover:border-red-500/30 transition-all"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {data.tiktokUrl && (
                  <a
                    href={data.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-pink-400 hover:border-pink-400/30 transition-all"
                    title="TikTok"
                  >
                    <Music className="w-4 h-4" />
                  </a>
                )}
                {data.instagramUrl && (
                  <a
                    href={data.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-[#E1306C] hover:border-[#E1306C]/30 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Side: Minimalist 3-field contact form */}
          <div className="lg:col-span-7 liquid-glass p-6 sm:p-10 rounded-[32px] border border-white/10 relative overflow-hidden">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <CheckCircle2 className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-2xl font-display-italic italic font-bold text-white mb-2">
                  Đã gửi thư thành công!
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
                  Cảm ơn bạn đã kết nối. Phúc Vương đã nhận được nội dung của bạn và sẽ chủ động phản hồi qua email sớm nhất có thể.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Field 1: Họ tên */}
                <div className="flex flex-col text-left">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#89AACC] mb-2 font-bold">
                    01. Họ và tên của bạn?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#89AACC] focus:bg-white/[0.04] hover:bg-white/[0.03] transition-all duration-200 placeholder-stone-600"
                  />
                </div>

                {/* Field 2: Email */}
                <div className="flex flex-col text-left">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#89AACC] mb-2 font-bold">
                    02. Địa chỉ email nhận phản hồi?
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tenban@domain.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#89AACC] focus:bg-white/[0.04] hover:bg-white/[0.03] transition-all duration-200 placeholder-stone-600"
                  />
                </div>

                {/* Field 3: Tin nhắn */}
                <div className="flex flex-col text-left">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#89AACC] mb-2 font-bold">
                    03. Hãy chia sẻ về dự án của bạn
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tôi muốn cộng tác biên tập video showreel / xây dựng sản phẩm web..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#89AACC] focus:bg-white/[0.04] hover:bg-white/[0.03] transition-all duration-200 placeholder-stone-600 resize-none"
                  />
                </div>

                {/* Gradient-shift Submit button */}
                <div className="pt-4 text-left">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-modern relative w-full sm:w-auto overflow-hidden sm:px-14 transition-all flex items-center justify-center gap-2 group inline-flex items-center justify-center gap-3 rounded-full py-5 px-10 font-extrabold text-white uppercase tracking-widest text-sm cursor-pointer duration-500 ease-[0.16,1,0.3,1]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-mono font-extrabold transition-colors duration-500">
                      {isSubmitting ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" /> ĐANG TRUYỀN TẢI...
                        </>
                      ) : (
                        <>
                          {data.ctaLabel || "KẾT NỐI NGAY"} <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                        </>
                      )}
                    </span>
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>

      {/* GSAP / Infinite CSS Seamless Loop Marquee */}
      <div className="w-full border-y border-white/5 py-4 bg-stone-950/40 backdrop-blur-md overflow-hidden relative flex z-20">
        <div className="flex animate-marquee whitespace-nowrap items-center select-none">
          {Array(16).fill("BUILDING THE FUTURE • PHUC VUONG • ").map((text, i) => (
            <span key={i} className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-stone-500/70 hover:text-[#D4AF37] transition-colors duration-300 mx-4">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-24 mt-12 relative z-20 flex flex-wrap gap-6 justify-between items-center text-center sm:text-left">
        <p className="text-[10px] font-mono text-stone-600 uppercase tracking-widest">
          © 2026 PHÚC VƯƠNG. TOÀN BỘ BẢN QUYỀN ĐƯỢC BẢO HỘ.
        </p>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
            SẴN SÀNG NHẬN DỰ ÁN MỚI
          </span>
        </div>
      </div>
    </section>
  );
}
