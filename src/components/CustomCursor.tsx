import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device supports hover/has mouse
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsMobile(!mediaQuery.matches);

    if (!mediaQuery.matches) return;

    const mouseCoords = { x: 0, y: 0 };
    const curCoords = { x: 0, y: 0 };
    const ringCoords = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.x = e.clientX;
      mouseCoords.y = e.clientY;
    };

    // Attach event tracker
    window.addEventListener("mousemove", handleMouseMove);

    // Track button / anchor hovers to scale cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".glass-card") ||
        target.closest(".hover-target")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    // Animation frames to chase coordinates smoothly (inertia feel)
    let animationId = 0;
    const animate = () => {
      // Ease factor
      const easeCur = 0.25;
      const easeRing = 0.12;

      curCoords.x += (mouseCoords.x - curCoords.x) * easeCur;
      curCoords.y += (mouseCoords.y - curCoords.y) * easeCur;

      ringCoords.x += (mouseCoords.x - ringCoords.x) * easeRing;
      ringCoords.y += (mouseCoords.y - ringCoords.y) * easeRing;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${curCoords.x}px, ${curCoords.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringCoords.x - 14}px, ${ringCoords.y - 14}px, 0)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Central dot */}
      <div
        ref={cursorRef}
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-emerald-400 pointer-events-none z-[9999] transition-all mix-blend-screen -translate-x-1/2 -translate-y-1/2"
        style={{
          boxShadow: "0 0 10px #10B981, 0 0 20px #10B981",
        }}
      />
      {/* Floating chase ring (Neon glow, enlarges on hover) */}
      <div
        ref={ringRef}
        id="custom-cursor-ring"
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9998] transition-all duration-300 ease-out mix-blend-screen ${
          isHovered
            ? "border-emerald-400 bg-emerald-400/20 scale-[1.8] blur-[1px]"
            : "border-fuchsia-500 bg-fuchsia-500/5 blur-[2px]"
        }`}
        style={{
          boxShadow: isHovered
            ? "0 0 15px rgba(16, 185, 129, 0.4)"
            : "0 0 10px rgba(217, 70, 239, 0.2)",
        }}
      />
    </>
  );
}
