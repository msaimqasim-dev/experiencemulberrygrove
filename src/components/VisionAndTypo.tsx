import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MULBERRY_MEDIA, VISION_DATA } from "../data/mulberryData";
import {
  HarrowayButton,
  MulberryRadialSeal,
  ParallaxMedia,
  SplitTextReveal,
} from "./HarrowayUI";

gsap.registerPlugin(ScrollTrigger);

interface VisionGridSectionProps {
  onNavigate: (id: string) => void;
}

export const VisionGridSection: React.FC<VisionGridSectionProps> = ({
  onNavigate,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-about-reveal]"),
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        el.querySelector("[data-about-media]"),
        { clipPath: "inset(8% 4% 8% 4%)", scale: 1.08 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
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
      id="vision"
      ref={sectionRef}
      className="relative z-[9] w-full bg-[var(--bg-light-base)] text-[var(--text-primary)] grid grid-cols-1 lg:grid-cols-3 min-h-[76vh] border-b border-[var(--accent-800)]/10 overflow-clip"
    >
      {/* Column 1: Heading, Lead Vision Statement, Rolling Slate CTA */}
      <div className="flex flex-col items-center justify-between text-center gap-8 px-6 sm:px-10 lg:px-12 py-14 lg:py-20">
        <div data-about-reveal className="max-w-[21rem]">
          <SplitTextReveal
            as="h2"
            text={VISION_DATA.heading}
            className="hw-heading-lg text-[var(--text-primary)]"
          />
        </div>

        <div data-about-reveal className="max-w-[23rem]">
          <p className="m-0 text-[clamp(1.05rem,1rem+0.22vw,1.22rem)] font-light leading-[1.58] text-[var(--text-secondary)]">
            {VISION_DATA.leadParagraph}
          </p>
        </div>

        <div data-about-reveal>
          <HarrowayButton
            variant="slate"
            onClick={() => onNavigate("community")}
          >
            Community
          </HarrowayButton>
        </div>
      </div>

      {/* Column 2: Full-Bleed Center Environmental Film (Original Mulberry Grove Vision Video) */}
      <div className="relative aspect-[695/915] lg:aspect-auto lg:min-h-[38rem] overflow-hidden bg-[var(--accent-300)]">
        <div data-about-media className="absolute inset-0 will-change-transform">
          <ParallaxMedia
            videoSrc={MULBERRY_MEDIA.visionVideo}
            poster={MULBERRY_MEDIA.visionPoster}
            videoObjectPosition="74% center"
            alt="A mother carrying her child through a sunlit meadow"
            speed={0}
            className="w-full h-full !rounded-none"
          />
        </div>
      </div>

      {/* Column 3: Rotating Architectural Emblem, Full Vision Continuation, Mono Signature */}
      <div className="flex flex-col items-center justify-between text-center gap-8 px-6 sm:px-10 lg:px-12 py-14 lg:py-20">
        <div data-about-reveal>
          <MulberryRadialSeal className="w-24 h-24" />
        </div>

        <div data-about-reveal className="max-w-[24rem]">
          <p className="m-0 text-[0.96rem] sm:text-[1rem] font-normal leading-[1.6] text-[var(--text-primary)]/90">
            {VISION_DATA.detailParagraph}
          </p>
        </div>

        <div data-about-reveal>
          <span className="font-mono-label text-[var(--accent-800)]/75">
            {VISION_DATA.attribution}
          </span>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   HARROWAY GIANT 3-LINE KINETIC TYPOGRAPHY SECTION
   ============================================================ */
interface TypoTitlesSectionProps {
  line1: string;
  line2: string;
  line3: string;
  sideStatement: string;
  image?: string;
  imageAlt?: string;
  surface?: "base" | "strong";
}

export const TypoTitlesSection: React.FC<TypoTitlesSectionProps> = ({
  line1,
  line2,
  line3,
  sideStatement,
  image,
  imageAlt = "Mulberry Grove",
  surface = "base",
}) => {
  const wrapRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Masked line entrance reveal
      gsap.fromTo(
        el.querySelectorAll("[data-typo-rise]"),
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 0.92,
          duration: 1.05,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true,
          },
        }
      );

      const imgBox = el.querySelector("[data-typo-img]");
      if (imgBox) {
        gsap.fromTo(
          imgBox,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      gsap.fromTo(
        el.querySelectorAll("[data-typo-caption]"),
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 0.9,
          duration: 0.9,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Opposing horizontal kinetic scroll drift (signature Harroway typo-titles motion)
      gsap.fromTo(
        el.querySelector("[data-typo-row='1']"),
        { xPercent: -3.5 },
        {
          xPercent: 3.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        el.querySelector("[data-typo-row='2']"),
        { xPercent: 3.5 },
        {
          xPercent: -3.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        el.querySelector("[data-typo-row='3']"),
        { xPercent: -2.5 },
        {
          xPercent: 2.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const bgClass =
    surface === "strong" ? "bg-[var(--bg-light-strong)]" : "bg-[var(--bg-light-base)]";

  return (
    <section
      ref={wrapRef}
      className={`relative z-[9] w-full ${bgClass} text-[var(--text-primary)] flex flex-col items-center justify-center gap-1 sm:gap-2 overflow-clip select-none`}
      style={{
        paddingTop: "var(--section-pad-lg)",
        paddingBottom: "var(--section-pad-md)",
        paddingLeft: "var(--container-pad)",
        paddingRight: "var(--container-pad)",
      }}
    >
      {/* Row 1 */}
      <div
        data-typo-row="1"
        className="flex items-end justify-center gap-[2.5vw] lg:ml-[2vw] will-change-transform"
      >
        {image && (
          <div
            data-typo-img
            className="hidden sm:block w-[19vw] max-w-[18rem] h-[13.5vw] max-h-[12.5rem] rounded-[3px] overflow-hidden shrink-0 mb-[0.5vw] shadow-sm"
          >
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <span className="hw-line-mask">
          <span data-typo-rise className="block hw-heading-typo text-[var(--text-primary)]/90">
            {line1}
          </span>
        </span>
      </div>

      {/* Row 2 with Editorial Side Subheading (Exact Harroway .typo-title-block.is-2nd) */}
      <div
        data-typo-row="2"
        className="flex items-center justify-center gap-[3vw] lg:mr-[5vw] will-change-transform"
      >
        <span className="hw-line-mask">
          <span data-typo-rise className="block hw-heading-typo text-[var(--text-primary)]/90">
            {line2}
          </span>
        </span>
        <h2
          data-typo-caption
          className="hidden lg:block m-0 max-w-[23vw] font-body font-light text-[clamp(0.95rem,1.25vw,1.45rem)] leading-[1.24] uppercase tracking-[0.01em] text-left text-[var(--text-primary)]/88"
        >
          {sideStatement}
        </h2>
      </div>

      {/* Row 3 */}
      <div data-typo-row="3" className="flex items-center justify-center will-change-transform">
        <span className="hw-line-mask">
          <span data-typo-rise className="block hw-heading-typo text-[var(--text-primary)]/90">
            {line3}
          </span>
        </span>
      </div>

      {/* Mobile / Tablet Companion Subheading */}
      <div className="lg:hidden mt-5 max-w-lg text-center px-2">
        <h2
          data-typo-caption
          className="m-0 font-body font-light text-sm sm:text-base leading-snug uppercase tracking-[0.02em] text-[var(--text-primary)]/85"
        >
          {sideStatement}
        </h2>
      </div>
    </section>
  );
};
