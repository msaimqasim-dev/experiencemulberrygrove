import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import {
  COMMUNITY_DATA,
  LOCATION_DATA,
  MULBERRY_MEDIA,
  RETAIL_DATA,
} from "../data/mulberryData";
import { ParallaxMedia, SplitTextReveal } from "./HarrowayUI";
import { ModalType } from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

interface CommunityShowcaseProps {
  onOpenModal: (modal: ModalType) => void;
}

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  modal: ModalType;
  metricLabel?: string;
  metricValue?: string;
  image?: string;
  videoSrc?: string;
  poster?: string;
  alt: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "peace-of-place",
    title: COMMUNITY_DATA.heading,
    description: COMMUNITY_DATA.paragraph,
    actionLabel: "View masterplan",
    modal: "masterplan",
    metricLabel: "Master-planned acres",
    metricValue: "1,000+",
    videoSrc: MULBERRY_MEDIA.communityVideo,
    poster: MULBERRY_MEDIA.communityPoster,
    alt: "Mulberry Grove lakes, trails, and greenway — Peace of Place",
  },
  {
    id: "idyllically-located",
    title: LOCATION_DATA.heading,
    description: LOCATION_DATA.paragraph,
    actionLabel: "View location map",
    modal: "map",
    metricLabel: "Minutes to Columbus",
    metricValue: "20 min",
    image: MULBERRY_MEDIA.locationPhoto,
    alt: "A family enjoying time together outdoors",
  },
  {
    id: "experiences-every-day",
    title: RETAIL_DATA.heading,
    description: RETAIL_DATA.paragraph,
    actionLabel: "Commercial land sale",
    modal: "commercial",
    image: MULBERRY_MEDIA.retailFeature,
    alt: "Plates being served at a restaurant",
  },
];

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({
  onOpenModal,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>("[data-showcase-card]");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 44, opacity: 0.85 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          card.querySelectorAll("[data-card-text]"),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 78%",
              once: true,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="community"
      ref={sectionRef}
      className="relative z-[9] w-full bg-[var(--bg-light-base)] flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4 overflow-clip"
      style={{
        paddingLeft: "var(--container-pad)",
        paddingRight: "var(--container-pad)",
      }}
    >
      {SHOWCASE_ITEMS.map((item) => {
        const isFlipped = item.id === "experiences-every-day";
        return (
        <article
          key={item.id}
          data-showcase-card
          className={`relative w-full rounded-[3px] overflow-hidden text-[var(--text-inverse)] ${item.image ? 'grid grid-cols-1 lg:grid-cols-12 bg-[var(--secondary-500)]' : 'min-h-[76vh] lg:min-h-[84vh] flex flex-col justify-end bg-[var(--accent-800)]'}`}
        >
          {item.image ? (
            <div className={`min-w-0 lg:col-span-5 ${isFlipped ? "lg:order-2" : "lg:order-1"}`}>
              <ParallaxMedia src={item.image} alt={item.alt} speed={0} className={`w-full h-full ${item.id === 'idyllically-located' ? 'aspect-[695/915]' : 'aspect-[710/780]'} !rounded-none`} />
            </div>
          ) : (
          <div className="absolute inset-0 z-[1]">
            <ParallaxMedia
              src={item.image}
              videoSrc={item.videoSrc}
              poster={item.poster}
              alt={item.alt}
              speed={10}
              className="w-full h-full !rounded-none"
            />
            {/* Exact Harroway lower gradient + subtle edge vignette for guaranteed contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(18,21,22,0.12) 0%, rgba(18,21,22,0.34) 45%, rgba(18,21,22,0.88) 100%)",
              }}
            />
          </div>
          )}

          <div className={`relative z-10 ${item.image ? `lg:col-span-7 flex flex-col justify-center ${isFlipped ? "lg:order-1" : "lg:order-2"}` : 'flex flex-col lg:flex-row lg:items-end justify-between'}`}>
          <button
            type="button"
            onClick={() => onOpenModal(item.modal)}
            className={`hw-showcase-panel relative z-10 w-full p-6 sm:p-9 lg:p-12 flex flex-col items-start gap-4 text-left bg-transparent border-0 text-[var(--text-inverse)] ${item.image ? 'justify-center' : 'lg:max-w-[44rem] justify-end mt-auto'}`}
          >
            <span className="hw-showcase-panel-bg" aria-hidden="true" />
            <SplitTextReveal
              as="h2"
              text={item.title}
              stagger={0.06}
              className="relative z-[2] m-0 hw-heading-xl text-[var(--accent-50)]"
            />
            <p
              data-card-text
              className="relative z-[2] m-0 text-[0.94rem] sm:text-[1rem] font-light leading-[1.62] text-[var(--accent-50)]/88 max-w-[38rem]"
            >
              {item.description}
            </p>
            <span
              data-card-text
              className="relative z-[2] inline-flex items-center gap-2.5 pt-2 text-[var(--accent-50)]"
            >
              <span className="w-7 h-7 rounded-[2px] bg-[var(--secondary-500)] inline-flex items-center justify-center">
                <Plus className="hw-plus-spin w-4 h-4" strokeWidth={1.8} />
              </span>
              <span className="font-mono-label tracking-[0.04em]">
                {item.actionLabel}
              </span>
            </span>
          </button>

          {item.metricValue && (
          <div
            data-card-text
            className="relative z-10 flex items-end justify-between lg:justify-end gap-6 sm:gap-10 px-6 pb-7 sm:px-9 sm:pb-9 lg:p-12 shrink-0 border-t border-[var(--accent-50)]/12 lg:border-t-0"
          >
            <div className="hidden xl:block w-20 h-px bg-[var(--accent-50)]/35 mb-3" />
            <span className="font-mono-label text-[var(--accent-50)]/75 mb-1.5">
              {item.metricLabel}
            </span>
            <span className="font-display font-light text-[clamp(2.35rem,4vw,4.35rem)] leading-none text-[var(--accent-50)]">
              {item.metricValue}
            </span>
          </div>
          )}
          </div>
        </article>
        );
      })}
    </section>
  );
};
