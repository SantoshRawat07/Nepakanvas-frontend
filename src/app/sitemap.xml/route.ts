import { NextResponse } from "next/server";
import { ARTWORKS } from "@/lib/artworks";

export async function GET() {
  const baseUrl = "https://nepakanvas.com"; // Replace with actual domain when live

  const staticRoutes = [
    "",
    "/about",
    "/gallery",
    "/services",
    "/classes",
    "/contact",
  ];

  const artworkRoutes = ARTWORKS.map((a) => `/artwork/${a.id}`);
  const allRoutes = [...staticRoutes, ...artworkRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <changefreq>${route === "" ? "daily" : "weekly"}</changefreq>
      <priority>${route === "" ? "1.0" : "0.8"}</priority>
    </url>
  `
    )
    .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
