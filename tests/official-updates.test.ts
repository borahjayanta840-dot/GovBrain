import { describe, expect, it } from "vitest";
import {
  extractMonitoredPage,
  isAllowedOfficialSource,
} from "@/lib/official-updates";

describe("isAllowedOfficialSource", () => {
  it("allows HTTPS government domains used for official sources", () => {
    expect(isAllowedOfficialSource("https://assam.gov.in/notices")).toBe(true);
    expect(isAllowedOfficialSource("https://parivahan.gov.in/")).toBe(true);
    expect(isAllowedOfficialSource("https://example.nic.in/page")).toBe(true);
  });

  it("rejects non-government, insecure, and credentialed URLs", () => {
    expect(isAllowedOfficialSource("https://example.com")).toBe(false);
    expect(isAllowedOfficialSource("http://assam.gov.in")).toBe(false);
    expect(isAllowedOfficialSource("https://user:pass@assam.gov.in")).toBe(false);
    expect(isAllowedOfficialSource("https://assam.gov.in:8443")).toBe(false);
  });
});

describe("extractMonitoredPage", () => {
  it("extracts a stable title and summary while excluding scripts and page chrome", () => {
    const result = extractMonitoredPage(
      `<html><head><title>Official Notice</title>
        <meta name="description" content="Updated application notice"></head>
        <body><nav>Navigation</nav><main><h1>Notice details</h1>
        <p>Application dates are now available.</p>
        <script>const timestamp = Date.now()</script></main><footer>Footer</footer></body></html>`,
      "text/html",
    );

    expect(result.pageTitle).toBe("Official Notice");
    expect(result.excerpt).toBe("Updated application notice");
    expect(result.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(result.contentHash).toBe(
      extractMonitoredPage(
        `<html><head><title>Official Notice</title>
        <meta name="description" content="Updated application notice"></head>
        <body><main><h1>Notice details</h1>
        <p>Application dates are now available.</p></main></body></html>`,
        "text/html",
      ).contentHash,
    );
  });

  it("handles non-HTML text pages", () => {
    const result = extractMonitoredPage("Government notice updated", "text/plain");
    expect(result.pageTitle).toBe("Government notice updated");
    expect(result.excerpt).toBe("Government notice updated");
  });

  it("detects a changed page title even when body text is unchanged", () => {
    const first = extractMonitoredPage(
      "<html><head><title>Old notice</title></head><body><main>Same content</main></body></html>",
      "text/html",
    );
    const second = extractMonitoredPage(
      "<html><head><title>New notice</title></head><body><main>Same content</main></body></html>",
      "text/html",
    );
    expect(first.contentHash).not.toBe(second.contentHash);
  });
});
