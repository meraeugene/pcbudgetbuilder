import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://buildwise-ph.andrewvillaloncodex.chatgpt.site"),
  title: "Buildwise — Your Budget, Better Built",
  description: "Get a compatible PC build or a three-model laptop shortlist for gaming, architecture, content creation, work, and study—matched to your Philippine peso budget.",
  openGraph: {
    title: "Buildwise — Your Budget, Better Built",
    description: "Set a peso budget. Get a current PC build or laptop shortlist.",
    images: [{ url: "/og.png", width: 1733, height: 907, alt: "Buildwise PC and laptop budget picker" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
