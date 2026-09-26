/**
 * Verified business facts (see docs/CONTENT-INVENTORY.md §3).
 * Everything here was taken from the live thehawaiiagency.com site.
 */
export const site = {
  name: 'The Hawaii Agency',
  legalName: 'A Davey Company, LLC',
  legalLine: 'The Hawaii Agency is a trade name of A Davey Company, LLC',
  url: 'https://thehawaiiagency.com',
  tagline: 'Hawaii’s premier web design agency.',
  mission: 'Empowering Hawaii with cutting-edge design and technology.',
  description:
    'The Hawaii Agency is Hawaii’s premier web design agency — custom websites, mobile apps, Google Ads, SEO, branding, ecommerce, software, UI/UX, cloud phone systems and fully managed hosting.',
  founder: {
    name: 'Davey Duarte',
    role: 'Founder, Creative Director & Full-Stack Developer',
  },
  experience: {
    brandingYears: '2 decades',
    webYears: 14,
  },
  languages: ['English', 'Spanish', 'Portuguese'],
  phone: { display: '(808) 280-1970', href: 'tel:+18082801970', e164: '+1-808-280-1970' },
  email: 'info@thehawaiiagency.com',
  address: {
    street: '200 N Vineyard Blvd. Ste. A325 #5756',
    locality: 'Honolulu',
    region: 'HI',
    postalCode: '96817',
    country: 'US',
  },
  /** Approximate coordinates of Honolulu – used as a design annotation only. */
  coordinates: { lat: '21.31° N', lng: '157.86° W' },
  rating: { summary: '5-star rated agency on Google', count: 26 },
  googleReviewsUrl: 'https://g.co/kgs/YFiAZPX',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/thehawaiiagency' },
    { label: 'Facebook', href: 'https://www.facebook.com/thehawaiiagency' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCU1BoWE8mJWu3IAwiorSnYg' },
  ],
  offer: {
    lead: 'Startups & established businesses',
    text: 'Get a new website for $499',
    cta: 'Claim offer',
    href: 'https://buy.stripe.com/6oE8yXg4A47DcOQ9BG',
  },
  meetings: [
    {
      id: 'consultation',
      title: 'Free Consultation',
      duration: '20 minutes',
      price: 'Free',
      text: 'Let’s talk about your next project needs so we can take the next step.',
      href: 'https://calendly.com/daveyduarte/20-minute-meeting',
    },
    {
      id: 'in-development',
      title: 'Projects In Development',
      duration: '1 hour',
      price: 'Existing clients',
      text: 'For clients who have already contacted us about a project.',
      href: 'https://calendly.com/daveyduarte/1-hour-existing-client',
    },
    {
      id: 'work-meeting',
      title: 'Work Meeting',
      duration: 'By the hour',
      price: '$100/hr',
      text: 'If you want to work in real time — quickly and done the right way.',
      href: 'https://calendly.com/daveyduarte/hour-new-client',
    },
  ],
} as const;

export type Site = typeof site;
