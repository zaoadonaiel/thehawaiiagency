export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

/** Service order mirrors the “What We Do” list on the original site. */
export const serviceLinks: NavLink[] = [
  { label: 'Web Design', href: '/web-design/' },
  { label: 'Mobile Apps', href: '/app-developer/' },
  { label: 'Google Ads', href: '/google-ads/' },
  { label: 'SEO', href: '/seo/' },
  { label: 'Branding', href: '/branding/' },
  { label: 'Ecommerce', href: '/ecommerce/' },
  { label: 'Software', href: '/software/' },
  { label: 'UI UX', href: '/ui-ux/' },
  { label: 'Phone Systems', href: '/phone-systems/' },
  { label: 'Web Hosting', href: '/website-hosting/' },
  { label: 'Social Media', href: '/social-media-marketing/' },
];

export const primaryNav: NavLink[] = [
  { label: 'Work', href: '/case-studies/' },
  { label: 'Services', href: '/services/', children: serviceLinks },
  { label: 'Studio', href: '/about/' },
  { label: 'Hosting', href: '/website-hosting/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  { title: 'What we do', links: serviceLinks },
  {
    title: 'Studio',
    links: [
      { label: 'Case Studies', href: '/case-studies/' },
      { label: 'About the Studio', href: '/about/' },
      { label: 'Reviews', href: '/reviews/' },
      { label: 'Journal', href: '/blog/' },
      { label: 'HIPAA Compliance', href: '/hippa-compliance/' },
    ],
  },
  {
    title: 'Start',
    links: [
      { label: 'Let’s Meet', href: '/lets-meet/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'All Services', href: '/services/' },
      { label: 'Terms & Privacy', href: '/terms-and-privacy/' },
    ],
  },
];
