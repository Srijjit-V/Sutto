import type { Metadata } from "next";
import { Baloo_2, Comic_Neue, Geist_Mono } from "next/font/google";
import "./globals.css";

// Fonts chosen per the ui-ux-pro-max design-system search for a "kids
// educational game" product: Baloo 2 for headings, Comic Neue for body.
const baloo2 = Baloo_2({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const comicNeue = Comic_Neue({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QueryQuest — Learn SQL the fun way",
  description: "A gamified, story-driven way to learn SQL with Nibble.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${baloo2.variable} ${comicNeue.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
