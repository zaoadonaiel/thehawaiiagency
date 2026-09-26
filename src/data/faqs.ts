/**
 * Questions & answers from the original /services/ page.
 * Sister-brand names (“Houston X Digital”, “Austin X Digital”) were replaced with
 * “The Hawaii Agency” / “we” — see docs/CONTENT-INVENTORY.md, flag 1.
 */
export interface FaqGroup {
  id: string;
  title: string;
  intro?: string;
  link?: string;
  items: { q: string; a: string }[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: 'app-development',
    title: 'App Development',
    link: '/app-developer/',
    intro:
      'Professional UI UX architecture from concept to customized Apple and Android mobile applications. Our team specializes in AWS, Google Cloud, Firebase and other mobile app features. We write custom scripts in PHP, JS, JQuery, React, Swift and more.',
    items: [
      { q: 'How much does an app cost?', a: 'First you have to decide how many distinct screens you need. If you don’t know the answer to that, give us a call and we can walk you through getting everything organized for your new app. The cost will be determined after the app is designed.' },
      { q: 'What is the best kind of app?', a: 'There are many preferences for many developers. As for us, we like to stick to React Native and Ionic Framework.' },
      { q: 'How do we get started?', a: 'Let’s have a discovery call to set up a contract so that we can agree on the terms for our services. Once we agree, we will come up with a payment plan that best suits your budget.' },
      { q: 'Where do I host my app?', a: 'The Hawaii Agency has some of the best, fastest and most secure servers in the world. We will set you up with your own server and monitor it 24/7.' },
      { q: 'How many apps has your agency built?', a: 'Our team has worked on 4 private apps for companies we cannot disclose and 3 public apps.' },
      { q: 'Can you fix or maintain my app?', a: 'We definitely can. If your last agency built it in one of the popular frameworks like React, PHP or Swift, we are well versed and ready to look into helping you.' },
    ],
  },
  {
    id: 'website-design',
    title: 'Website Design & Coding',
    link: '/web-design/',
    intro:
      'We design, build and manage websites coded in WordPress, Shopify, Codeigniter and just about any framework. From front-end design to backend infrastructure, our team has over a decade of combined experience in web design and development.',
    items: [
      { q: 'How much is a website?', a: 'There are many factors that go into pricing a website. Do you know the exact number of pages that you want? Do you have examples of websites you like? These are all simple ways to get closer to an accurate price for your website.' },
      { q: 'Can you fix my website?', a: 'Yes, we can fix 100% of any websites. We have JS, HTML, CSS, JQUERY, PHP and SSH experience. We can fix anything on any website — 100% guaranteed.' },
      { q: 'How do I get started with a website?', a: 'First you should have a domain and a hosting plan. We can show you where to get all that good stuff.' },
      { q: 'What is website hosting?', a: 'Think of it as “office space”. You have to rent an office in order to showcase your products or services. A hosting company ensures your website is live on the web via their server. Find out about our hosting plans on the Web Hosting page.' },
    ],
  },
  {
    id: 'software-development',
    title: 'Software Development',
    link: '/software/',
    intro:
      'If you are looking for scalability with software development, our agency has the skills to create any type of software for your business. In the past, we have created numerous systems for celebrities, investors, realtors and other entrepreneurs on a private agreement. Many of our higher end jobs are typically under an NDA for full client privacy.',
    items: [
      { q: 'What’s the difference between a software and a website?', a: 'With a software, you can use it locally on your computer as well as linking it to a cloud.' },
      { q: 'What are the costs?', a: 'Each software program we have engineered has been tailored to suit the client’s needs. A discovery meeting will allow us to give you a base estimate.' },
      { q: 'Mac or PC softwares?', a: 'We prefer to write the softwares in .NET to suit both Apple and Windows users, but we have also used JS, JSX, Python and C++.' },
    ],
  },
  {
    id: 'hosting',
    title: 'Website & App Hosting',
    link: '/website-hosting/',
    items: [
      { q: 'How can I host my website(s) with The Hawaii Agency?', a: 'We will migrate your website(s) and databases over to our servers. The propagation time on average is about 4–48 hours, so your site will be under maintenance mode while the DNS makes its way around the world. Once your site is up, you have complete 100% access and security.' },
      { q: 'How is hosting with you beneficial to my business?', a: 'Our servers offer much more storage than any hosting company you will find. We also have mirrored hard drives which back up all of your work, files, website, etc., so you will never have to worry about losing anything, ever. Our RAM is also higher than the average hosting company so your visitors will have a blazing fast loading experience. Our data centers are located in Germany and are protected by privacy laws.' },
      { q: 'Can I host my app on your servers?', a: 'We highly recommend app companies host on our servers for the quality and pricing that is unbeatable.' },
      { q: 'Can I cancel my hosting plan with your company?', a: 'We offer a month-to-month payment option that you can cancel any time. If you pay for our annual hosting plan, you can get out of it whenever you’d like but you will not be refunded for any deposits made to our company.' },
    ],
  },
  {
    id: 'seo',
    title: 'SEO',
    link: '/seo/',
    items: [
      { q: 'Can you get me on the first page of Google?', a: 'Absolutely! Does it take time? Oh yeah! The first thing you have to consider is your market and audience. If you are a niche business, you could rank higher because your competition is low. If you don’t have an authoritative or old website URL, chances are it may take longer. We’ve worked on sites that have taken 3 months and others that have taken a year. It’s all about keywords, speed and mobile responsiveness. Those 3 are key.' },
      { q: 'Can you fix my SEO?', a: 'Yes, we can run a free diagnostic test to see how your site was set up and optimized. If you score low, we can help bring your score much higher than your competition. Guaranteed.' },
      { q: 'How much is SEO?', a: 'The pricing really depends on how much time it takes to go through each page, optimize each photo, rename them, and so much more. After we give you a free SEO report, we can then determine how many hours it will take and take it from there.' },
    ],
  },
  {
    id: 'advertising',
    title: 'Advertising & PPC',
    link: '/google-ads/',
    intro:
      'Whether Google Ads, Social Media or print advertising, The Hawaii Agency helps small and large scale businesses with over a decade of knowledge and experience. We currently manage ad campaigns for two law firms and a fitness app on the mainland.',
    items: [
      { q: 'What is Google Ads?', a: 'Google Ads is the Pay Per Click service that Google offers. Every business is different and some businesses don’t need Google Ads. Give us a call and we’ll give you professional advice.' },
      { q: 'Will I get results from Social Media Marketing?', a: 'Of course you will. Just like search engines, social media channels want you to play ball with them. So long as you stay consistent, you will see results. We have also found that Social Media Marketing is much cheaper and can reach a wider audience than Search Engine Marketing ads.' },
    ],
  },
  {
    id: 'ecommerce',
    title: 'Ecommerce Solutions',
    link: '/ecommerce/',
    intro:
      'Today’s online consumers are looking for easy and navigable e-commerce carts via desktop or mobile devices. From custom monthly subscriptions to any API of your choice, we conduct an easy process for you so that you know how to easily navigate your own store.',
    items: [
      { q: 'How can I sell my products online?', a: 'It’s pretty simple. All you need is a PayPal account, a shipping method and you have yourself a store! You can also choose other platforms like Shopify that are great to sell products and very user friendly.' },
      { q: 'What bank do I need to open an online store?', a: 'You can use most free payment gateways like PayPal, Square, Stripe and more. You can call us to help you sort out any other difficult questions about ecommerce.' },
      { q: 'Can you build a drop shipping website?', a: 'Yes we can. We can integrate any API needed to bring your drop shipper the order. The process is very simple. We can tell you about different solutions for drop shipping.' },
    ],
  },
  {
    id: 'server-security',
    title: 'Server Security',
    intro:
      'Hackers and malware attacks are not rare. The Hawaii Agency can fully secure, back up and uptime-monitor your app or website in case of a cyber attack attempt. From logs to system restoration, our developers are always up to speed on security measures.',
    items: [
      { q: 'Can you protect my website from hackers?', a: 'Yes, we haven’t seen any hackers on any of our jobs. If we did, we can easily clean up your server and tighten the security even further with different tools and techniques we have been using for years. If you choose to host your website with us, we can assure you that we will monitor and secure your website 24/7. Yes you read that correctly… 24/7!' },
      { q: 'How good are The Hawaii Agency servers?', a: 'We use a partnering data center with two locations, one in Germany and the other in Switzerland. Our Switzerland data center is protected by national privacy laws. They are also extremely fast, and fully managed by our staff. You can price compare with GoDaddy, HostGator or any other hosting company and you will never find the same quality and management. Guaranteed.' },
    ],
  },
  {
    id: 'branding',
    title: 'Branding & Logo Design',
    link: '/branding/',
    intro:
      'Our branding and logo design is executed via screenshare so that you can be involved in your dream brand. When designing, we usually ask you for examples of logos you like so we can make it similar but better. We also offer logo redesign, modification, vectoring, and more.',
    items: [
      { q: 'Can you redesign logos?', a: 'We can redesign, refine, redo — just about re-anything! We have over 17 years of design experience. We can even design your logos via screenshare so you can collaborate with our designers!' },
      { q: 'How much does a logo cost?', a: 'The rate is $75/hr and we can work as many hours as needed. Our team is so fast, we can design anywhere from 5–10 logos in one hour!' },
      { q: 'What can you design?', a: 'Apps, websites, software, decks, presentations, brand kits, packages, signs, business cards, ads, shirts — you name it, we can design it!' },
    ],
  },
  {
    id: 'photography',
    title: 'Photography',
    items: [
      { q: 'How much is a photo session?', a: 'We charge $100/hr for photography sessions. This includes lighting, backdrops and the best high definition cameras.' },
      { q: 'Can you edit photos?', a: 'Yes, and very quickly! Do you want your waist smaller? Check! Want your teeth whitened? Check! We can edit everything from A to B.' },
      { q: 'How do you give me the files?', a: 'All of our work, notes, schedules and cloud storage is on cloud.thehawaiiagency.com. The files will always be there for you to download.' },
    ],
  },
  {
    id: 'videography',
    title: 'Videography',
    intro:
      'Video, commercial, filming and drone footage are just a few services we offer. We also work with Adobe Premiere and After Effects to create a beautiful video of anything you need. From drone to video effects, our team does it all.',
    items: [
      { q: 'What kind of videography do we specialize in?', a: 'We have shot music videos, small business commercials, drone footage, parties, events, religious gatherings and much more. You can get a beautiful video from us at the rate of $100/hr.' },
      { q: 'How do you deliver the video?', a: 'We will upload it to our cloud so you can download it whenever you want.' },
    ],
  },
];
