import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 10;
const STALE_MINUTES = 5;

/**
 * Reads cached Luma events from Supabase (instant).
 * If cache is stale (>5 min), triggers background re-sync.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { period = "future", cursor } = req.query;

  // If Supabase isn't configured, fall back to direct Luma API
  if (!supabase) {
    return fallbackToLuma(req, res);
  }

  try {
    // Check if cache is stale and trigger background sync
    triggerSyncIfStale().catch(() => {});

    const offset = cursor ? parseInt(cursor as string, 10) : 0;

    let query = supabase
      .from("luma_events")
      .select("*")
      .eq("period", period as string)
      .range(offset, offset + PAGE_SIZE - 1);

    // Future events: ascending by start_at. Past events: descending.
    if (period === "future") {
      query = query.order("start_at", { ascending: true });
    } else {
      query = query.order("start_at", { ascending: false });
    }

    const { data: rows, error } = await query;
    if (error) throw error;

    const events = (rows ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      timeZone: row.time_zone,
      location: row.location,
      organizers: row.organizers ?? [],
      lumaUrl: row.luma_url,
      coverUrl: row.cover_url,
    }));

    const hasMore = events.length === PAGE_SIZE;
    const nextCursor = hasMore ? String(offset + PAGE_SIZE) : null;

    // Cache response for 60s at CDN, serve stale for 5 min while revalidating
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    res.status(200).json({ events, hasMore, nextCursor });
  } catch (err: any) {
    console.error("Supabase read error, falling back to Luma:", err);
    return fallbackToLuma(req, res);
  }
}

/** Trigger /api/sync-luma-events if last sync was >5 min ago */
async function triggerSyncIfStale() {
  if (!supabase) return;

  const { data } = await supabase
    .from("luma_sync_meta")
    .select("value")
    .eq("key", "last_sync")
    .single();

  const lastSync = data?.value ? new Date(data.value) : null;
  const stale =
    !lastSync ||
    Date.now() - lastSync.getTime() > STALE_MINUTES * 60 * 1000;

  if (stale) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const headers: Record<string, string> = {};
    if (process.env.SYNC_SECRET) {
      headers["Authorization"] = `Bearer ${process.env.SYNC_SECRET}`;
    }
    // Fire-and-forget background sync
    fetch(`${baseUrl}/api/sync-luma-events`, { method: "POST", headers }).catch(
      () => {}
    );
  }
}

/** Direct Luma API fallback when Supabase is unavailable */
async function fallbackToLuma(req: NextApiRequest, res: NextApiResponse) {
  const { period = "future", cursor } = req.query;
  const CALENDAR_API_ID = "cal-sZfiZHfUS5piycU";

  try {
    const params = new URLSearchParams({
      calendar_api_id: CALENDAR_API_ID,
      period: period as string,
    });
    if (cursor) params.set("pagination_cursor", cursor as string);

    const lumaRes = await fetch(
      `https://api.lu.ma/calendar/get-items?${params}`
    );
    if (!lumaRes.ok) throw new Error(`Luma API ${lumaRes.status}`);

    const data = await lumaRes.json();

    const events = (data.entries ?? []).map((entry: any) => {
      const ev = entry.event;
      const hosts = entry.hosts ?? [];
      const tz = ev.timezone ?? "Asia/Kuala_Lumpur";
      const d = new Date(ev.start_at);

      return {
        id: ev.api_id,
        title: ev.name,
        date: d.toLocaleDateString("en-CA", { timeZone: tz }),
        time: d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: tz,
        }),
        timeZone: "MYT",
        location: (() => {
          const type = ev.location_type;
          if (type === "meet") return "Google Meet";
          if (type === "zoom") return "Zoom";
          if (type && type !== "offline") return "Virtual";
          return (
            ev.geo_address_info?.address ??
            ev.geo_address_info?.place_name ??
            ev.geo_address_info?.city_state ??
            ev.location ??
            "TBA"
          );
        })(),
        organizers: hosts.map((h: any) => ({
          name: h.name ?? "Organizer",
          avatarUrl: h.avatar_url ?? "",
        })),
        lumaUrl: `https://lu.ma/${ev.url}`,
        coverUrl: ev.cover_url ?? "",
      };
    });

    res.status(200).json({
      events,
      hasMore: data.has_more ?? false,
      nextCursor: data.next_cursor ?? null,
    });
  } catch (err: any) {
    console.error("Luma API error:", err);
    res.status(500).json({ error: err.message });
  }
}
