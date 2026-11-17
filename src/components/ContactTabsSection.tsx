import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, Mail, Phone, Plus } from "lucide-react";
import {
  COMMUNITY_GUIDE_FAQ,
  CLIENT_SOURCE,
  CONTACT_DIRECTORY,
  MULBERRY_MEDIA,
} from "../data/mulberryData";
import { HarrowayButton, SplitTextReveal } from "./HarrowayUI";
import { ModalType } from "./Navbar";

export type ContactTabKey = "form" | "faq" | "directory";

interface ContactTabsSectionProps {
  activeTab: ContactTabKey;
  onTabChange: (tab: ContactTabKey) => void;
  onOpenModal: (modal: ModalType) => void;
}

export const ContactTabsSection: React.FC<ContactTabsSectionProps> = ({
  activeTab,
  onTabChange,
  onOpenModal,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    const subject = encodeURIComponent('Mulberry Grove - General Inquiries');
    const body = encodeURIComponent(`Name: ${firstName.trim()} ${lastName.trim()}\nEmail: ${email.trim()}\n\n${comments.trim()}`);
    window.location.href = `mailto:info@woodruffrealestateservices.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setComments("");
    setSubmitted(false);
  };

  const tabs: { key: ContactTabKey; label: string }[] = [
    { key: "form", label: "Get Connected" },
    { key: "faq", label: "Community Guide" },
    { key: "directory", label: "Directory" },
  ];

  return (
    <section
      id="contact"
      className="relative z-[9] w-full bg-[var(--secondary-100)] text-[var(--text-primary)] overflow-clip"
    >
      {/* Exact Harroway 3-Way Architectural Tabs Menu */}
      <div
        role="tablist"
        aria-label="Contact and community information tabs"
        className="w-full grid grid-cols-3 border-t border-b border-[var(--accent-800)]/12"
      >
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              id={`contact-tab-${tab.key}`}
              aria-controls={`contact-panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              data-active={isActive}
              onClick={() => onTabChange(tab.key)}
              onKeyDown={(event) => {
                const next = event.key === 'ArrowRight' ? (idx + 1) % tabs.length : event.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
                if (next < 0) return;
                event.preventDefault();
                onTabChange(tabs[next].key);
                document.getElementById(`contact-tab-${tabs[next].key}`)?.focus();
              }}
              className={`hw-tab-btn py-5 sm:py-7 px-3 text-center cursor-pointer border-0 ${
                idx < 2 ? "border-r border-[var(--accent-800)]/12" : ""
              } ${
                isActive
                  ? "bg-[var(--secondary-100)] text-[var(--text-primary)] font-medium"
                  : "bg-[var(--bg-light-base)] text-[var(--text-secondary)]/80 font-normal"
              }`}
            >
              <span className="hw-tab-btn-bg" aria-hidden="true" />
              <span className="relative z-[2] font-body text-sm sm:text-base lg:text-lg tracking-[0.01em]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`contact-panel-${activeTab}`} aria-labelledby={`contact-tab-${activeTab}`} tabIndex={0}>
      {/* Newsletter registration stays with the client's live form. */}
      {activeTab === "form" && (
        <div className="relative w-full min-h-[92vh] bg-[var(--bg-dark-base)] text-[var(--text-inverse)] flex items-stretch overflow-hidden">
          {/* Full-Bleed Architectural Background Image */}
          <div className="absolute inset-0 z-[1]">
            <img
              src={MULBERRY_MEDIA.heroPoster}
              alt="Mulberry Grove community landscape"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, rgba(18,21,22,0.82) 0%, rgba(18,21,22,0.52) 52%, rgba(18,21,22,0.68) 100%)",
              }}
            />
          </div>

          <div
            className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch py-10 sm:py-14"
            style={{
              paddingLeft: "var(--container-pad)",
              paddingRight: "var(--container-pad)",
            }}
          >
            {/* Left Editorial Headline & Direct Contact Column */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-10 p-2 sm:p-6">
              <div className="space-y-5">
                <span className="font-mono-label text-[var(--accent-200)] block">
                  Mulberry Grove · Harris County, GA
                </span>
                <SplitTextReveal
                  as="h2"
                  text="Get Connected."
                  className="hw-heading-2xl text-[var(--accent-50)]"
                />
                <p className="m-0 text-base sm:text-lg font-light text-[var(--accent-50)]/85 max-w-md leading-relaxed">
                  Join our email list for community updates:
                </p>
                <HarrowayButton href={`${CLIENT_SOURCE.home}#contact`} external variant="outline">
                  Join our email list
                </HarrowayButton>
              </div>

              {/* Compact Direct Partner Contact Summary */}
              <div className="space-y-4 pt-6 border-t border-[var(--accent-50)]/18 max-w-md">
                <div>
                  <span className="font-mono-label text-[var(--accent-300)] block mb-1">
                    General Inquiries · Woodruff Real Estate Services, LLC
                  </span>
                  <p className="m-0 text-sm text-[var(--accent-50)]/90 leading-relaxed">
                    <a
                      href="mailto:TDykes@thewoodruffco.com"
                      className="text-[var(--accent-50)] underline underline-offset-2"
                    >
                      Tra Dykes
                    </a>{" "}
                    – Broker{" "}
                    <a
                      href="tel:7062213632"
                      className="text-[var(--accent-50)] hover:underline no-underline"
                    >
                      706.221.3632
                    </a>
                    <br />
                    <a
                      href="mailto:julieq@thewoodruffco.com"
                      className="text-[var(--accent-50)] underline underline-offset-2"
                    >
                      Julie Quigley
                    </a>{" "}
                    – Associate Broker{" "}
                    <a
                      href="tel:7067866700"
                      className="text-[var(--accent-50)] hover:underline no-underline"
                    >
                      706.786.6700
                    </a>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => onTabChange("directory")}
                    className="font-mono-label text-[var(--accent-50)] hover:text-white underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer"
                  >
                    All Builder & Leasing Contacts →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Frosted Glass Form Card (Exact Harroway .consultation-form) */}
            <div className="lg:col-span-7 rounded-[3px] bg-[var(--accent-50)]/86 backdrop-blur-2xl text-[var(--text-primary)] p-6 sm:p-10 lg:p-12 flex flex-col justify-center shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              {submitted ? (
                <div className="py-12 space-y-6 max-w-lg">
                  <div className="w-12 h-12 rounded-[3px] bg-[var(--secondary-500)] text-[var(--accent-50)] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" strokeWidth={1.6} />
                  </div>
                  <h3 className="m-0 hw-heading-xl text-[var(--text-primary)]">
                    Email draft prepared.
                  </h3>
                  <p className="m-0 text-base font-light leading-relaxed text-[var(--text-secondary)]">
                    Send the draft from your email application to contact Woodruff
                    Real Estate Services, LLC. This website has not sent a message
                    or registered your address for updates. You can also call{" "}
                    <a
                      href="tel:7062213632"
                      className="text-[var(--secondary-600)] underline"
                    >
                      706.221.3632
                    </a>{" "}
                    or{" "}
                    <a
                      href="mailto:info@woodruffrealestateservices.com"
                      className="text-[var(--secondary-600)] underline"
                    >
                      info@woodruffrealestateservices.com
                    </a>
                    .
                  </p>
                  <div className="pt-2">
                    <HarrowayButton variant="grove" onClick={resetForm}>
                      Edit message
                    </HarrowayButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="m-0 font-mono-label text-[var(--secondary-600)]">General Inquiries</p>
                  <p className="m-0 text-sm font-light leading-relaxed text-[var(--accent-700)]">This form prepares a message in your email application. Send the draft there to complete your inquiry.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div
                      className="hw-field-wrap"
                      data-floated={firstName.length > 0}
                    >
                      <label htmlFor="mg-first-name" className="hw-field-label">
                        First Name *
                      </label>
                      <input
                        id="mg-first-name"
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="hw-field-input"
                      />
                    </div>

                    <div
                      className="hw-field-wrap"
                      data-floated={lastName.length > 0}
                    >
                      <label htmlFor="mg-last-name" className="hw-field-label">
                        Last Name *
                      </label>
                      <input
                        id="mg-last-name"
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="hw-field-input"
                      />
                    </div>
                  </div>

                  <div
                    className="hw-field-wrap"
                    data-floated={email.length > 0}
                  >
                    <label htmlFor="mg-email" className="hw-field-label">
                      Email Address *
                    </label>
                    <input
                      id="mg-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="hw-field-input"
                    />
                  </div>

                  <div
                    className="hw-field-wrap"
                    data-floated={comments.length > 0}
                  >
                    <label htmlFor="mg-comments" className="hw-field-label">
                      Comments
                    </label>
                    <textarea
                      id="mg-comments"
                      name="comments"
                      maxLength={300}
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="hw-field-input resize-none min-h-[5.5rem]"
                    />
                    <div className="flex justify-end pt-1">
                      <span className="font-mono-label !text-[0.65rem] text-[var(--accent-600)]">
                        {comments.length} of 300 max characters
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                    <HarrowayButton type="submit" variant="grove">
                      Prepare email
                    </HarrowayButton>
                    <a
                      href="/privacy-policy/"
                      className="font-mono-label !text-[0.68rem] text-[var(--accent-700)] hover:text-[var(--text-primary)] underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY GUIDE — Exact Harroway Numbered Accordion */}
      {activeTab === "faq" && (
        <div
          className="w-full max-w-[78rem] mx-auto py-14 sm:py-20 space-y-3"
          style={{
            paddingLeft: "var(--container-pad)",
            paddingRight: "var(--container-pad)",
          }}
        >
          {COMMUNITY_GUIDE_FAQ.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.number}
                className="grid grid-cols-1 sm:grid-cols-[4.5rem_1fr] gap-2 sm:gap-4 items-stretch"
              >
                <div className="hidden sm:flex items-center justify-center rounded-[3px] bg-[var(--accent-50)]/50 font-display text-2xl text-[var(--secondary-700)]">
                  {faq.number}
                </div>
                <div className="rounded-[3px] bg-[var(--accent-50)]/55 hover:bg-[var(--accent-50)]/85 transition-colors duration-300 border border-[var(--accent-800)]/8">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`community-guide-${idx}`}
                    className="w-full px-6 sm:px-8 py-6 flex items-center justify-between gap-4 text-left bg-transparent border-0 cursor-pointer text-[var(--text-primary)]"
                  >
                    <span className="font-display text-lg sm:text-xl lg:text-2xl leading-snug">
                      {faq.question}
                    </span>
                    <span className="w-9 h-9 rounded-[3px] bg-[var(--secondary-500)]/12 text-[var(--secondary-700)] inline-flex items-center justify-center shrink-0">
                      <Plus
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <div className="hw-accordion-body" id={`community-guide-${idx}`} data-open={isOpen} inert={!isOpen}>
                    <div className="hw-accordion-inner">
                      <div className="px-6 sm:px-8 pb-7 pt-1 space-y-4">
                        <p className="m-0 text-[0.98rem] font-light leading-relaxed text-[var(--text-secondary)] max-w-3xl">
                          {faq.answer}
                        </p>
                        {faq.action && faq.actionLabel && (
                          <button
                            type="button"
                            onClick={() => onOpenModal(faq.action)}
                            className="inline-flex items-center gap-2 font-mono-label text-[var(--secondary-600)] hover:text-[var(--secondary-800)] underline underline-offset-4 bg-transparent border-0 p-0 cursor-pointer"
                          >
                            {faq.actionLabel}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: DIRECTORY — Exact Harroway 3-Column Management Cards (All 3 Official Partners) */}
      {activeTab === "directory" && (
        <div
          className="w-full bg-[var(--bg-dark-base)] text-[var(--text-inverse)] py-12 sm:py-16"
          style={{
            paddingLeft: "var(--container-pad)",
            paddingRight: "var(--container-pad)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {CONTACT_DIRECTORY.map((partner, idx) => {
              const isExpanded = expandedPartner === idx;
              return (
                <article
                  key={partner.company}
                  className="rounded-[3px] bg-[var(--accent-50)]/[0.06] border border-[var(--accent-50)]/12 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 sm:p-7 flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="font-mono-label text-[var(--accent-300)] block">
                        {partner.category}
                      </span>
                      <h3 className="m-0 hw-heading-md text-[var(--accent-50)]">
                        {partner.company}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPartner(isExpanded ? null : idx)
                      }
                      aria-label={`Toggle details for ${partner.company}`}
                      className="w-9 h-9 rounded-[3px] bg-[var(--accent-50)]/12 hover:bg-[var(--secondary-500)] text-[var(--accent-50)] inline-flex items-center justify-center shrink-0 cursor-pointer border-0 transition-colors"
                    >
                      <Plus
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-45" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Architectural Photo */}
                  <div className="relative aspect-[710/780] mx-6 sm:mx-7 rounded-[3px] overflow-hidden">
                    <img
                      src={partner.image}
                      alt={partner.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Verbatim People, Phone Numbers, Email & Website */}
                  <div className="p-6 sm:p-7 space-y-4 mt-auto">
                    {isExpanded && (
                      <p className="m-0 text-sm font-light leading-relaxed text-[var(--accent-200)] pb-2 border-b border-[var(--accent-50)]/12">
                        {partner.summary}
                      </p>
                    )}

                    <div className="space-y-2">
                      {partner.people.map((person) => (
                        <div
                          key={person.name}
                          className="flex flex-wrap items-center justify-between gap-2 text-sm py-1.5 border-b border-[var(--accent-50)]/10"
                        >
                          <span className="text-[var(--accent-50)]">
                            {person.email ? (
                              <a
                                href={`mailto:${person.email}`}
                                className="text-[var(--accent-50)] hover:text-white underline underline-offset-4 decoration-[var(--accent-400)]"
                              >
                                {person.name}
                              </a>
                            ) : (
                              person.name
                            )}
                            {person.role && (
                              <span className="text-[var(--accent-300)]">
                                {" "}
                                – {person.role}
                              </span>
                            )}
                          </span>
                          <a
                            href={`tel:${person.tel}`}
                            className="inline-flex items-center gap-1.5 font-mono-label text-[var(--accent-50)] hover:text-white no-underline"
                          >
                            <Phone className="w-3 h-3 text-[var(--accent-300)]" />
                            {person.phone}
                          </a>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <a
                        href={`mailto:${partner.email}`}
                        className="inline-flex items-center gap-1.5 font-mono-label text-[var(--accent-50)] hover:text-white underline underline-offset-4"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                      <span className="text-[var(--accent-500)]">|</span>
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono-label text-[var(--accent-50)] hover:text-white underline underline-offset-4"
                      >
                        Website
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                      {partner.extraLink && (
                        <>
                          <span className="text-[var(--accent-500)]">|</span>
                          <a
                            href={partner.extraLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono-label text-[var(--secondary-200)] hover:text-white underline underline-offset-4"
                          >
                            {partner.extraLink.label}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </section>
  );
};
