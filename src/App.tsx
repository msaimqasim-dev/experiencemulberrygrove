import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MULBERRY_MEDIA } from "./data/mulberryData";
import { ModalType, Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import {
  TypoTitlesSection,
  VisionGridSection,
} from "./components/VisionAndTypo";
import { CommunityShowcase } from "./components/CommunityShowcase";
import {
  LocationStickySection,
  StatementRevealSection,
} from "./components/StatementAndLocation";
import {
  ImageSplitSection,
  PropertyOfferingsSection,
} from "./components/ResidencesAndRetail";
import {
  ContactTabKey,
  ContactTabsSection,
} from "./components/ContactTabsSection";
import {
  FooterSection,
  PartnersStatsSection,
} from "./components/PartnersStatsAndFooter";
import { Modals } from "./components/Modals";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";

gsap.registerPlugin(ScrollTrigger);

export function App() {
  return /^\/privacy-policy(?:\/index\.html|\/)?$/.test(window.location.pathname)
    ? <PrivacyPolicyPage />
    : <HomePage />;
}

function HomePage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    caption: string;
  } | null>(null);
  const [contactTab, setContactTab] = useState<ContactTabKey>("form");
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll tightly synced with GSAP ScrollTrigger (exact Harroway feel)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      allowNestedScroll: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after custom fonts finish rendering
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis when any modal or lightbox is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (activeModal || lightboxImage) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [activeModal, lightboxImage]);

  // Refresh ScrollTrigger when contact tab height changes
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [contactTab]);

  const scrollToSection = useCallback((targetId: string) => {
    if (targetId === "top") {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 1.25 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const el = document.getElementById(targetId);
    if (!el) return;

    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
    const target = window.scrollY + el.getBoundingClientRect().top - headerHeight;
    if (lenisRef.current) {
      // Numeric targets avoid applying the CSS scroll margin a second time.
      lenisRef.current.scrollTo(target, { duration: 1.25 });
    } else {
      window.scrollTo({ top: target, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, []);

  const handleOpenImage = useCallback((src: string, caption: string) => {
    setLightboxImage({ src, caption });
  }, []);

  const handleOpenDirectory = useCallback(() => {
    setContactTab("directory");
    window.setTimeout(() => {
      scrollToSection("contact");
    }, 60);
  }, [scrollToSection]);

  return (
    <div className="min-h-screen w-full bg-[var(--bg-body)] text-[var(--text-primary)]">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#vision"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-[3px] focus:bg-[var(--secondary-500)] focus:text-[var(--accent-50)]"
      >
        Skip To Main Content
      </a>

      {/* 0. Exact Harroway 3-Zone Pill Navigation + Mega-Menu + Fullscreen Drawer */}
      <Navbar onNavigate={scrollToSection} onOpenModal={setActiveModal} />

      <main className="w-full">
        {/* 1. Harroway Full-Viewport Hero with Mulberry Grove HD Hero Video & Stat Tiles */}
        <HeroSection onScrollNext={() => scrollToSection("vision")} />

        {/* 2. Harroway 3-Column Vision Grid ("Gather Together." + Mulberry Grove Vision HD Video) */}
        <VisionGridSection onNavigate={scrollToSection} />

        {/* 3. Harroway Kinetic 3-Row Scroll Typography #1 ("PEACE OF / PLACE / HARRIS COUNTY") */}
        <TypoTitlesSection
          line1="Peace"
          line2="of"
          line3="Place."
          sideStatement="All of it perfectly suited to its natural surroundings, allowing for a slower pace and a true sense of place."
          surface="base"
        />

        {/* 4. Harroway Full-Bleed Parallax Showcase Stack (Community HD Video, Location, Village Retail) */}
        <CommunityShowcase onOpenModal={setActiveModal} />

        {/* 5. Harroway Dark Sticky Manifesto Word Reveal + 3 Orbit Rings + 4 Floating Parallax Frames */}
        <StatementRevealSection onOpenImage={handleOpenImage} />

        {/* 6. Harroway Sticky Grove-Green Location & Official SVG Map + 2x3 Local Drive Times Grid */}
        <LocationStickySection onOpenModal={setActiveModal} />

        {/* 7. Harroway Kinetic 3-Row Scroll Typography #2 with Inline Editorial Photo ("COME / HOME / RESIDENCES") */}
        <TypoTitlesSection
          line1="Come"
          line2="Home."
          line3="Residential"
          sideStatement="From residences to own to apartments for lease, Mulberry Grove is creating dwelling places designed with your unique needs in mind."
          image={MULBERRY_MEDIA.residentialIntro}
          imageAlt="Mulberry Grove Residences — Come Home"
          surface="strong"
        />

        {/* 8. Harroway Alternating Split Property Showcase (Stone Martin, Greystone, Retail Carousel, Come Home) */}
        <PropertyOfferingsSection
          onOpenModal={setActiveModal}
          onOpenImage={handleOpenImage}
        />

        {/* 9. Harroway Dual-Frame Asymmetric Opposing Scroll Parallax Gallery */}
        <ImageSplitSection onOpenImage={handleOpenImage} />

        {/* 10. Harroway 3-Tab Interactive Section (Get Connected Form / Community Guide / Directory) */}
        <ContactTabsSection
          activeTab={contactTab}
          onTabChange={setContactTab}
          onOpenModal={setActiveModal}
        />

        {/* 11. Harroway Dark 3-Column Sticky Photo Stack & Community Metric Cards */}
        <PartnersStatsSection onOpenDirectory={handleOpenDirectory} />

        {/* 12. Harroway Sticky Scroll-Expanding CTA Stage + Frosted Editorial Footer */}
        <FooterSection
          onNavigate={(id) => {
            if (id === "contact") setContactTab("form");
            scrollToSection(id);
          }}
          onOpenModal={setActiveModal}
        />
      </main>

      {/* Harroway Interactive Lightboxes: Masterplan, Location Map SVG, Commercial, Gallery */}
      <Modals
        activeModal={activeModal}
        onCloseModal={() => setActiveModal(null)}
        lightboxImage={lightboxImage}
        onCloseLightbox={() => setLightboxImage(null)}
      />
    </div>
  );
}

export default App;
