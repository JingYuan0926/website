import type { NextApiRequest, NextApiResponse } from "next";

const CALENDAR_API_ID = "cal-sZfiZHfUS5piycU";
const LUMA_API = "https://api.lu.ma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { period = "future", cursor } = req.query;

  try {
    const params = new URLSearchParams({
      calendar_api_id: CALENDAR_API_ID,
      period: period as string,
    });
    if (cursor) params.set("pagination_cursor", cursor as string);

    const lumaRes = await fetch(
      `${LUMA_API}/calendar/get-items?${params.toString()}`
    );
    if (!lumaRes.ok) throw new Error(`Luma API ${lumaRes.status}`);

    const data = await lumaRes.json();

    const events = (data.entries ?? []).map((entry: any) => {
      const ev = entry.event;
      const hosts = entry.hosts ?? [];
      const d = new Date(ev.start_at);

      return {
        id: ev.api_id,
        title: ev.name,
        date: d.toLocaleDateString("en-CA", { timeZone: ev.timezone ?? "Asia/Kuala_Lumpur" }),
        time: d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: ev.timezone ?? "Asia/Kuala_Lumpur",
        }),
        timeZone: "MYT",
        location:
          ev.geo_address_json?.place_name ??
          ev.geo_address_json?.city_state ??
          ev.location ??
          "TBA",
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
