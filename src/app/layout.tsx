import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fun Facts",
  description: "Discover fun facts about your friends",
  manifest: 'site.webmanifest',
  icons: {
      apple: [
          { sizes: '180x180', url: 'favicon/apple-touch-icon.png' }
      ],
      icon: [
          { sizes: '32x32', url: 'favicon/favicon-32x32.png' },
          { sizes: '16x16', url: 'favicon/favicon-16x16.png' },
      ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
