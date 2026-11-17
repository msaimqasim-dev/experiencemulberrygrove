import clientCopy from './clientCopy.json';
import { CLIENT_IMAGES } from './media';

export const CLIENT_SOURCE = {
  home: clientCopy.source,
  privacy: clientCopy.privacySource,
  masterPlan: 'https://experiencemulberrygrove.com/wp-content/uploads/2021/02/19-09-09-mulberry-grove-zoning-master-plan-scaled.jpg',
  locationMap: 'https://experiencemulberrygrove.com/wp-content/uploads/2020/08/map-location-mulberry-grove.svg',
};

export const NAV_SECTIONS = [
  { label: 'Vision', id: 'vision' },
  { label: 'Community', id: 'community' },
  { label: 'Location', id: 'location' },
  { label: 'Residential', id: 'residential' },
  { label: 'Retail', id: 'retail' },
  { label: 'Contact', id: 'contact' },
];

export const MULBERRY_MEDIA = {
  logo: CLIENT_IMAGES.logo,
  headerLogo: CLIENT_IMAGES.headerLogo,
  favicon: CLIENT_IMAGES.favicon,
  heroPoster: CLIENT_IMAGES.hero,
  heroVideo: 'https://player.vimeo.com/external/450141896.hd.mp4?s=887a47df019cd82683ec5f0b264130ae1fcb715e&profile_id=175',
  visionPoster: CLIENT_IMAGES.overview,
  visionVideo: 'https://player.vimeo.com/external/450166438.hd.mp4?s=c45458dba46da63410f8a18c8c281e4337128b12&profile_id=174',
  communityPoster: CLIENT_IMAGES.community,
  communityVideo: 'https://player.vimeo.com/external/450181656.hd.mp4?s=098ef2093aa31a660942a34778c352eae15c94bf&profile_id=169',
  masterPlan: CLIENT_IMAGES.masterPlan,
  locationPhoto: CLIENT_IMAGES.location,
  locationMap: CLIENT_IMAGES.locationMap,
  residentialIntro: CLIENT_IMAGES.residential,
  residentialSingleFamily: CLIENT_IMAGES.singleFamily,
  residentialApartments: CLIENT_IMAGES.apartments,
  retailFeature: CLIENT_IMAGES.retail,
  retailCarousel: [
    { src: CLIENT_IMAGES.market, caption: 'Experiences Every Day.', alt: 'A child choosing fresh produce at a market' },
    { src: CLIENT_IMAGES.shopping, caption: 'Experiences Every Day.', alt: 'A shopkeeper handing a shopping bag to a customer' },
    { src: CLIENT_IMAGES.coffee, caption: 'Experiences Every Day.', alt: 'Coffee being prepared at an espresso machine' },
    { src: CLIENT_IMAGES.neighbors, caption: 'Experiences Every Day.', alt: 'A shopkeeper welcoming a customer' },
    { src: CLIENT_IMAGES.shops, caption: 'Experiences Every Day.', alt: 'A shopkeeper turning an open sign' },
  ],
};

export const HERO_DATA = {
  heading: 'Simply Beautiful Living.',
  subtitle: 'Discover a small-town setting designed to connect nature and community like never before.',
  stats: [
    { number: '1,000+', label: 'Acres' },
    { number: '138', label: 'Acres of Greenway' },
    { number: '30', label: 'Acres of Lakes' },
  ],
};

export const VISION_DATA = {
  heading: clientCopy.vision.heading,
  leadParagraph: clientCopy.vision.paragraph.split(' Where new homes')[0],
  detailParagraph: `Where new homes${clientCopy.vision.paragraph.split(' Where new homes')[1]}`,
  fullParagraph: clientCopy.vision.paragraph,
  attribution: 'Welcome to Mulberry Grove.',
};

export const COMMUNITY_DATA = {
  heading: clientCopy.community.heading,
  paragraph: clientCopy.community.paragraph,
  ctaLabel: 'View Masterplan',
};

