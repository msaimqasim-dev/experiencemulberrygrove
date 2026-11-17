import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   HARROWAY ROLLING BUTTON
   ============================================================ */
interface HarrowayButtonProps {
  children: string;
  variant?: "grove" | "slate" | "dark" | "outline";
  href?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit";
  className?: string;
  fullWidth?: boolean;
}

export const HarrowayButton: React.FC<HarrowayButtonProps> = ({
  children,
  variant = "grove",
  href,
  external,
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
}) => {
  const classes = `hw-btn hw-btn--${variant} ${fullWidth ? "w-full" : ""} ${className}`;
  const Icon = external ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      <span className="hw-btn-text-mask">
        <span className="hw-btn-text-1">{children}</span>
        <span className="hw-btn-text-2" aria-hidden="true">
          {children}
        </span>
      </span>
      <span className="hw-btn-icon-wrap">
        <Icon className="hw-btn-icon w-4 h-4" strokeWidth={1.6} />
      </span>
      <span className="hw-btn-bg" aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
};

/* ============================================================
   HARROWAY DUAL-CHIP MONO LABEL
   ============================================================ */
interface HarrowayLabelProps {
  primary: string;
  secondary?: string;
  variant?: "light" | "dark" | "grove";
  className?: string;
}

export const HarrowayLabel: React.FC<HarrowayLabelProps> = ({
  primary,
  secondary,
  variant = "light",
  className = "",
}) => {
  return (
    <div className={`hw-label hw-label--${variant} ${className}`}>
      <span className="hw-label-chip">{primary}</span>
      {secondary && <span className="hw-label-chip">{secondary}</span>}
    </div>
  );
};

/* ============================================================
   GSAP SPLIT WORD / LINE TYPOGRAPHY REVEAL
   ============================================================ */
interface SplitTextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}

