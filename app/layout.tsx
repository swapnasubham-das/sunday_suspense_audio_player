import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sunday-suspense.vercel.app'),
  title: "Sunday Suspense — Dedicated to Mirchi Bangla",
  description: "Sunday Suspense — Dedicated to Mirchi Bangla. Stream 700+ timeless Bengali thriller, horror, mystery, and classic audio stories with ambient soundscapes, resume bookmarks, and late-night visuals.",
  keywords: ["Sunday Suspense", "Mirchi Bangla", "Bengali Audio Stories", "Feluda", "Byomkesh Bakshi", "Taranath Tantrik", "Late Night Radio", "Audio Drama"],
  authors: [{ name: "Dedicated to Mirchi Bangla" }],
  openGraph: {
    title: "Sunday Suspense — Dedicated to Mirchi Bangla",
    description: "Stream 700+ curated Bengali suspense and horror audio stories dedicated to Mirchi Bangla.",
    type: "website",
    locale: "bn_BD",
    siteName: "Sunday Suspense",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="dark h-full">
      <body className="bg-[#070709] text-gray-100 h-full w-full overflow-hidden antialiased select-none font-sans">
        {children}
      </body>
    </html>
  );
}