export const LOCATION_DATA = {
  heading: clientCopy.location.heading,
  paragraph: clientCopy.location.paragraph,
  intro: 'At home in Harris County, Mulberry Grove’s location is the perfect mix of laid-back living and modern conveniences.',
  driveTimesHeading: 'Local Drive Times',
  driveTimes: clientCopy.location.driveTimes.map((full) => {
    const [minutes, ...destination] = full.split(' minutes ');
    return { time: `${minutes} minutes`, destination: destination.join(' minutes '), full };
  }),
};

export const STATEMENT_MANIFESTO =
  'Paths and trails for hiking and biking. Lakes and parks for relaxation and recreation. All of it perfectly suited to its natural surroundings, allowing for a slower pace and a true sense of place.';

export const RESIDENTIAL_INTRO = clientCopy.residential;

export const RETAIL_DATA = {
  ...clientCopy.retail,
  commercialHeading: 'For Commercial Land Sale:',
  brokers: [
    { name: 'Tra Dykes', role: 'Broker', email: 'TDykes@thewoodruffco.com', phone: '706.221.3632', tel: '7062213632' },
    { name: 'Julie Quigley', role: 'Associate Broker', email: 'julieq@thewoodruffco.com', phone: '706.786.6700', tel: '7067866700' },
  ],
  generalEmail: 'info@woodruffrealestateservices.com',
  website: 'https://www.woodruffrealestateservices.com/',
};

export interface OfferingShowcase {
  id: string;
  anchorId?: string;
  chipPrimary: string;
  chipSecondary: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  details: { label: string; value: string; href?: string; secondaryHref?: string; secondaryValue?: string }[];
  carousel?: { src: string; caption: string; alt: string }[];
  ctaLabel: string;
  ctaHref?: string;
  ctaAction?: 'masterplan' | 'map' | 'commercial';
  secondaryCta?: { label: string; href: string };
}

const stoneMartinCommunity = 'https://www.stonemartinbuilders.com/find-my-home/harris-county/mulberry-grove';
const greystoneLeasing = { status: 'Now Leasing', phone: '478-368-5350', tel: '4783685350' };

export const PROPERTY_OFFERINGS: OfferingShowcase[] = [
  {
    id: 'stone-martin-builders', chipPrimary: 'Single-Family Homes', chipSecondary: 'Stone Martin Builders',
    title: clientCopy.stoneMartin.heading, description: clientCopy.stoneMartin.paragraph,
    image: MULBERRY_MEDIA.residentialSingleFamily,
    alt: 'A bedside table and lamp in a warmly decorated bedroom',
    details: [
      { label: 'Phase 1', value: 'Explore Available Homes' },
      { label: 'Phase 2', value: 'Coming Soon' },
      { label: 'Stone Martin - Builder', value: '706.801.4265', href: 'tel:7068014265' },
    ],
    ctaLabel: 'Learn more',
    ctaHref: stoneMartinCommunity,
    secondaryCta: { label: 'Email', href: 'mailto:mulberrygrove@stonemartinbuilders.com' },
  },
  {
    id: 'greystone-properties', chipPrimary: 'Apartment Homes', chipSecondary: greystoneLeasing.status,
    title: clientCopy.greystone.heading, description: clientCopy.greystone.paragraph,
    image: MULBERRY_MEDIA.residentialApartments,
    alt: 'A light-filled bedroom with a round mirror and a white dresser',
    details: [
      { label: 'Apartment Homes', value: greystoneLeasing.status },
      { label: 'April Durham', value: greystoneLeasing.phone, href: `tel:${greystoneLeasing.tel}` },
    ],
    ctaLabel: 'Learn more', ctaHref: 'https://www.greystoneatmulberrygrove.com/',
    secondaryCta: { label: 'Email', href: 'mailto:mail@greystoneproperties.net' },
  },
  {
    id: 'village-retail', anchorId: 'retail', chipPrimary: 'Retail', chipSecondary: 'Commercial Land Sale',
    title: clientCopy.retail.heading, description: clientCopy.retail.paragraph,
    image: MULBERRY_MEDIA.retailCarousel[0].src, alt: MULBERRY_MEDIA.retailCarousel[0].alt,
    carousel: MULBERRY_MEDIA.retailCarousel,
    details: [
      { label: 'Broker', value: 'Tra Dykes', href: 'mailto:TDykes@thewoodruffco.com', secondaryValue: '706.221.3632', secondaryHref: 'tel:7062213632' },
      { label: 'Associate Broker', value: 'Julie Quigley', href: 'mailto:julieq@thewoodruffco.com', secondaryValue: '706.786.6700', secondaryHref: 'tel:7067866700' },
    ],
    ctaLabel: 'Website', ctaHref: RETAIL_DATA.website,
    secondaryCta: { label: 'Email', href: `mailto:${RETAIL_DATA.generalEmail}` },
  },
  {
    id: 'come-home', chipPrimary: 'Residential', chipSecondary: 'Mulberry Grove',
    title: clientCopy.residential.heading, description: clientCopy.residential.paragraph,
    image: MULBERRY_MEDIA.residentialIntro,
    alt: 'A dog looking through a window from a comfortable bed',
    details: [
      { label: 'Single Family Homes', value: 'Stone Martin Builders' },
      { label: 'Apartment Homes', value: 'Greystone Properties' },
    ],
    ctaLabel: 'View Masterplan', ctaAction: 'masterplan',
  },
];

