import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  LOCATION_DATA,
  CLIENT_SOURCE,
  MULBERRY_MEDIA,
  RETAIL_DATA,
} from "../data/mulberryData";
import { HarrowayButton, HarrowayLabel } from "./HarrowayUI";
import { ModalType } from "./Navbar";

interface ModalsProps {
  activeModal: ModalType;
  onCloseModal: () => void;
  lightboxImage: { src: string; caption: string } | null;
  onCloseLightbox: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onCloseModal,
  lightboxImage,
  onCloseLightbox,
}) => {
  const [zoom, setZoom] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZoom(1);
  }, [activeModal]);

  useEffect(() => {
    const isAnyOpen = Boolean(activeModal || lightboxImage);
    if (!isAnyOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const firstButton = dialog?.querySelector<HTMLElement>('button');
    firstButton?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseModal();
        onCloseLightbox();
      }
      if (e.key === 'Tab' && dialog) {
        const controls = [...dialog.querySelectorAll<HTMLElement>('a[href],button,input,textarea,[tabindex="0"]')].filter((el) => el.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [activeModal, lightboxImage, onCloseModal, onCloseLightbox]);

  /* High-Res Photo Lightbox */
  if (lightboxImage) {
    return (
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={lightboxImage.caption}
        onClick={onCloseLightbox}
        data-lenis-prevent
        className="fixed inset-0 z-[130] bg-[var(--accent-950)]/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
      >
        <button
          type="button"
          onClick={onCloseLightbox}
          aria-label="Close image preview"
          className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[var(--accent-50)]/14 hover:bg-[var(--secondary-500)] text-[var(--accent-50)] border border-[var(--accent-50)]/20 inline-flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl w-full flex flex-col items-center gap-4"
        >
          <img
            src={lightboxImage.src}
            alt={lightboxImage.caption}
            className="max-h-[80vh] w-auto max-w-full object-contain rounded-[3px] shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
          />
          <span className="font-mono-label text-[var(--accent-200)] text-center">
            {lightboxImage.caption}
          </span>
        </div>
      </div>
    );
  }

  if (!activeModal) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={activeModal === 'map' ? 'Mulberry Grove Location Map' : activeModal === 'masterplan' ? 'Mulberry Grove Master Plan' : 'For Commercial Land Sale'}
      data-lenis-prevent
      onClick={onCloseModal}
      className="fixed inset-0 z-[120] bg-[var(--accent-950)]/82 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* 1. ZONING MASTERPLAN INTERACTIVE MODAL */}
      {activeModal === "masterplan" && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl max-h-[92vh] rounded-[3px] bg-[var(--accent-50)] text-[var(--text-primary)] flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="px-5 sm:px-7 py-4 bg-[var(--bg-dark-base)] text-[var(--text-inverse)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <HarrowayLabel
                primary="1,000+ Acres"
                secondary="Master Plan"
                variant="dark"
              />
              <h3 className="m-0 font-display text-lg sm:text-xl hidden md:block">
                Mulberry Grove Zoning Masterplan
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
                aria-label="Zoom out"
                className="w-9 h-9 rounded-[3px] bg-[var(--accent-50)]/12 hover:bg-[var(--accent-50)]/22 text-[var(--accent-50)] border-0 cursor-pointer inline-flex items-center justify-center"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono-label text-xs px-2 text-[var(--accent-200)]">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.5).toFixed(1)))}
                aria-label="Zoom in"
                className="w-9 h-9 rounded-[3px] bg-[var(--accent-50)]/12 hover:bg-[var(--accent-50)]/22 text-[var(--accent-50)] border-0 cursor-pointer inline-flex items-center justify-center"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <a
                href={CLIENT_SOURCE.masterPlan}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-3 h-9 rounded-[3px] bg-[var(--secondary-500)] hover:bg-[var(--secondary-600)] text-[var(--accent-50)] font-mono-label !text-[0.68rem] no-underline"
              >
                Full Size <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onCloseModal}
                aria-label="Close modal"
                className="w-9 h-9 rounded-[3px] bg-[var(--accent-50)]/15 hover:bg-[var(--secondary-500)] text-[var(--accent-50)] border-0 cursor-pointer inline-flex items-center justify-center ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-[72svh] min-h-0 overflow-auto bg-white p-3 sm:p-5" data-asset-canvas>
            <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }} className="relative min-h-full min-w-full transition-[width,height] duration-300">
              <img src={MULBERRY_MEDIA.masterPlan} alt="Mulberry Grove Master Plan" className="absolute inset-0 h-full w-full max-w-none object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* 2. OFFICIAL LOCATION MAP SVG + LOCAL DRIVE TIMES MODAL */}
      {activeModal === "map" && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[92vh] rounded-[3px] bg-[var(--bg-light-base)] text-[var(--text-primary)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl"
        >
          <button
            type="button"
            onClick={onCloseModal}
            aria-label="Close location map"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[var(--accent-900)]/80 hover:bg-[var(--secondary-500)] text-[var(--accent-50)] border-0 cursor-pointer inline-flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative lg:col-span-7 h-[46svh] lg:h-[82svh] min-w-0 bg-[#ebebea]">
            <div className="absolute inset-0 overflow-auto p-3 pb-14" data-asset-canvas>
              <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }} className="relative min-h-full min-w-full transition-[width,height] duration-300">
                <img src={MULBERRY_MEDIA.locationMap} alt="Mulberry Grove location map" className="absolute inset-0 w-full h-full max-w-none object-contain" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-[3px] bg-[var(--accent-900)]/82 backdrop-blur-md p-1 text-[var(--accent-50)]">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
                aria-label="Zoom out map"
                className="w-8 h-8 rounded-[2px] bg-transparent hover:bg-[var(--accent-50)]/15 text-[var(--accent-50)] border-0 cursor-pointer inline-flex items-center justify-center"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono-label !text-[0.65rem] px-1.5">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.5).toFixed(1)))}
                aria-label="Zoom in map"
                className="w-8 h-8 rounded-[2px] bg-transparent hover:bg-[var(--accent-50)]/15 text-[var(--accent-50)] border-0 cursor-pointer inline-flex items-center justify-center"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-9 flex flex-col justify-between gap-6 overflow-y-auto max-h-[42vh] lg:max-h-[92vh]">
            <div className="space-y-4">
              <HarrowayLabel
                primary="Harris County"
                secondary="Highway 185"
                variant="light"
              />
              <h3 className="m-0 hw-heading-lg">{LOCATION_DATA.heading}</h3>
              <p className="m-0 text-sm font-light leading-relaxed text-[var(--text-secondary)]">
                {LOCATION_DATA.intro}
              </p>

              <div className="pt-2">
                <span className="font-mono-label text-[var(--secondary-600)] block mb-2">
                  {LOCATION_DATA.driveTimesHeading}
                </span>
                <ul className="list-none m-0 p-0 divide-y divide-[var(--accent-300)]">
                  {LOCATION_DATA.driveTimes.map((dt) => (
                    <li
                      key={dt.full}
                      className="py-2.5 flex items-center justify-between gap-2"
                    >
                      <span className="font-mono-label text-[var(--text-primary)]/70">
                        {dt.destination}
                      </span>
                      <span className="font-mono-label font-medium text-[var(--text-primary)]">
                        {dt.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={CLIENT_SOURCE.locationMap}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono-label text-[var(--secondary-600)] hover:text-[var(--secondary-800)] underline underline-offset-4"
            >
              Open Full Vector Map <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 3. COMMERCIAL LAND SALE MODAL */}
      {activeModal === "commercial" && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-[3px] bg-[var(--bg-dark-base)] text-[var(--text-inverse)] p-7 sm:p-10 space-y-6 border border-[var(--accent-50)]/15 shadow-2xl"
        >
          <button
            type="button"
            onClick={onCloseModal}
            aria-label="Close commercial inquiry dialog"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[var(--accent-50)]/12 hover:bg-[var(--secondary-500)] text-[var(--accent-50)] border-0 cursor-pointer inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          <HarrowayLabel
            primary="Village Retail"
            secondary="Commercial Land Sale"
            variant="dark"
          />
          <h3 className="m-0 hw-heading-xl text-[var(--accent-50)]">
            {RETAIL_DATA.commercialHeading}
          </h3>
          <p className="m-0 text-sm sm:text-base font-light leading-relaxed text-[var(--accent-200)]">
            {RETAIL_DATA.paragraph}
          </p>

          <div className="space-y-3 pt-2 border-t border-[var(--accent-50)]/15">
            <span className="font-mono-label text-[var(--accent-300)] block">
              Woodruff Real Estate Services, LLC
            </span>
            {RETAIL_DATA.brokers.map((broker) => (
              <div
                key={broker.name}
                className="p-4 rounded-[3px] bg-[var(--accent-50)]/[0.06] flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <a
                    href={`mailto:${broker.email}`}
                    className="font-display text-lg text-[var(--accent-50)] hover:underline underline-offset-4 block"
                  >
                    {broker.name}
                  </a>
                  <span className="font-mono-label !text-[0.68rem] text-[var(--accent-300)]">
                    {broker.role} · {broker.email}
                  </span>
                </div>
                <a
                  href={`tel:${broker.tel}`}
                  className="inline-flex items-center gap-2 font-mono-label text-[var(--accent-50)] hover:text-white no-underline"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--accent-300)]" />
                  {broker.phone}
                </a>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <HarrowayButton
              variant="grove"
              href={RETAIL_DATA.website}
              external
            >
              Visit Website
            </HarrowayButton>
            <a
              href={`mailto:${RETAIL_DATA.generalEmail}`}
              className="inline-flex items-center gap-2 font-mono-label text-[var(--accent-50)] hover:text-white underline underline-offset-4"
            >
              <Mail className="w-4 h-4" />
              {RETAIL_DATA.generalEmail}
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
