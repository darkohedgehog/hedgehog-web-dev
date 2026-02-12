const siteMetadata = {
  title: 'Hedgehog Web Dev | Next.js & Headless Web Development',
  author: 'Darko Živić',
  headerTitle: 'Hedgehog Web Dev',
  description:
    'Profesionalni web development u Next.js, React i Headless CMS okruženju. Izrada modernih web stranica, web aplikacija i e-commerce rješenja optimiziranih za brzinu, SEO i konverzije.',
  language: 'hr_HR',
  theme: 'system',
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  siteLogo: '/logo.png',
  socialBanner: '/social-media.png',
  email: 'zivic.darko79@gmail.com',
  facebook:
    'https://www.facebook.com/messages/t/100074828598715/?locale=hr_HR',
  locale: 'hr_HR',
  keywords: [
    'Web development Hrvatska',
    'Next.js developer',
    'React developer',
    'Headless CMS',
    'Strapi developer',
    'WooCommerce headless',
    'Izrada web stranica',
    'Izrada web shopa',
    'SEO optimizacija',
    'VPS deploy',
    'Custom web aplikacije',
    'Freelance developer Hrvatska'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Hedgehog Web Dev | Modern Web Development',
    description:
      'Next.js, React i Headless CMS rješenja za moderne, brze i SEO optimizirane web stranice i web shopove.',
    url: process.env.SITE_URL || 'http://localhost:3000',
    type: 'website',
    images: [
      {
        url: '/social-media.png',
        alt: 'Hedgehog Web Dev social banner',
      },
    ],
  },
};

module.exports = siteMetadata;