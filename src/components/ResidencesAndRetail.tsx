import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  MULBERRY_MEDIA,
  PROPERTY_OFFERINGS,
  RETAIL_DATA,
} from "../data/mulberryData";
import {
  HarrowayButton,
  HarrowayLabel,
  ParallaxMedia,
  SplitTextReveal,
} from "./HarrowayUI";
import { ModalType } from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

interface PropertyOfferingsSectionProps {
  onOpenModal: (modal: ModalType) => void;
  onOpenImage: (src: string, caption: string) => void;
}

export const PropertyOfferingsSection: React.FC<PropertyOfferingsSectionProps> = ({
  onOpenModal,
  onOpenImage,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [retailIndex, setRetailIndex] = useState(0);

  // Gentle auto-advance for the 5-image original retail carousel
  useEffect(() => {
    const total = MULBERRY_MEDIA.retailCarousel.length;
    const timer = window.setInterval(() => {
      setRetailIndex((prev) => (prev + 1) % total);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-offering-row]").forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll("[data-offering-stagger]"),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const prevSlide = () => {
    const total = MULBERRY_MEDIA.retailCarousel.length;
    setRetailIndex((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    const total = MULBERRY_MEDIA.retailCarousel.length;
    setRetailIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      id="residential"
      ref={sectionRef}
      className="relative z-[9] w-full flex flex-col overflow-clip"
    >
      {PROPERTY_OFFERINGS.map((item, idx) => {
        const isReversed = idx % 2 === 1;
        const rowBg = isReversed
          ? "bg-[var(--bg-light-base)]"
          : "bg-[var(--bg-light-strong)]";

        return (
          <article
            key={item.id}
            id={item.anchorId}
            data-offering-row
            className={`w-full ${rowBg} text-[var(--text-primary)] flex flex-col ${
              isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-stretch justify-between gap-8 lg:gap-4 border-t border-[var(--accent-800)]/8`}
            style={{
              paddingTop: "var(--section-pad-md)",
              paddingBottom: "var(--section-pad-md)",
              paddingLeft: "var(--container-pad)",
              paddingRight: "var(--container-pad)",
            }}
          >
            {/* Large Architectural Media Frame (58% width on desktop) */}
            <div className="w-full lg:w-[57%] relative">
              {item.carousel ? (
                <div className="relative w-full aspect-[695/915] rounded-[3px] overflow-hidden bg-[var(--accent-800)] group">
                  {item.carousel.map((slide, sIdx) => (
                    <img
                      key={slide.src}
                      src={slide.src}
                      alt={slide.alt}
                      loading="lazy"
                      onClick={() => onOpenImage(slide.src, slide.caption)}
                      className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-700 ease-out ${
                        sIdx === retailIndex
                          ? "opacity-100 scale-100 z-[2]"
                          : "opacity-0 z-[1] pointer-events-none"
                      }`}
                    />
                  ))}
                  {/* Subtle bottom gradient + Harroway crisp slider controls */}
                  <div className="absolute inset-x-0 bottom-0 z-[5] p-4 sm:p-6 bg-gradient-to-t from-[var(--accent-950)]/72 via-[var(--accent-950)]/20 to-transparent flex items-center justify-between text-[var(--accent-50)]">
                    <span className="font-mono-label !text-[0.7rem] text-[var(--accent-50)]/90">
                      0{retailIndex + 1} / 0{item.carousel.length} · Retail
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous retail photo"
                        className="w-9 h-9 rounded-[3px] bg-[var(--accent-50)]/18 hover:bg-[var(--secondary-500)] backdrop-blur-md border border-[var(--accent-50)]/20 text-[var(--accent-50)] inline-flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next retail photo"
                        className="w-9 h-9 rounded-[3px] bg-[var(--accent-50)]/18 hover:bg-[var(--secondary-500)] backdrop-blur-md border border-[var(--accent-50)]/20 text-[var(--accent-50)] inline-flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <ParallaxMedia
                  src={item.image}
                  alt={item.alt}
                  speed={0}
                  onClick={() =>
                    onOpenImage(item.image, item.title)
                  }
                  className={`w-full ${item.id === 'come-home' ? 'aspect-[695/915]' : 'aspect-[710/780]'}`}
                />
              )}
            </div>

            {/* Editorial Specification Column (Exact Harroway .project-listing-about) */}
            <div className="w-full lg:w-[43%] flex items-center justify-center">
              <div className="w-full min-w-0 lg:w-[84%] max-w-[33rem] flex flex-col items-start gap-5 py-2">
                <div data-offering-stagger>
                  <HarrowayLabel
                    primary={item.chipPrimary}
                    secondary={item.chipSecondary}
                    variant="light"
                  />
                </div>

                <SplitTextReveal
                  as="h2"
                  text={item.title}
                  stagger={0.055}
                  className="m-0 hw-heading-lg text-[var(--text-primary)]"
                />

                <p
                  data-offering-stagger
                  className="m-0 text-[0.98rem] sm:text-[1.04rem] font-light leading-[1.62] text-[var(--text-secondary)]"
                >
                  {item.description}
                </p>

                {item.id === "village-retail" && (
                  <span
                    data-offering-stagger
                    className="font-mono-label text-[var(--secondary-600)] pt-1"
                  >
                    {RETAIL_DATA.commercialHeading}
                  </span>
                )}

                {/* 4 Hairline Metadata Rows (Exact Harroway .project-details) */}
                <div
                  data-offering-stagger
                  className="w-full flex flex-col gap-1 pt-1"
                >
                  {item.details.map((row) => (
                    <div
                      key={row.label}
                      className="w-full py-2.5 border-b border-[var(--accent-300)] flex flex-wrap items-center justify-between gap-2"
                    >
                      <span className="font-mono-label text-[var(--text-primary)]/58">
                        {row.label}
                      </span>
                      <span className="font-mono-label min-w-0 break-words text-[var(--text-primary)] text-right flex items-center gap-2 flex-wrap justify-end">
                        {row.href ? (
                          <a
                            href={row.href}
                            target={row.href.startsWith("http") ? "_blank" : undefined}
                            rel={
                              row.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="text-[var(--text-primary)] hover:text-[var(--secondary-600)] underline decoration-[var(--accent-400)] underline-offset-4 transition-colors"
                          >
                            {row.value}
                          </a>
                        ) : (
                          <span>{row.value}</span>
                        )}
                        {row.secondaryHref && row.secondaryValue && (
                          <>
                            <span className="opacity-40">·</span>
                            <a
                              href={row.secondaryHref}
                              className="text-[var(--text-primary)] hover:text-[var(--secondary-600)] no-underline transition-colors"
                            >
                              {row.secondaryValue}
                            </a>
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Row (Exact Harroway Slate Button) */}
                <div
                  data-offering-stagger
                  className="pt-3 flex flex-wrap items-center gap-4"
                >
                  {item.ctaHref ? (
                    <HarrowayButton
                      variant="slate"
                      href={item.ctaHref}
                      external
                    >
                      {item.ctaLabel}
                    </HarrowayButton>
                  ) : (
                    <HarrowayButton
                      variant="slate"
                      onClick={() =>
                        item.ctaAction && onOpenModal(item.ctaAction)
                      }
                    >
                      {item.ctaLabel}
                    </HarrowayButton>
                  )}

                  {item.secondaryCta && (
                    <a
                      href={item.secondaryCta.href}
                      className="font-mono-label text-[var(--accent-800)] hover:text-[var(--secondary-600)] underline underline-offset-4 decoration-[var(--accent-400)] transition-colors py-2"
                    >
                      {item.secondaryCta.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

/* ============================================================
   SECTION 9: HARROWAY DUAL-FRAME ASYMMETRIC SPLIT IMAGE PARALLAX
   ============================================================ */
interface ImageSplitSectionProps {
  onOpenImage: (src: string, caption: string) => void;
}

export const ImageSplitSection: React.FC<ImageSplitSectionProps> = ({
  onOpenImage,
}) => {
  const splitRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = splitRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector("[data-split-left]"),
        { yPercent: 6 },
        {
          yPercent: -6,
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
        el.querySelector("[data-split-right]"),
        { yPercent: -5 },
        {
          yPercent: 5,
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

  return (
    <section
      ref={splitRef}
      className="relative z-[9] w-full bg-[var(--bg-light-base)] py-12 sm:py-16 lg:py-24 overflow-clip"
      style={{
        paddingLeft: "clamp(1rem, 2.5vw, 3rem)",
        paddingRight: "clamp(1rem, 2.5vw, 3rem)",
      }}
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center min-h-[55vh] lg:min-h-[88vh]">
        {/* Smaller Editorial Inset Left (Harroway .image-split-left) */}
        <div
          data-split-left
          className="md:col-span-5 will-change-transform"
        >
          <ParallaxMedia
            src={MULBERRY_MEDIA.retailCarousel[4].src}
            alt={MULBERRY_MEDIA.retailCarousel[4].alt}
            speed={0}
            onClick={() =>
              onOpenImage(
                MULBERRY_MEDIA.retailCarousel[4].src,
                MULBERRY_MEDIA.retailCarousel[4].caption
              )
            }
            className="w-full aspect-[695/915]"
          />
        </div>

        {/* Monumental Architectural Frame Right */}
        <div
          data-split-right
          className="md:col-span-7 will-change-transform"
        >
          <ParallaxMedia
            src={MULBERRY_MEDIA.retailFeature}
            alt="Plates being served at a restaurant"
            speed={0}
            onClick={() =>
              onOpenImage(
                MULBERRY_MEDIA.retailFeature,
                "Experiences Every Day."
              )
            }
            className="w-full aspect-[710/780]"
          />
        </div>
      </div>
    </section>
  );
};
