import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "NepaKanvas — Where Ideas Become Art",
  description:
    "Premium handcrafted canvas paintings, portraits, wall art and live event painting from Nepal.",
  authors: [{ name: "NepaKanvas" }],
  openGraph: {
    title: "NepaKanvas — Where Ideas Become Art",
    description:
      "Premium handcrafted canvas paintings, portraits, wall art and live event painting from Nepal.",
    type: "website",
    siteName: "NepaKanvas",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
