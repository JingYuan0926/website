import type { NextApiRequest, NextApiResponse } from "next";
import { getServiceClient } from "@/lib/supabase";

const CALENDAR_API_ID = "cal-sZfiZHfUS5piycU";
const LUMA_API = "https://api.lu.ma";

function parseLocation(ev: any): string {
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
}

async function fetchAllLumaEvents(period: "future" | "past") {
  const all: any[] = [];
  let cursor: string | null = null;

  // Paginate through all events
  for (let i = 0; i < 10; i++) {
    const params = new URLSearchParams({
      calendar_api_id: CALENDAR_API_ID,
      period,
    });
    if (cursor) params.set("pagination_cursor", cursor);

    const res = await fetch(`${LUMA_API}/calendar/get-items?${params}`);
    if (!res.ok) throw new Error(`Luma API ${res.status}`);

    const data = await res.json();
    all.push(...(data.entries ?? []));

    if (!data.has_more) break;
    cursor = data.next_cursor ?? null;
    if (!cursor) break;
  }

  return all;
}

function mapEntry(entry: any, period: string) {
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
    time_zone: "MYT",
    location: parseLocation(ev),
    luma_url: `https://lu.ma/${ev.url}`,
    cover_url: ev.cover_url ?? "",
    organizers: hosts.map((h: any) => ({
      name: h.name ?? "Organizer",
      avatarUrl: h.avatar_url ?? "",
    })),
    period,
    start_at: ev.start_at,
    synced_at: new Date().toISOString(),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Optional: protect with a secret token
  const token = req.headers.authorization?.replace("Bearer ", "");
  const expected = process.env.SYNC_SECRET;
  if (expected && token !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  try {
    // Fetch both future and past events from Luma
    const [futureEntries, pastEntries] = await Promise.all([
      fetchAllLumaEvents("future"),
      fetchAllLumaEvents("past"),
    ]);

    const rows = [
      ...futureEntries.map((e) => mapEntry(e, "future")),
      ...pastEntries.map((e) => mapEntry(e, "past")),
    ];

    if (rows.length > 0) {
      // Upsert all events (insert or update on conflict)
      const { error } = await supabase
        .from("luma_events")
        .upsert(rows, { onConflict: "id" });

      if (error) throw error;
    }

    // Update sync metadata
    await supabase
      .from("luma_sync_meta")
      .upsert(
        { key: "last_sync", value: new Date().toISOString(), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    res.status(200).json({
      synced: rows.length,
      future: futureEntries.length,
      past: pastEntries.length,
    });
  } catch (err: any) {
    console.error("Sync error:", err);
    res.status(500).json({ error: err.message });
  }
}