export const SplitTextReveal: React.FC<SplitTextRevealProps> = ({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.035,
  immediate = false,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wordEls = el.querySelectorAll<HTMLElement>("[data-split-word]");
    if (prefersReduced || wordEls.length === 0) {
      gsap.set(wordEls, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (immediate) {
        gsap.fromTo(
          wordEls,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger,
            delay,
            ease: "power3.out",
            clearProps: "transform",
          }
        );
      } else {
        gsap.fromTo(
          wordEls,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [text, delay, stagger, immediate]);

  const words = text.split(" ");

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      aria-label={text}
    >
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
          aria-hidden="true"
        >
          <span data-split-word className="inline-block will-change-transform">
            {word}
          </span>
          {idx < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
};

/* ============================================================
   GSAP SCROLL PARALLAX MEDIA (IMAGE OR HD VIDEO)
   ============================================================ */
interface ParallaxMediaProps {
  src?: string;
  videoSrc?: string;
  poster?: string;
  alt: string;
  className?: string;
  mediaClassName?: string;
  speed?: number;
  objectPosition?: string;
  videoObjectPosition?: string;
  onClick?: () => void;
}

export const ParallaxMedia: React.FC<ParallaxMediaProps> = ({
  src,
  videoSrc,
  poster,
  alt,
  className = "",
  mediaClassName = "",
  speed = 9,
  objectPosition = 'center',
  videoObjectPosition,
  onClick,
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const travel = Math.min(Math.abs(speed), 4);

  useEffect(() => {
    const wrap = wrapRef.current;
    const media = mediaRef.current;
    if (!wrap || !media) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !travel) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -travel },
        {
          yPercent: travel,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [travel]);

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View image: ${alt}` : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`media-viewport relative overflow-hidden rounded-[3px] ${onClick ? "cursor-pointer group" : ""} ${className}`}
    >
      <div ref={mediaRef} data-parallax-plane style={{ position: 'absolute', inset: travel ? '-6% 0' : '0', willChange: travel ? 'transform' : undefined }}>
        <img
          src={videoSrc ? poster : src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition }}
          className={`absolute inset-0 w-full h-full object-cover ${mediaClassName}`}
        />
        {videoSrc && (
          <video
            autoPlay loop muted playsInline preload="metadata" poster={poster}
            aria-label={alt}
            onLoadedData={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
            style={{ objectPosition: videoObjectPosition ?? objectPosition, opacity: videoReady ? 1 : 0 }}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   AUTHENTIC MULBERRY GROVE VECTOR EMBLEMS (FROM ORIGINAL SITE)
   ============================================================ */

/** Exact Mulberry blossom/leaf mark from experiencemulberrygrove.com */
export const MulberryBlossomMark: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg viewBox="0 0 13 14" fill="currentColor" className={className} aria-hidden="true">
    <path d="m10.96 5.63c-1.22.65-1.72.22-3.08.11 1.25-3.36 1.75-3.25 5.12-3.36-.14.51-1.04 2.6-2.04 3.25" />
    <path d="m4.87 10.03c.18 2.06.82 2.67 1.54 3.97.82-1.66 1.54-2.02 1.61-4.01 0-1.66-1.22-2.85-1.61-3.32-.18.58-1.43 1.41-1.54 3.36" />
    <path d="m3.69 10.46c.79-1.34.36-1.91.36-3.39-3.66 1.23-3.55 1.81-3.94 5.52.53-.14 2.83-1.04 3.58-2.13" />
    <path d="m2.04 5.59c1.22.65 1.72.22 3.08.11-1.25-3.35-1.75-3.25-5.12-3.35.14.5 1.04 2.63 2.04 3.24" />
    <path d="m5.26 2.71c.14 1.66.64 2.13 1.22 3.18.68-1.34 1.22-1.63 1.29-3.22 0-1.33-.97-2.27-1.29-2.67-.14.47-1.14 1.15-1.22 2.71" />
    <path d="m9.35 10.46c-.79-1.33-.36-1.91-.36-3.39 3.65 1.23 3.55 1.8 3.94 5.52-.57-.11-2.87-1.04-3.58-2.13" />
  </svg>
);

/** Exact Mulberry Grove vertical M | G monogram from experiencemulberrygrove.com */
export const MulberryMonogram: React.FC<{ className?: string }> = ({
  className = "w-5 h-11",
}) => (
  <svg viewBox="0 0 31 76" fill="currentColor" className={className} aria-hidden="true">
    <path d="m30.56 23.23h-2.91c-.03 0-.04-.01-.07-.03l-.15-.11c-.03-.03-.04-.05-.04-.09.13-6.18.15-12.62.04-19.66l-1.42 1.78c-3.34 4.19-7.92 9.94-10.06 12.79-.01.03-.05.04-.08.04l-1.72.08c-.04 0-.07-.01-.09-.04-2.5-3.36-7.87-10.43-11.23-14.65-.06 5.38-.08 13.76.04 19.66 0 .03-.01.05-.03.08l-.11.11c-.03.01-.05.03-.08.03h-1.9c-.03 0-.04-.01-.07-.03l-.15-.11c-.03-.03-.04-.05-.04-.09.15-7.04.15-17.47 0-22.76 0-.04.01-.07.04-.09l.15-.11c.02-.02.04-.03.07-.03h3.42c.04 0 .07.01.09.04 2.69 3.78 8.54 11.25 11.32 14.78 2.83-3.32 7.92-9.71 11.61-14.78.02-.03.06-.04.09-.04h3.25c.03 0 .05.01.08.03l.11.11c.03.03.03.05.03.08-.12 6.58-.24 15.11 0 22.72 0 .03 0 .05-.03.07l-.11.15c.01.06-.01.07-.05.07" />
    <path d="m17.4 76c-10.73 0-17.4-4.56-17.4-11.9 0-3.5 1.83-6.66 5.14-8.87 3.16-2.12 7.46-3.29 12.1-3.29 5.44 0 9.85.66 12.77 1.91l.07.03v3.22l-.27.13-.05-.04c-1.69-1.41-4.82-3.29-12.39-3.29-8.63 0-13.57 3.71-13.57 10.2 0 6.69 4.44 9.94 13.6 9.94 4.86 0 7.69-.9 10.18-1.83.07-2.53.08-3.99-.04-8v-.04l.21-.21h3.02l.23.17v.05c-.15 3.81-.15 5.9 0 9.33v.08l-.07.03c-3.21 1.23-7.05 2.38-13.53 2.38" />
    <path d="m.21 37.3h30.77v.98h-30.77z" />
  </svg>
);

/** Harroway rotating architectural seal combining circular mono marquee + Mulberry blossom */
export const MulberryRadialSeal: React.FC<{ className?: string }> = ({
  className = "w-24 h-24",
}) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full hw-spin-slow text-[var(--accent-800)]"
      aria-hidden="true"
    >
      <defs>
        <path
          id="mulberryCirclePath"
          d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
        />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="0.75"
      />
      <circle
        cx="60"
        cy="60"
        r="32"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="0.75"
      />
      <text
        fill="currentColor"
        fontSize="7.4"
        fontFamily="var(--font-mono)"
        letterSpacing="2.3px"
        opacity="0.78"
      >
        <textPath href="#mulberryCirclePath" startOffset="0%">
          MULBERRY GROVE • HARRIS COUNTY GA •
        </textPath>
      </text>
    </svg>
    <MulberryBlossomMark className="w-6 h-6 absolute text-[var(--secondary-500)]" />
  </div>
);
