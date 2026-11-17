import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Maximize2 } from "lucide-react";
import {
  LOCATION_DATA,
  MULBERRY_MEDIA,
  STATEMENT_MANIFESTO,
} from "../data/mulberryData";
import { HarrowayLabel, ParallaxMedia, SplitTextReveal } from "./HarrowayUI";
import { ModalType } from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

interface StatementRevealSectionProps {
  onOpenImage: (src: string, caption: string) => void;
}

const FLOATING_FRAMES = [
  {
    src: MULBERRY_MEDIA.retailCarousel[0].src,
      caption: MULBERRY_MEDIA.retailCarousel[0].caption,
    posClass:
      "w-[64%] sm:w-[34%] lg:w-[28%] h-[34vh] sm:h-[42vh] top-[2%] left-[5%]",
    speed: 12,
  },
  {
    src: MULBERRY_MEDIA.retailCarousel[1].src,
    caption: MULBERRY_MEDIA.retailCarousel[1].caption,
    posClass:
      "w-[54%] sm:w-[26%] lg:w-[20%] h-[28vh] sm:h-[32vh] top-[27%] right-[7%]",
    speed: 16,
  },
  {
    src: MULBERRY_MEDIA.retailCarousel[2].src,
    caption: MULBERRY_MEDIA.retailCarousel[2].caption,
    posClass:
      "w-[58%] sm:w-[28%] lg:w-[23%] h-[28vh] sm:h-[32vh] bottom-[19%] left-[12%] lg:left-[16%]",
    speed: 10,
  },
  {
    src: MULBERRY_MEDIA.retailCarousel[3].src,
    caption: MULBERRY_MEDIA.retailCarousel[3].caption,
    posClass:
      "w-[46%] sm:w-[22%] lg:w-[16%] h-[22vh] sm:h-[24vh] bottom-[5%] right-[12%] lg:right-[18%]",
    speed: 18,
  },
];

