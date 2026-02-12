/* eslint-disable @typescript-eslint/no-require-imports */
const siteMetadata = require('./app/utils/siteMetaData');

const SUPPORTED_LOCALES = ['hr', 'en'];
const DEFAULT_LOCALE = 'hr';

// /hr/about, /en/about, ...
const STATIC_ROUTES = ['', '/about', '/projects', '/contact', '/privacy', '/complaint'];

function normalizeSiteUrl(input) {
  const raw = String(input || '').trim();
  if (!raw) return 'http://localhost:3000';
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

// VPS: koristiš .env (ili env od pm2/systemd). Nema potrebe za .env.production logikom.
const siteUrl = normalizeSiteUrl(siteMetadata.siteUrl || process.env.SITE_URL || 'http://localhost:3000');

const isProduction = process.env.NODE_ENV === 'production';

function parseProjectItems(json) {
  if (!json || typeof json !== 'object') return [];
  const { data } = json;
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const attrs = item.attributes && typeof item.attributes === 'object' ? item.attributes : item;

      const slug = typeof attrs.slug === 'string' ? attrs.slug : null;
      const localeRaw = typeof attrs.locale === 'string' ? attrs.locale : null;
      const locale = localeRaw && localeRaw.toLowerCase().startsWith('en') ? 'en' : 'hr';

      // optional: Strapi timestamps (ako postoje)
      const updatedAt = typeof attrs.updatedAt === 'string' ? attrs.updatedAt : null;

      let localizations = [];
      const rawLocalizations = attrs.localizations;

      if (rawLocalizations && typeof rawLocalizations === 'object' && Array.isArray(rawLocalizations.data)) {
        localizations = rawLocalizations.data
          .map((locItem) => {
            if (!locItem || typeof locItem !== 'object') return null;
            const locAttrs =
              locItem.attributes && typeof locItem.attributes === 'object'
                ? locItem.attributes
                : locItem;

            const locSlug = typeof locAttrs.slug === 'string' ? locAttrs.slug : null;
            const locLocaleRaw = typeof locAttrs.locale === 'string' ? locAttrs.locale : null;
            const locLocale = locLocaleRaw && locLocaleRaw.toLowerCase().startsWith('en') ? 'en' : 'hr';

            if (!locSlug) return null;

            const locUpdatedAt = typeof locAttrs.updatedAt === 'string' ? locAttrs.updatedAt : null;

            return { slug: locSlug, locale: locLocale, updatedAt: locUpdatedAt };
          })
          .filter(Boolean);
      }

      if (!slug) return null;
      return { slug, locale, updatedAt, localizations };
    })
    .filter(Boolean);
}

function buildAlternateRefs(pathSuffix) {
  // pathSuffix je npr: '', '/about', '/projects/slug'
  const refs = SUPPORTED_LOCALES.map((locale) => ({
    href: `${siteUrl}/${locale}${pathSuffix}`,
    hreflang: locale,
  }));

  refs.push({
    href: `${siteUrl}/${DEFAULT_LOCALE}${pathSuffix}`,
    hreflang: 'x-default',
  });

  return refs;
}

async function getProjectSitemapEntries() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = process.env.REST_API_KEY;

  if (!apiUrl) return [];

  try {
    const params = new URLSearchParams();
    params.set('locale', 'all');
    params.set('pagination[pageSize]', '500');

    // fields
    params.set('fields[0]', 'slug');
    params.set('fields[1]', 'locale');
    params.set('fields[2]', 'updatedAt');

    // localizations
    params.set('populate[localizations][fields][0]', 'slug');
    params.set('populate[localizations][fields][1]', 'locale');
    params.set('populate[localizations][fields][2]', 'updatedAt');

    const res = await fetch(`${apiUrl}/projects?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const projects = parseProjectItems(json);

    const entries = [];

    for (const project of projects) {
      const ownPath = `/${project.locale}/projects/${project.slug}`;

      // siblings = original + localizations
      const siblings = [
        { locale: project.locale, slug: project.slug, updatedAt: project.updatedAt },
        ...project.localizations,
      ];

      // dedupe by locale
      const uniqueByLocale = new Map();
      for (const s of siblings) {
        if (!uniqueByLocale.has(s.locale)) uniqueByLocale.set(s.locale, s);
      }

      const alternateRefs = Array.from(uniqueByLocale.entries()).map(([locale, s]) => ({
        href: `${siteUrl}/${locale}/projects/${s.slug}`,
        hreflang: locale,
      }));

      // x-default -> defaultLocale verzija (ako nema, fallback na trenutni)
      const defaultEntry = uniqueByLocale.get(DEFAULT_LOCALE) || { slug: project.slug };
      alternateRefs.push({
        href: `${siteUrl}/${DEFAULT_LOCALE}/projects/${defaultEntry.slug}`,
        hreflang: 'x-default',
      });

      // lastmod: uzmi najnoviji updatedAt iz siblings ako postoji
      const updatedCandidates = Array.from(uniqueByLocale.values())
        .map((s) => s.updatedAt)
        .filter(Boolean);

      const lastmod =
        updatedCandidates.length > 0
          ? new Date(Math.max(...updatedCandidates.map((d) => new Date(d).getTime()))).toISOString()
          : new Date().toISOString();

      entries.push({
        loc: ownPath,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod,
        alternateRefs,
      });
    }

    // dedupe by loc
    const deduped = new Map(entries.map((entry) => [entry.loc, entry]));
    return Array.from(deduped.values());
  } catch {
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  autoLastmod: true,

  // Bitno: pošto koristiš /hr i /en, root ti ne treba u sitemapu
  exclude: ['/', '/404', '/500', '/api/*', '/_next/*'],

  robotsTxtOptions: {
    policies: isProduction
      ? [{ userAgent: '*', allow: '/' }]
      : [{ userAgent: '*', disallow: '/' }],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },

  // Minimal transform: ne pokušava da menja canonical, jer je canonical već /hr ili /en.
  // Takođe, mi sve bitno dodajemo kroz additionalPaths.
  transform: async (_config, path) => {
    if (path.includes('[') || path.includes(']')) return null;
    if (path === '/') return null;

    return {
      loc: path,
      changefreq: path.includes('/projects/') ? 'weekly' : 'monthly',
      priority: path === `/${DEFAULT_LOCALE}` ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },

  additionalPaths: async () => {
    const staticEntries = [];

    for (const locale of SUPPORTED_LOCALES) {
      for (const route of STATIC_ROUTES) {
        const loc = `/${locale}${route}`;

        staticEntries.push({
          loc,
          changefreq: route === '' ? 'weekly' : 'monthly',
          priority: route === '' ? 1.0 : 0.8,
          lastmod: new Date().toISOString(),
          alternateRefs: buildAlternateRefs(route),
        });
      }
    }

    const projectEntries = await getProjectSitemapEntries();

    const combined = [...staticEntries, ...projectEntries];
    const deduped = new Map(combined.map((entry) => [entry.loc, entry]));

    return Array.from(deduped.values());
  },
};