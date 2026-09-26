/** Social Media Marketing Plans, verbatim from /social-media-marketing/. */
export interface SocialPlan {
  name: string;
  price: string;
  items: string[];
}

export const socialPlans: SocialPlan[] = [
  {
    name: 'Kīlauea',
    price: '$1,250',
    items: [
      '5 posts a week on Instagram and Facebook',
      '1 YouTube video a month (2–10 minutes)',
      'Search Engine Optimization on your website',
      '50 photos every 2 months',
      '5 short videos for social media',
      'Drone footage',
      'Boost post & ad spend strategy',
      'Hashtags',
    ],
  },
  {
    name: 'Nā Pali',
    price: '$900',
    items: [
      '3 posts a week on Instagram and Facebook',
      '1 YouTube video a month (2–10 minutes)',
      'Search Engine Optimization on your website',
      '20 photos every 2 months',
      '2 short videos for social media',
      'Drone footage',
      'Boost post & ad spend strategy',
      'Hashtags',
    ],
  },
  {
    name: 'Diamond Head',
    price: '$500',
    items: [
      '2 posts a week on Instagram and Facebook',
      '1 YouTube video a month (2–10 minutes)',
      'Search Engine Optimization on your website',
      '10 photos every month',
      '5 short videos for social media',
      'Drone footage',
      'Boost post & ad spend strategy',
      'Hashtags',
    ],
  },
  {
    name: 'Haleakalā',
    price: '$250',
    items: [
      '1 post a week on Instagram and Facebook',
      '1 YouTube video a month (2–10 minutes)',
      'Search Engine Optimization on your website',
      '5 photos every month',
      '2 short videos for social media',
      'Drone footage',
      'Boost post & ad spend strategy',
      'Hashtags',
    ],
  },
];
