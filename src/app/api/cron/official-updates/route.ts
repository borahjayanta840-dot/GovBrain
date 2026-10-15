import { createClient } from "@supabase/supabase-js";
import {
  extractMonitoredPage,
  isAllowedOfficialSource,
  readLimitedResponse,
} from "@/lib/official-updates";

export const maxDuration = 60;

type OfficialSource = {
  id: string;
  source_url: string;
  source_title: string;
};

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("Official source monitor is missing CRON_SECRET.");
    return Response.json({ error: "Source monitor is not configured." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Official source monitor is missing Supabase server credentials.");
    return Response.json({ error: "Source monitor is not configured." }, { status: 503 });
  }

  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: sources, error: sourceError } = await db
    .from("service_sources")
    .select("id, source_url, source_title, services!inner(status)")
    .eq("status", "verified")
    .eq("services.status", "published")
    .limit(50);

  if (sourceError) {
    console.error("Unable to load official sources for monitoring.", sourceError);
    return Response.json({ error: "Unable to load official sources." }, { status: 503 });
  }

  let checked = 0;
  let changed = 0;
  const failures: { source: string; reason: string }[] = [];

  await Promise.all(
    ((sources ?? []) as OfficialSource[]).map(async (source) => {
      if (!isAllowedOfficialSource(source.source_url)) {
        failures.push({ source: source.source_title, reason: "Unsupported official domain." });
        return;
      }

      try {
        const response = await fetch(source.source_url, {
          headers: { "user-agent": "MyGovBrain-OfficialSourceMonitor/1.0" },
          redirect: "error",
          signal: AbortSignal.timeout(8_000),
        });
        if (!response.ok) {
          throw new Error(`Source returned HTTP ${response.status}.`);
        }
        const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
        if (!/(html|text|xml)/.test(contentType)) {
          throw new Error("Source did not return a text or HTML page.");
        }

        const html = await readLimitedResponse(response);
        const page = extractMonitoredPage(html, contentType);
        const { data: didChange, error } = await db.rpc(
          "record_official_source_check",
          {
            p_source_id: source.id,
            p_content_hash: page.contentHash,
            p_page_title: page.pageTitle,
            p_excerpt: page.excerpt,
          },
        );
        if (error) throw new Error("Unable to save the source check.");
        checked += 1;
        if (didChange) changed += 1;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unexpected source check failure.";
        console.error(`Official source check failed: ${source.source_title}`, reason);
        failures.push({ source: source.source_title, reason });
      }
    }),
  );

  return Response.json(
    { checked, changed, failures },
    { status: failures.length > 0 ? 502 : 200 },
  );
}
