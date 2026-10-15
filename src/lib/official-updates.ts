import { createHash } from "node:crypto";

const MAX_PAGE_BYTES = 1_000_000;
const ALLOWED_HOST_SUFFIXES = [".gov.in", ".nic.in"];

export type MonitoredPage = {
  contentHash: string;
  pageTitle: string;
  excerpt: string;
};

export function isAllowedOfficialSource(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (url.port === "" || url.port === "443") &&
      ALLOWED_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix))
    );
  } catch {
    return false;
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, decimal: string) =>
      decodeCodePoint(Number(decimal)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, hexadecimal: string) =>
      decodeCodePoint(parseInt(hexadecimal, 16)),
    );
}

function decodeCodePoint(codePoint: number) {
  return codePoint > 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : "";
}

function toPlainText(html: string) {
  return decodeHtml(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|svg|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<(nav|footer|header)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, name: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const key = tag.match(/\b(?:name|property)=["']([^"']+)["']/i)?.[1];
    if (key?.toLowerCase() !== name.toLowerCase()) continue;
    return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? "";
  }
  return "";
}

export function extractMonitoredPage(
  html: string,
  contentType: string,
): MonitoredPage {
  const isHtml = contentType.includes("html") || /<html\b|<body\b/i.test(html);
  const title = isHtml
    ? toPlainText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")
    : "";
  const description = isHtml
    ? toPlainText(metaContent(html, "description") || metaContent(html, "og:description"))
    : "";
  const mainContent =
    html.match(/<(?:main|article)\b[^>]*>([\s\S]*?)<\/(?:main|article)>/i)?.[1] ??
    html;
  const bodyText = toPlainText(mainContent).slice(0, 100_000);
  const excerpt = (description || bodyText).slice(0, 500);
  const pageTitle = (title || description || bodyText || "Official source page").slice(0, 200);
  const contentHash = createHash("sha256")
    .update(`${pageTitle}\n${description}\n${bodyText}`)
    .digest("hex");

  return { contentHash, pageTitle, excerpt };
}

export async function readLimitedResponse(response: Response) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_PAGE_BYTES) {
    throw new Error("Source page is larger than the monitoring limit.");
  }
  if (!response.body) throw new Error("Source page returned an empty response.");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteLength += value.byteLength;
    if (byteLength > MAX_PAGE_BYTES) {
      await reader.cancel();
      throw new Error("Source page is larger than the monitoring limit.");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8").decode(bytes);
}