export const StatementRevealSection: React.FC<StatementRevealSectionProps> = ({
  onOpenImage,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = el.querySelectorAll<HTMLElement>("[data-manifesto-word]");
    if (prefersReduced) {
      gsap.set(words, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Word-by-word scroll-scrubbed illumination (Harroway signature statement reveal)
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            end: "52% center",
            scrub: 0.5,
          },
        }
      );

      // Concentric architectural orbit rings breathe & expand on scroll
      gsap.fromTo(
        el.querySelectorAll("[data-orbit]"),
        { scale: 0.84, opacity: 0.12 },
        {
          scale: 1.08,
          opacity: 0.42,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const manifestoWords = STATEMENT_MANIFESTO.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative z-[9] w-full bg-[var(--bg-dark-base)] text-[var(--text-inverse)] overflow-x-clip"
    >
      {/* Sticky Fullscreen Statement + 3 Concentric Grove-Green Orbit Rings */}
      <div className="sticky top-0 z-[5] min-h-[100svh] w-full flex flex-col items-center justify-center px-6 sm:px-12 overflow-hidden">
        {/* Three Concentric Harroway Orbit Circles */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            data-orbit
            className="absolute w-[68vw] sm:w-[42vw] h-[68vw] sm:h-[42vw] rounded-full border border-[var(--secondary-400)]/45 will-change-transform"
          />
          <div
            data-orbit
            className="absolute w-[95vw] sm:w-[62vw] h-[95vw] sm:h-[62vw] rounded-full border border-[var(--secondary-400)]/35 will-change-transform"
          />
          <div
            data-orbit
            className="absolute w-[124vw] sm:w-[82vw] h-[124vw] sm:h-[82vw] rounded-full border border-[var(--secondary-400)]/25 will-change-transform"
          />
        </div>

        <div className="relative z-10 max-w-[58rem] mx-auto text-center space-y-6">
          <span className="font-mono-label text-[var(--accent-300)] block tracking-[0.08em]">
            30 Acres of Lakes · 138 Acres of Greenway
          </span>
          <h2 className="m-0 hw-heading-2xl text-[var(--accent-50)]">
            {manifestoWords.map((word, idx) => (
              <span
                key={`${word}-${idx}`}
                data-manifesto-word
                className="inline-block transition-opacity"
              >
                {word}
                {idx < manifestoWords.length - 1 && "\u00A0"}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Drifting Editorial Photography Layer Passing Over the Sticky Statement */}
      <div className="relative z-10 w-full h-[135vh] sm:h-[125vh] pointer-events-none">
        {FLOATING_FRAMES.map((frame, i) => (
          <div
            key={frame.src}
            className={`absolute ${frame.posClass} pointer-events-auto shadow-[0_28px_70px_rgba(0,0,0,0.45)]`}
          >
            <ParallaxMedia
              src={frame.src}
              alt={MULBERRY_MEDIA.retailCarousel[i].alt}
              speed={frame.speed}
              onClick={() => onOpenImage(frame.src, frame.caption)}
              className="w-full h-full"
            />
            <span className="sr-only">Open gallery image {i + 1}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============================================================
   SECTION 6: HARROWAY STICKY SERVICES GRID -> LOCATION & LOCAL DRIVE TIMES
   ============================================================ */
interface LocationStickySectionProps {
  onOpenModal: (modal: ModalType) => void;
}

export const LocationStickySection: React.FC<LocationStickySectionProps> = ({
  onOpenModal,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-drive-card]"),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el.querySelector("[data-drive-grid]"),
            start: "top 82%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="location"
      ref={sectionRef}
      className="relative z-[9] w-full bg-[var(--accent-300)] grid grid-cols-1 lg:grid-cols-3 overflow-x-clip"
    >
      {/* Left Pinned Grove-Green Column (Exact Harroway .sticky-service-block) */}
      <div className="lg:sticky lg:top-[var(--nav-height)] lg:self-start bg-[var(--secondary-500)] text-[var(--text-inverse)] flex flex-col justify-between">
        <div className="p-7 sm:p-10 lg:p-11 pt-12 lg:pt-24 flex flex-col items-start gap-5 flex-1">
          <HarrowayLabel
            primary="Local"
            secondary="Drive Times"
            variant="dark"
          />
          <SplitTextReveal
            as="h2"
            text={LOCATION_DATA.heading}
            stagger={0.06}
            className="m-0 hw-heading-xl text-[var(--accent-50)] max-w-[18rem]"
          />
          <p className="m-0 text-sm sm:text-[0.95rem] font-light leading-relaxed text-[var(--accent-50)]/82 max-w-[24rem]">
            {LOCATION_DATA.intro}
          </p>

          {/* Official Mulberry Grove Location Map SVG Interactive Card */}
          <button
            type="button"
            onClick={() => onOpenModal("map")}
            className="group relative mt-4 w-full rounded-[3px] overflow-hidden bg-[#ebebea] cursor-pointer p-3 text-left"
            aria-label="Open Mulberry Grove Location Map"
          >
            <img
              src={MULBERRY_MEDIA.locationMap}
              alt="Mulberry Grove location map"
              loading="lazy"
              width={695}
              height={915}
              className="w-full h-[clamp(16rem,25vw,24rem)] object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--secondary-900)]/75 via-transparent to-transparent flex items-end justify-between p-3.5">
              <span className="font-mono-label text-[var(--accent-50)] !text-[0.68rem]">
                Mulberry Grove Location Map
              </span>
              <span className="w-7 h-7 rounded-[2px] bg-[var(--accent-50)]/20 backdrop-blur-md inline-flex items-center justify-center text-[var(--accent-50)]">
                <Maximize2 className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Exact Harroway Bottom Full-Width Bordered Link */}
        <button
          type="button"
          onClick={() => onOpenModal("map")}
          className="group relative w-full px-7 sm:px-10 lg:px-11 py-6 border-t border-[var(--secondary-300)]/45 bg-transparent hover:bg-[var(--secondary-700)] transition-colors duration-300 flex items-center justify-between text-[var(--accent-50)] cursor-pointer"
        >
          <span className="font-mono-label tracking-[0.04em]">
            Open full location map
          </span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
            strokeWidth={1.6}
          />
        </button>
      </div>

      {/* Right 2-Column Bordered Architectural Grid (All 6 Verbatim Local Drive Times) */}
      <div
        data-drive-grid
        className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 border-l border-[var(--accent-200)]/70"
      >
        {LOCATION_DATA.driveTimes.map((item, idx) => (
          <div
            key={item.full}
            data-drive-card
            onClick={() => onOpenModal("map")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenModal("map");
              }
            }}
            className="hw-service-card cursor-pointer flex flex-col justify-center border-b border-r border-[var(--accent-200)]/70 min-h-[12rem] sm:min-h-[16rem] text-[var(--text-primary)]"
          >
            {/* Centered Editorial Body (Exact Harroway .service-block) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-7 sm:px-9 py-9">
              <span className="font-mono-label text-[var(--accent-800)]/70">
                0{idx + 1}
              </span>
              <div className="space-y-1">
                <h3 className="m-0 hw-heading-md text-[var(--text-primary)]">
                  {item.time}
                </h3>
                <p className="m-0 font-display text-lg text-[var(--secondary-600)]">
                  {item.destination}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
