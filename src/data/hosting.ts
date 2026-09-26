/**
 * Hosting plans as listed on the homepage and /website-hosting/ (“Hosting Pricing —
 * Fully-Managed Servers For Businesses & Developers”). Checkout links are the original
 * Stripe payment links. NOTE: /website-hosting/ also carried a second, conflicting spec
 * table — see docs/CONTENT-INVENTORY.md, flag 5.
 */
export interface HostingPlan {
  id: string;
  name: string;
  kind: string;
  price: string;
  setup?: string;
  forWhom: string;
  specs: string[];
  href: string;
  featured?: boolean;
}

export const hostingIncluded = [
  '24/7 Support',
  'CDN & SSL',
  'Plugin & Theme Updates (one website)',
  '32 TB Traffic Out',
  'Unlimited Incoming',
];

export const hostingPlans: HostingPlan[] = [
  {
    id: 'cx11',
    name: 'CX11',
    kind: 'Standard Performance VPS',
    price: '$30',
    forWhom: 'Perfect for small business websites.',
    specs: ['2 vCPU Cores', '8 GB RAM', '5 GB SSD Storage', 'Monthly Backups', 'Unlimited Subdomains'],
    href: 'https://buy.stripe.com/3cs8yX7y4dId8yA29c',
  },
  {
    id: 'cx21',
    name: 'CX21',
    kind: 'High Performance VPS',
    price: '$50',
    forWhom: 'Websites with more than 5 pages.',
    specs: ['4 vCPU Cores', '16 GB RAM', '10 GB NVMe Storage', 'Weekly Backups', 'Unlimited Subdomains'],
    href: 'https://buy.stripe.com/fZe6qP9GcfQl6qsaFH',
    featured: true,
  },
  {
    id: 'cx31',
    name: 'CX31',
    kind: 'Powerful Performance VPS',
    price: '$75',
    forWhom: 'Websites with lots of products & pages.',
    specs: ['8 vCPU Cores', '60 GB RAM', '30 GB SSD Storage', 'Daily Backups', 'Unlimited Subdomains'],
    href: 'https://buy.stripe.com/9AQ6qP5pWfQl0247tu',
  },
  {
    id: 'storagex',
    name: 'STORAGEX',
    kind: 'Storage VPS',
    price: '$175',
    setup: '$99 setup fee',
    forWhom: 'All your storage needs.',
    specs: ['18 vCPU Cores', '60 GB RAM', '4.8 TB SSD', 'IPv4'],
    href: 'https://buy.stripe.com/8wMcPd9GcgUp3egcNY',
  },
  {
    id: 'ax',
    name: 'AX',
    kind: 'Dedicated Server',
    price: '$190',
    setup: '$149 setup fee',
    forWhom: 'High level, multi-threading server.',
    specs: ['3rd generation Ryzen™ 5 3600 CPU, 6 cores and 12 threads', '64 GB of DDR4 RAM', '2 × 2 TB SSD or 2 × 512 GB NVMe', 'IPv6'],
    href: 'https://buy.stripe.com/3csbL9cSo6fL8yAaFF',
  },
];

/** “Award-Winning Web Hosting Technology” block from the homepage. */
export const hostingHighlights = [
  {
    kicker: 'Awarded performance',
    title: 'VPSBenchmarks: Best VPS January 2024',
    text: 'Our VDS M ranked 3rd in the Best VPS performance trial conducted by the VPSBenchmarks website. Additionally, VDS M NVMe is among the top performers in the “Performance Stability” category.',
  },
  {
    kicker: 'A stress-free experience',
    title: 'Fully Managed Hosting',
    text: 'Our fully managed hosting is designed to save you time and energy while ensuring your website runs smoothly. With our comprehensive services, including backups, uptime monitoring, and 24/7 support, you can focus on your business while we take care of the technical aspects. Say goodbye to the hassle of managing servers and hello to peace of mind.',
  },
  {
    kicker: 'Peace of mind hosting',
    title: 'Server Optimization',
    text: 'We employ proprietary optimization scripts to effectively manage server load, ensuring stable performance for all our customers at an affordable price point. Additionally, our logistics and warehouse management are optimized to minimize waste, allowing us to offer even better prices to our clients.',
  },
];
