/**
 * Google reviews exactly as displayed on thehawaiiagency.com (Trustindex widget,
 * “Trustindex verifies that the original source of the review is Google”).
 * Quoted verbatim — do not edit wording.
 */
export interface Review {
  name: string;
  date: string; // ISO
  text: string;
}

export const reviews: Review[] = [
  {
    name: 'Trash Bros',
    date: '2024-10-23',
    text: 'Davey truly exceeded my expectations! He built an incredible website for my demolition business in Scottsdale, AZ, and optimized it with top-notch SEO. I was a bit skeptical at first, but Davey told me to be patient, and sure enough, just a month later, I’m already getting calls from Google’s organic search results! His expertise in web design and SEO is the real deal, and I couldn’t be happier with the results. If you’re looking for a reliable agency that delivers on their promises, this is the one to trust. Highly recommended!',
  },
  {
    name: 'Dave Buaya',
    date: '2024-09-27',
    text: 'Im extremely pleased with the services provided by Davey at The Hawaii Agency. I contacted Davey in need of a website design for our business. Davey took the time to identify our business wants and needs. After a short phone call, The Hawaii Agency got right to work! They created the perfect website tailored to the essentials of our business. Davey’s expertise, blended with his knowledge and vision, provided the best outcome possible. Please give The Hawaii Agency an opportunity to create your next website portrait. Mahalo Davey!',
  },
  {
    name: 'Louis H',
    date: '2024-09-03',
    text: 'I had such a great experience, working with Davey! He is so knowledgeable he is the greatest content media Director that I know he designed two websites for us. He was so fast and the design of the webpages were awesome. I recommend him to all of my friends and family thank you Davey for the wonderful work. He can also design, mobile applications, websites, media graphics, anything pertaining to content and advertising give Davey a call!',
  },
  {
    name: 'chad kabins',
    date: '2024-08-30',
    text: 'I’ve worked With Davey and team for the last several years. They are always responsive, smart and have fantastic incite.',
  },
  {
    name: 'Ruben Medina',
    date: '2024-08-01',
    text: 'Great work! He worked alongside me and designed my business marketing presentation! I absolutely enjoyed working with him. Highly recommended! 100% guaranteed his work and I’m 100% satisfied!',
  },
  {
    name: 'Tom Lepper',
    date: '2024-07-10',
    text: 'Always delivers exceptional service to meet and exceed needs. So appreciative to partner with the Hawaii Agency. Davey genuinely wants us to succeed and the feeling is mutual. Thank you for all you do for us!',
  },
  {
    name: 'Raja Koch',
    date: '2024-07-04',
    text: 'I looked all around for a professional website builder for my business, FINALLY came across Davey ! What a relief to have someone who so professional and creative at the same time , he was easy to work with and had so much patience and advice. He was very prompt on all our calls and meeting schedules on time and budget ! Once my website was completed , I inquired about him designing my business cards , again very happy how they turned out . I would highly recommend him to friends and business associates. Raja',
  },
  {
    name: 'Andrew Salman',
    date: '2024-07-02',
    text: 'I am thrilled with the results of my first website. The experience has been incredibly rewarding, and I highly recommend working with Davey. His expertise and support made the process smooth and enjoyable.',
  },
  {
    name: 'Oscar Maldonado',
    date: '2024-07-01',
    text: 'Awesome agency who branded my small business, designed our truck wraps, got us up and running quickly. Helped with everything and his rates were affordable. The Google ads monthly maintenance is awesome, saw returns in the first month.',
  },
  {
    name: 'yung tarxan',
    date: '2024-06-25',
    text: 'He did a great job with our website, Super stoked to have worked with them, easy communication and excellent design work',
  },
];

export const formatReviewDate = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
