import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Compass,
  Mail,
  MapPin,
  Phone,
  Trees,
  Waves,
} from "lucide-react";
import {
  COMMUNITY_STATS_CARDS,
  CONTACT_DIRECTORY,
  MULBERRY_MEDIA,
} from "../data/mulberryData";
import {
  HarrowayButton,
  HarrowayLabel,
  MulberryMonogram,
  SplitTextReveal,
} from "./HarrowayUI";
import { ModalType } from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

interface PartnersStatsSectionProps {
  onOpenDirectory: () => void;
}

const STACK_PHOTOS = [
  {
    src: MULBERRY_MEDIA.visionPoster,
    alt: "Mulberry Grove Vision — Gather Together",
  },
  {
    src: MULBERRY_MEDIA.locationPhoto,
    alt: "Mulberry Grove Harris County Setting",
  },
  {
    src: MULBERRY_MEDIA.residentialSingleFamily,
    alt: "Mulberry Grove Single-Family Residences",
  },
  {
    src: MULBERRY_MEDIA.residentialApartments,
    alt: "Mulberry Grove Apartment Homes",
  },
];

const STAT_ICONS = {
  compass: Compass,
  trees: Trees,
  waves: Waves,
  map: MapPin,
};

export const PartnersStatsSection: React.FC<PartnersStatsSectionProps> = ({
  onOpenDirectory,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-stat-card]"),
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[9] w-full bg-[var(--bg-dark-base)] text-[var(--text-inverse)] grid grid-cols-1 lg:grid-cols-3 border-t border-[var(--accent-50)]/10 overflow-x-clip"
    >
      {/* Column 1: Sticky Editorial Title + Grove-Green Action — single sticky viewport card so the button can never overlap the copy */}
      <div className="lg:sticky lg:top-[var(--nav-height)] lg:h-[calc(100svh-var(--nav-height))] lg:self-start p-7 sm:p-10 lg:p-12 flex flex-col justify-center items-start gap-8 lg:gap-10 border-b lg:border-b-0 lg:border-r border-[var(--accent-50)]/10">
        <div className="space-y-6 w-full">
          <HarrowayLabel
            primary="Our"
            secondary="Community"
            variant="dark"
          />
          <SplitTextReveal
            as="h2"
            text="Gather Together."
            className="m-0 hw-heading-xl text-[var(--accent-50)] max-w-[20rem]"
          />
          <p className="m-0 text-sm sm:text-[0.95rem] font-light leading-relaxed text-[var(--accent-200)] max-w-[22rem]">
            Where new homes are built with an appreciation for the land and your fellow neighbors.
          </p>
        </div>

        <div className="w-full">
          <HarrowayButton variant="grove" onClick={onOpenDirectory}>
            Partner Directory
          </HarrowayButton>
        </div>
      </div>

      {/* Column 2: Sticky Stacking Photography Column (Exact Harroway .stats-cms-image-item) */}
      <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
        {STACK_PHOTOS.map((photo, idx) => (
          <div
            key={photo.src}
            style={{ top: `calc(var(--nav-height) + ${idx * 10}px)` }}
            className="lg:sticky w-full aspect-[695/915] rounded-[3px] overflow-hidden bg-[var(--accent-700)] shadow-[0_-10px_30px_rgba(0,0,0,0.28)]"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Column 3: Mineral-Slate (#a1acb4) Stat Cards with Thin Line Icons (Exact Harroway .stats-cms-item) */}
      <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 justify-between">
        {COMMUNITY_STATS_CARDS.map((card) => {
          const Icon = STAT_ICONS[card.icon];
          return (
            <div
              key={card.label}
              data-stat-card
              className="flex-1 min-h-[17rem] sm:min-h-[20rem] rounded-[3px] bg-[var(--accent-300)] text-[var(--text-primary)] p-7 sm:p-9 lg:p-10 flex flex-col justify-between gap-8"
            >
              <p className="m-0 text-[0.98rem] sm:text-[1.04rem] font-light leading-[1.58] text-[var(--text-secondary)] max-w-[24rem]">
                {card.description}
              </p>

              <div className="flex items-end justify-between gap-4 pt-4 border-t border-[var(--accent-800)]/14">
                <div className="space-y-1.5">
                  <span className="block font-display font-light text-[clamp(2.35rem,3.6vw,3.85rem)] leading-none text-[var(--text-primary)]">
                    {card.number}
                  </span>
                  <span className="block font-mono-label text-[var(--accent-800)]/78">
                    {card.label}
                  </span>
                </div>
                <span className="w-12 h-12 rounded-[3px] border border-[var(--accent-800)]/20 inline-flex items-center justify-center text-[var(--accent-900)] shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.35} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ============================================================
   SECTION 12: HARROWAY STICKY EXPANDING-IMAGE CTA + FROSTED FOOTER
   ============================================================ */
interface FooterSectionProps {
  onNavigate: (id: string) => void;
  onOpenModal: (modal: ModalType) => void;
}

const FOOTER_LINKS: { label: string; id?: string; modal?: ModalType }[] = [
  { label: "Home", id: "top" },
  { label: "Vision", id: "vision" },
  { label: "Community", id: "community" },
  { label: "Location", id: "location" },
  { label: "Residential", id: "residential" },
  { label: "Retail", id: "retail" },
  { label: "Master Plan", modal: "masterplan" },
  { label: "Location Map", modal: "map" },
  { label: "Contact", id: "contact" },
];

export const FooterSection: React.FC<FooterSectionProps> = ({
  onNavigate,
  onOpenModal,
}) => {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };
        const expandEl = el.querySelector("[data-footer-expand]");
        const veilEl = el.querySelector("[data-footer-veil]");

        gsap.fromTo(
          expandEl,
          {
            width: isDesktop ? "34vw" : "78vw",
            height: isDesktop ? "62vh" : "52vh",
            borderRadius: "3px",
          },
          {
            width: "100vw",
            height: "100svh",
            borderRadius: "0px",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          veilEl,
          { opacity: 0.32 },
          {
            opacity: 0.76,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.6,
            },
          }
        );
      },
      el
    );

    return () => mm.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-[10] w-full bg-[var(--bg-dark-base)] text-[var(--text-inverse)] border-t border-[var(--accent-50)]/12 overflow-x-clip"
    >
      {/* Part A: Exact Harroway Sticky Scroll-Expanding CTA Stage (.footer-action) */}
      <div className="sticky top-0 z-[2] h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Scroll-expanding center architectural image */}
        <div
          data-footer-expand
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] min-w-[17rem] w-[36vw] h-[60vh] rounded-[3px] overflow-hidden will-change-[width,height]"
        >
          <img
            src={MULBERRY_MEDIA.visionPoster}
            alt="Welcome to Mulberry Grove — Simply Beautiful Living"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div
            data-footer-veil
            className="absolute inset-0 bg-[var(--bg-dark-strong)] opacity-35"
          />
        </div>

        {/* Centered Monumental Nyght Serif Uppercase CTA Title + Grove Button */}
        <div className="relative z-10 flex flex-col items-center text-center gap-7 max-w-[60rem]">
          <SplitTextReveal
            as="h2"
            text="Welcome to Mulberry Grove"
            stagger={0.07}
            className="m-0 hw-heading-cta text-[var(--accent-50)] drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)]"
          />
          <HarrowayButton
            variant="grove"
            onClick={() => onNavigate("contact")}
          >
            Get Connected
          </HarrowayButton>
        </div>
      </div>

      {/* Part B: Exact Harroway Frosted Dark Editorial Footer Content (.footer-content) */}
      <div
        data-footer-content
        className="relative z-10 w-full pt-12 pb-8"
        style={{
          paddingLeft: "var(--container-pad)",
          paddingRight: "var(--container-pad)",
        }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch mb-12">
          {/* Left Frosted Editorial Menu Card (Exact Harroway .footer-menu) */}
          <div className="lg:col-span-5 rounded-[3px] bg-[var(--accent-950)]/82 backdrop-blur-2xl border border-[var(--accent-50)]/12 flex flex-col justify-between overflow-hidden">
            <nav
              aria-label="Footer navigation"
              className="p-7 sm:p-10 flex flex-col items-start gap-1"
            >
              {FOOTER_LINKS.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    if (link.id) onNavigate(link.id);
                    if (link.modal) onOpenModal(link.modal);
                  }}
                  className="py-1 bg-transparent border-0 p-0 cursor-pointer font-body font-light text-[clamp(1.35rem,2vw,2rem)] leading-[1.15] text-[var(--accent-50)]/60 hover:text-[var(--accent-50)] transition-colors duration-200 text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Full-Width Hover-Sweep Contact Action Rows (Exact Harroway .contact-link) */}
            <div className="border-t border-[var(--accent-50)]/12 flex flex-col">
              <a
                href="mailto:info@woodruffrealestateservices.com"
                className="hw-contact-sweep px-7 sm:px-10 py-4 border-b border-[var(--accent-50)]/10 flex items-center gap-3 text-[var(--accent-50)] no-underline text-sm sm:text-base"
              >
                <Mail className="relative z-10 w-4 h-4 text-[var(--accent-300)] shrink-0" />
                <span className="relative z-10 truncate">
                  info@woodruffrealestateservices.com
                </span>
              </a>
              <div className="px-7 sm:px-10 py-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:text-base">
                <a href="tel:7062213632" className="inline-flex items-center gap-3 text-[var(--accent-50)] no-underline hover:underline underline-offset-4"><Phone size={15} className="opacity-60" />706.221.3632</a>
                <a href="tel:7067866700" className="text-[var(--accent-50)] no-underline hover:underline underline-offset-4">706.786.6700</a>
              </div>
            </div>
          </div>

          {/* Right Frosted Official Mulberry Grove Brand + Verbatim 3-Partner Directory */}
          <div className="lg:col-span-7 rounded-[3px] bg-[var(--accent-950)]/82 backdrop-blur-2xl border border-[var(--accent-50)]/12 p-7 sm:p-10 flex flex-col justify-between gap-10">
            <div className="flex flex-wrap items-start justify-between gap-6 pb-8 border-b border-[var(--accent-50)]/12">
              <img
                src={MULBERRY_MEDIA.logo}
                alt="Mulberry Grove — Simply Beautiful Living"
                className="h-24 sm:h-28 w-auto object-contain"
              />
              <div className="flex items-center gap-4 text-[var(--accent-300)]">
                <div className="text-right hidden sm:block">
                  <span className="font-mono-label block text-[var(--accent-50)]">
                    Harris County, Georgia
                  </span>
                  <span className="font-mono-label block !text-[0.66rem] text-[var(--accent-300)] mt-1">
                    Highway 185 · North of Columbus
                  </span>
                </div>
                <MulberryMonogram className="w-5 h-12 text-[var(--accent-50)]/80" />
              </div>
            </div>

            {/* All 3 Official Mulberry Grove Inquiry Blocks (100% Verbatim) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
              {CONTACT_DIRECTORY.map((partner) => (
                <div key={partner.company} className="space-y-2.5">
                  <span className="font-mono-label !text-[0.66rem] text-[var(--accent-300)] block">
                    {partner.category}
                  </span>
                  <h3 className="m-0 font-display text-lg leading-snug text-[var(--accent-50)]">
                    {partner.company}
                  </h3>
                  <div className="text-sm font-light text-[var(--accent-200)] space-y-1 leading-relaxed">
                    {partner.people.map((p) => (
                      <div key={p.name}>
                        {p.email ? (
                          <a
                            href={`mailto:${p.email}`}
                            className="text-[var(--accent-50)] hover:underline underline-offset-2 no-underline"
                          >
                            {p.name}
                          </a>
                        ) : (
                          <span className="text-[var(--accent-50)]">{p.name}</span>
                        )}
                        {p.role ? ` – ${p.role} ` : " – "}
                        <a
                          href={`tel:${p.tel}`}
                          className="text-[var(--accent-50)]/90 hover:text-white underline underline-offset-2"
                        >
                          {p.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2.5 pt-1 text-xs">
                    <a
                      href={`mailto:${partner.email}`}
                      className="font-mono-label !text-[0.68rem] text-[var(--accent-50)]/85 hover:text-white underline underline-offset-4"
                    >
                      Email
                    </a>
                    <span className="text-[var(--accent-500)]">|</span>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 font-mono-label !text-[0.68rem] text-[var(--accent-50)]/85 hover:text-white underline underline-offset-4"
                    >
                      Website
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exact Harroway Subfooter Credits Bar (.subfooter-credits) */}
        <div className="w-full rounded-[3px] bg-[var(--accent-950)]/75 backdrop-blur-xl px-5 py-4 border-b border-[var(--accent-50)]/20 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--accent-200)]">
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/privacy-policy/"
              className="font-mono-label !text-[0.7rem] text-[var(--accent-50)]/80 hover:text-white bg-transparent border-0 p-0 cursor-pointer underline underline-offset-4"
            >
              Privacy Policy
            </a>
            <button
              type="button"
              onClick={() => onOpenModal("masterplan")}
              className="font-mono-label !text-[0.7rem] text-[var(--accent-50)]/75 hover:text-white bg-transparent border-0 p-0 cursor-pointer"
            >
              Masterplan
            </button>
            <button
              type="button"
              onClick={() => onOpenModal("map")}
              className="font-mono-label !text-[0.7rem] text-[var(--accent-50)]/75 hover:text-white bg-transparent border-0 p-0 cursor-pointer"
            >
              Location Map
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono-label !text-[0.7rem] text-[var(--accent-50)]/80">
            <span>© 2026</span>
            <span className="opacity-40">|</span>
            <a
              href="https://www.woodruffrealestateservices.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-50)]/90 hover:text-white underline underline-offset-4"
            >
              Woodruff Real Estate Services, LLC
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
