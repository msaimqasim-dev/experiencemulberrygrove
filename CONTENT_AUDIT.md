# Mulberry Grove Content and Media Audit

## Sources

- Homepage: https://experiencemulberrygrove.com/
- Privacy policy and terms: https://experiencemulberrygrove.com/privacy-policy/
- Original source inventory: `artifacts/source-audit.json`
- Source-derived copy used by the application: `src/data/clientCopy.json`

The visual design remains inspired by Harroway. Client-facing business descriptions,
figures, contact information, and media come from Mulberry Grove, not Harroway.
Interface instructions, accessible image descriptions, and navigation labels are
functional UI text, not additional property or availability claims.

## Copy Corrections

- Removed the newly calculated "168 ac" figure. It is not a published client statistic.
- Removed invented destination descriptions, including golf, airport-route details,
  culture, and commute claims not stated on the original homepage.
- Removed the "Nature Preserve" designation. The source calls the land "greenway."
- Replaced rewritten FAQ answers with the original Community, Location,
  Residential, and Retail paragraphs, presented as an expandable community guide.
- Restored the full original privacy policy and all eight terms-of-service sections.
- Corrected gallery captions and image descriptions so lifestyle photos are not
  misidentified as named destinations, actual homesites, or specific on-site shops.
- Excluded HTML-commented-out "phase 1 - now leasing" copy. It is not published
  content on the original website.

## Verified Client Figures

| Item | Original Site Wording / Figure |
| --- | --- |
| Community size | Over 1,000 acres |
| Lakes | 30 acres |
| Greenway | 138 acres |
| Columbus | 20 minutes |
| Ft Benning | 20 minutes |
| Lagrange | 30 minutes |
| Peachtree City | 50 minutes |
| Auburn | 60 minutes |
| ATL airport | 70 minutes |
| Stone Martin, Phase 1 | 5 Homesite Remaining |
| Stone Martin, Phase 2 | Coming Soon |
| Greystone apartment homes | Delivering 2023 |
| Tra Dykes, Broker | 706.221.3632 |
| Julie Quigley, Associate Broker | 706.786.6700 |
| Stone Martin, Builder | 706.801.4265 |
| April Durham | 706.221.7175 |

The older delivery date and homesite information have deliberately not been
invented or updated. They match the live source but require client confirmation
before being represented as newly verified availability.

All published client email addresses and builder/partner website destinations are
retained. External partner availability and page status are controlled by those
partners; matching their links is not a guarantee of their service availability.

## Original Media and Framing

All 17 original image, logo, favicon, and map files matched the live client's files
by SHA-256 comparison. Details are in `artifacts/asset-verification.json`.
No stock replacement, generated image, or Harroway property photograph was used.

- Media are imported from `src/assets/media` and bundled into the production
  document rather than relying on root-relative image requests.
- The missing Nyght Serif font files were restored and bundled as well.
- A collapsed Vision media container was corrected with a definite full-height frame.
- Portrait photography now uses source-appropriate aspect ratios instead of
  forcing every portrait into a wide landscape banner.
- Parallax travel is bounded within the image's overscan area, preventing empty
  edges from appearing while scrolling.
- Maps and the master plan fit completely at the initial zoom level; zooming and
  panning remain available for detail inspection.
- Every background video has its original still image as a reliable visual fallback.
- All three original Vimeo videos were tested and reached playable readiness.

## Navigation and Forms

- Desktop navigation directly displays Vision, Community, Location, Residential,
  Retail, and Contact, with an additional Masterplan action.
- Desktop links have no filled background, pill shape, border, or hamburger menu.
- Mobile retains an accessible menu containing all six original section links.
- Section navigation compensates for the fixed header once, not twice.
- The previous fake "received/subscribed" confirmation was removed.
- Newsletter signup links to the client's existing live signup form.
- The inquiry form prepares an email draft to the client's published general
  inquiries address. It clearly states that the visitor must send the email.
  No new mailing-list backend or Gravity Forms integration is claimed.

## Verification

Production build: `npm run build`.

Browser checks cover decoded images and noncollapsed frames, all six desktop
anchors, transparent navigation links, mobile menu operation, no horizontal
overflow at 1440/1024/768/390/360 px, modal zoom/close behavior, complete legal
copy, form validation, and source paragraph preservation.

Reports: `artifacts/final-verification.json` and `artifacts/frame-coverage.json`.
No live client newsletter form was submitted during testing.