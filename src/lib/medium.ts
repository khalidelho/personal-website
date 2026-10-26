import { XMLParser } from 'fast-xml-parser';

export interface Article {
  title: string;
  url: string;
  date: Date;
  excerpt: string;
  tags: string[];
}

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&') // last, so "&amp;lt;" stays "&lt;"
    .replace(/\s+/g, ' ')
    .trim();

const clip = (s: string, max = 180) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(' ', max)) + '…');

// Medium's subtitle is the first <h4>. Prefer it over the first paragraph,
// which on AI-assisted posts is the disclosure Medium requires up top.
const excerptOf = (html: string) => {
  const sub = html.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
  if (sub) return clip(text(sub[1]));
  const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  return p ? clip(text(p[1])) : '';
};

const asArray = <T>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/**
 * Latest posts from a Medium profile's RSS feed (Medium serves the newest 10),
 * fetched at build time. Never fails the build: no handle, a network error or
 * an unexpected feed all return [] and the Writing section stays hidden.
 */
export async function getArticles(handle: string, limit = 6): Promise<Article[]> {
  if (!handle) return [];
  const feed = `https://medium.com/feed/@${handle.replace(/^@/, '')}`;
  try {
    const res = await fetch(feed, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = new XMLParser({ ignoreAttributes: true, cdataPropName: false }).parse(await res.text());
    return asArray<any>(xml?.rss?.channel?.item)
      .map((item) => ({
        title: text(String(item.title ?? '')),
        url: String(item.link ?? '').split('?')[0],
        date: new Date(item.pubDate),
        excerpt: excerptOf(String(item['content:encoded'] ?? '')),
        tags: asArray<string>(item.category).map(String),
      }))
      // A bad pubDate would throw later in toISOString() and fail the build.
      .filter((a) => a.title && a.url.startsWith('https://') && !isNaN(a.date.getTime()))
      .slice(0, limit);
  } catch (err) {
    console.warn(`[medium] could not load ${feed}: ${(err as Error).message}`);
    return [];
  }
}
