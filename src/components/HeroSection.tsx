import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pause, Play } from "lucide-react";
import { HERO_DATA, MULBERRY_MEDIA } from "../data/mulberryData";
import { SplitTextReveal } from "./HarrowayUI";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onScrollNext: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollNext }) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const bgMediaRef = useRef<HTMLDivElement | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const toggleVideo = () => {
    const vid = videoElRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const hero = heroRef.current;
    const bgMedia = bgMediaRef.current;
    if (!hero || !bgMedia) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Load entrance choreography (matching Harroway hero-intro IX3)
      gsap.fromTo(
        bgMedia,
        { scale: 1.12 },
        { scale: 1.0, duration: 1.8, ease: "power3.out" }
      );

      gsap.fromTo(
        "[data-hero-logo]",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        "[data-hero-stats-shell]",
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, delay: 0.45, ease: "power3.out" }
      );

      gsap.fromTo(
        "[data-hero-stat]",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          delay: 0.55,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        "[data-hero-about]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.65, ease: "power3.out" }
      );

      // Scroll-triggered parallax & subtle depth zoom as Vision rises over Hero
      gsap.to("[data-hero-video]", {
        yPercent: 7,
        scale: 1.18,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-title-wrap]", {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "85% top",
          scrub: true,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative z-[8] w-full min-h-[100svh] bg-[var(--accent-800)] text-[var(--text-inverse)] flex flex-col justify-between overflow-hidden"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      {/* Full-Bleed Background Media Layer (Original Mulberry Grove HD Hero Video + Poster) */}
      <div ref={bgMediaRef} className="absolute inset-0 z-[1] overflow-hidden will-change-transform">
        <img src={MULBERRY_MEDIA.heroPoster} alt="Sunlight filtering through tree branches" width={2400} height={1350} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <video
          ref={videoElRef}
          data-hero-video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoReady(true)}
          onError={() => { setVideoReady(false); setIsPlaying(false); }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          style={{ opacity: videoReady ? 1 : 0 }}
          poster={MULBERRY_MEDIA.heroPoster}
          aria-label="Mulberry Grove Harris County aerial and community video"
          className="absolute inset-0 w-full h-full object-cover will-change-transform transition-opacity duration-700"
        >
          <source src={MULBERRY_MEDIA.heroVideo} type="video/mp4" />
        </video>
        {/* Exact Harroway dual atmospheric gradient & slate multiply veil */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,21,22,0.72) 0%, rgba(18,21,22,0.34) 34%, rgba(18,21,22,0.28) 66%, rgba(18,21,22,0.82) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[3] bg-[var(--accent-800)]/18 pointer-events-none" />
      </div>

      {/* Top/Center Monumental Hero Headline (Exact Harroway .hero-intro-title) */}
      <div
        data-hero-title-wrap
        className="relative z-10 w-full max-w-[54rem] mx-auto px-5 pt-[clamp(2rem,5vh,4.5rem)] pb-6 flex flex-col items-center text-center will-change-transform"
      >
        <img
          data-hero-logo
          src={MULBERRY_MEDIA.logo}
          alt="Mulberry Grove"
          width={403}
          height={285}
          className="h-[clamp(3.75rem,5.5vw,5.25rem)] w-auto object-contain mb-5 opacity-95 drop-shadow-[0_4px_20px_rgba(0,0,0,0.28)]"
        />
        <SplitTextReveal
          as="h1"
          text={HERO_DATA.heading}
          immediate
          delay={0.28}
          stagger={0.08}
          className="hw-heading-hero text-[var(--accent-50)]/95 max-w-[44rem] mx-auto"
        />
      </div>

      {/* Bottom Split Bar: Frosted Stat Tiles Left + Description & Scroll Cue Right */}
      <div className="relative z-10 w-full flex flex-col-reverse lg:flex-row items-stretch lg:items-end justify-between mt-auto">
        {/* Exact Harroway .hero-intro-stats-wrap */}
        <div
          data-hero-stats-shell
          className="relative w-full lg:w-1/2 p-3 sm:p-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[var(--accent-300)]/22 backdrop-blur-xl border-t border-r border-[var(--accent-50)]/14" />
          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3">
            {HERO_DATA.stats.map((stat) => (
              <div
                key={stat.label}
                data-hero-stat
                className="rounded-[3px] bg-[var(--accent-400)]/92 hover:bg-[var(--accent-300)] transition-colors duration-300 text-[var(--secondary-800)] p-3.5 sm:p-5 flex flex-col justify-between gap-2 min-h-[6.25rem] sm:min-h-[7.5rem]"
              >
                <span className="font-display font-light text-[clamp(1.6rem,2.6vw,2.85rem)] leading-none tracking-[-0.01em] text-[var(--accent-900)]">
                  {stat.number}
                </span>
                <span className="font-mono-label text-[var(--accent-900)]/80 !text-[0.66rem] sm:!text-[0.74rem]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Exact Harroway .hero-intro-about */}
        <div
          data-hero-about
          className="w-full lg:w-1/2 p-5 sm:p-7 lg:p-8 flex flex-col justify-end items-start lg:items-end"
        >
          <div className="w-full max-w-[34rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[var(--accent-50)]/90">
            <p className="m-0 text-sm sm:text-[0.98rem] font-light leading-snug max-w-[20rem] text-left">
              {HERO_DATA.subtitle}
            </p>
            <div className="hidden sm:block flex-1 h-px bg-[var(--accent-50)]/35 mx-2 hw-scroll-line" />
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={toggleVideo}
                aria-label={isPlaying ? "Pause ambient video" : "Play ambient video"}
                className="w-7 h-7 rounded-full bg-[var(--accent-50)]/14 hover:bg-[var(--secondary-500)] border border-[var(--accent-50)]/22 text-[var(--accent-50)] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3 ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={onScrollNext}
                className="font-mono-label text-[var(--accent-50)]/90 hover:text-white bg-transparent border-0 p-0 cursor-pointer tracking-[0.06em] transition-opacity"
              >
                Scroll
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
