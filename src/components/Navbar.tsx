import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, X } from 'lucide-react';
import { MULBERRY_MEDIA, NAV_SECTIONS } from '../data/mulberryData';

export type ModalType = 'masterplan' | 'map' | 'commercial' | null;

interface NavbarProps {
  onNavigate: (targetId: string) => void;
  onOpenModal: (modal: ModalType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const progressRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      setScrolled(y > 40);
      let current = 'top';
      const threshold = (headerRef.current?.offsetHeight ?? 80) + 12;
      for (const item of NAV_SECTIONS) {
        if ((document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= threshold) current = item.id;
      }
      setActiveSection(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); update(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const panel = menuRef.current;
    const savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = panel.querySelectorAll<HTMLElement>('a[href],button');
    focusables[0]?.focus();
    const ctx = gsap.context(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo('[data-mobile-link]', { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: 'power3.out' });
      }
    }, panel);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key !== 'Tab') return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      ctx.revert();
      document.body.style.overflow = savedOverflow;
      window.removeEventListener('keydown', onKey);
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setMenuOpen(false);
    window.history.replaceState(null, '', `#${id}`);
    requestAnimationFrame(() => onNavigate(id));
  };

  const resource = (modal: ModalType) => { setMenuOpen(false); onOpenModal(modal); };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[100] text-[var(--accent-50)] transition-[background-color,backdrop-filter] duration-500 ${scrolled || menuOpen ? 'bg-[var(--accent-900)]/95 backdrop-blur-xl' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex min-h-[var(--nav-height)] max-w-[112rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <a href="#top" onClick={(e) => navigate(e, 'top')} aria-label="Mulberry Grove home" className="hw-logo-link shrink-0 text-inherit no-underline">
            <img
              src={MULBERRY_MEDIA.headerLogo}
              alt="Mulberry Grove"
              width={622}
              height={150}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </a>

          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-[clamp(1rem,1.8vw,2.25rem)]">
            {NAV_SECTIONS.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => navigate(e, item.id)} aria-current={activeSection === item.id ? 'location' : undefined} className="site-nav-link">
                {item.label}
              </a>
            ))}
            <button type="button" onClick={() => resource('masterplan')} className="site-nav-link gap-1.5">
              Masterplan <ArrowUpRight size={13} strokeWidth={1.4} />
            </button>
          </nav>

          <button ref={toggleRef} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] border-0 bg-transparent text-inherit cursor-pointer lg:hidden">
            <span className={`block h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
        <div ref={progressRef} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent-50)]/45" />
      </header>

      {menuOpen && (
        <div ref={menuRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Site Menu" data-lenis-prevent className="fixed inset-0 z-[110] flex flex-col overflow-y-auto bg-[var(--accent-800)] text-[var(--accent-50)] px-6 pb-8 pt-6 lg:hidden">
          <div className="flex items-center justify-between gap-6 pb-8">
            <img src={MULBERRY_MEDIA.headerLogo} alt="Mulberry Grove" width={622} height={150} className="h-10 w-auto object-contain" />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center bg-transparent border-0 text-inherit cursor-pointer"><X size={24} strokeWidth={1.2} /></button>
          </div>
          <nav aria-label="Mobile Navigation" className="flex flex-col">
            {NAV_SECTIONS.map((item, index) => (
              <a key={item.id} data-mobile-link href={`#${item.id}`} onClick={(e) => navigate(e, item.id)} className="flex items-baseline justify-between gap-5 border-b border-[var(--accent-50)]/12 py-4 text-inherit no-underline">
                <span className="font-display text-[clamp(1.8rem,6vw,3rem)] uppercase leading-none">{item.label}</span>
                <span className="font-mono-label opacity-45">0{index + 1}</span>
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-7">
            <button type="button" onClick={() => resource('masterplan')} className="site-nav-link gap-2">View Masterplan <ArrowUpRight size={14} /></button>
            <button type="button" onClick={() => resource('map')} className="site-nav-link gap-2">Location Map <ArrowUpRight size={14} /></button>
            <a href="/privacy-policy/" className="site-nav-link">Privacy Policy</a>
          </div>
          <img src={MULBERRY_MEDIA.logo} alt="Mulberry Grove" width={403} height={285} className="mt-10 h-24 w-auto self-start object-contain opacity-75" />
        </div>
      )}
    </>
  );
};