export const CONTACT_DIRECTORY = [
  {
    category: 'General Inquiries', company: 'Woodruff Real Estate Services, LLC',
    image: MULBERRY_MEDIA.retailFeature,
    alt: 'Dining and hospitality imagery from the original Mulberry Grove website',
    summary: clientCopy.retail.paragraph, people: RETAIL_DATA.brokers,
    email: RETAIL_DATA.generalEmail, website: RETAIL_DATA.website, extraLink: undefined,
  },
  {
    category: 'Single Family Homes', company: 'Stone Martin Builders',
    image: MULBERRY_MEDIA.residentialSingleFamily,
    alt: 'A bedside table and lamp in a warmly decorated bedroom',
    summary: clientCopy.stoneMartin.paragraph,
    people: [{ name: 'Stone Martin', role: 'Builder', email: undefined, phone: '706.801.4265', tel: '7068014265' }],
    email: 'mulberrygrove@stonemartinbuilders.com', website: 'https://www.stonemartinbuilders.com/',
    extraLink: { label: 'Learn more', href: stoneMartinCommunity },
  },
  {
    category: 'Apartment Homes', company: 'Greystone Properties', image: MULBERRY_MEDIA.residentialApartments,
    alt: 'A light-filled bedroom with a round mirror and a white dresser',
    summary: clientCopy.greystone.paragraph,
    people: [{ name: 'April Durham', role: undefined, email: undefined, phone: greystoneLeasing.phone, tel: greystoneLeasing.tel }],
    email: 'mail@greystoneproperties.net', website: 'https://greystoneproperties.net',
    extraLink: { label: 'Learn more', href: 'https://www.greystoneatmulberrygrove.com/' },
  },
];

export const COMMUNITY_GUIDE_FAQ = [
  { number: '1', question: clientCopy.community.heading, answer: clientCopy.community.paragraph, action: 'masterplan' as const, actionLabel: 'View Masterplan' },
  { number: '2', question: clientCopy.location.heading, answer: clientCopy.location.paragraph, action: 'map' as const, actionLabel: 'View Location Map' },
  { number: '3', question: clientCopy.residential.heading, answer: clientCopy.residential.paragraph, action: undefined, actionLabel: undefined },
  { number: '4', question: clientCopy.retail.heading, answer: clientCopy.retail.paragraph, action: 'commercial' as const, actionLabel: 'For Commercial Land Sale' },
];

export const COMMUNITY_STATS_CARDS = [
  {
    description: 'Just north of Columbus, GA and encompassing over 1,000 acres, Mulberry Grove introduces a thoughtfully planned community that is worlds away from the hustle and bustle of everyday life.',
    number: '1,000+', label: 'Acres', icon: 'compass' as const,
  },
  { description: 'Paths and trails for hiking and biking.', number: '138', label: 'Acres of Greenway', icon: 'trees' as const },
  { description: 'Lakes and parks for relaxation and recreation.', number: '30', label: 'Acres of Lakes', icon: 'waves' as const },
  {
    description: 'A quick 20 minutes to the south, Columbus offers an abundance of great local shopping and dining options.',
    number: '20', label: 'Minutes to Columbus', icon: 'map' as const,
  },
];
