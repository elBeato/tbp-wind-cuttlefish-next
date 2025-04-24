import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from './footer';
import { Header } from './header';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Windseeker – Wind Alerts & Forecasts',
  description: 'Track wind forecasts, monitor thresholds, and get alerts with Windseeker. Ideal for sailors, surfers, and wind chasers.',
  keywords: ['wind forecast', 'Windseeker', 'Windguru', 'kitesurfing', 'sailing', 'weather alerts'],
  authors: [{ name: 'Windseeker Team' }],
  openGraph: {
    title: 'Windseeker – Wind Alerts & Forecasts',
    description: 'Get wind alerts and forecasts from Windguru stations.',
    url: 'https://windseeker.app',
    type: 'website',
    images: [
      {
        url: 'https://windseeker.app/preview.png',
        width: 1200,
        height: 630,
        alt: 'Windseeker preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Windseeker – Wind Alerts & Forecasts',
    description: 'Stay ahead of the wind with Windseeker.',
    images: ['https://windseeker.app/preview.png'],
    site: '@yourhandle', // optional
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-2 pt-20">
              <Header />
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                </Suspense>
              <Footer />
            </div>
          </div>
      </body>
    </html>
  );
}
