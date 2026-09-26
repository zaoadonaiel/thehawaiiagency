import { appDeveloperLocationSlugs, webDesignLocationSlugs } from './location-slugs';

/**
 * 301 map from the old WordPress URLs to the redesigned site.
 * Consumed by astro.config.mjs (static redirect pages) and written to dist/_redirects
 * (Netlify / Cloudflare Pages) so hosts that support it serve true 301s.
 */
const fixed: Record<string, string> = {
  '/case1/': '/case-studies/',
  '/category/latest-articles/': '/blog/',
  '/category/uncategorized/': '/blog/',
  '/tag/google-search-hawaii/': '/blog/',
  '/tag/oahu-web-design-and-seo/': '/blog/',
  '/tag/seo-in-hawaii/': '/blog/',
  '/author/admin/': '/about/',
  '/ui-ix/': '/ui-ux/',
  '/best-google-ads-agency-in-hawaii/': '/google-ads/',
  '/branding-agency-in-hawaii/': '/branding/',
  '/custom-software-development-in-hawaii/': '/software/',
  '/ecommerce-solutions/': '/ecommerce/',
  '/pbx-phone-systems-in-hawaii/': '/phone-systems/',
  '/search-engine-optimization/': '/seo/',
  '/ui-ux-design-in-hawaii/': '/ui-ux/',
  '/fusion_tb_category/footer/': '/',
  '/fusion_tb_category/header/': '/',
  '/element_category/columns/': '/',
  '/element_category/elements/': '/',
  '/element_category/post_cards/': '/',
  '/element_category/sections/': '/',
  '/slide-page/hotel-main-slider/': '/',
};

export const redirects: Record<string, string> = {
  ...fixed,
  ...Object.fromEntries(webDesignLocationSlugs.map((s) => [`/${s}/`, '/web-design/'])),
  ...Object.fromEntries(appDeveloperLocationSlugs.map((s) => [`/${s}/`, '/app-developer/'])),
};
