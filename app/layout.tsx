import { ReactNode } from "react";
import './globals.css'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'ACR Speaker | 100% Karya Anak Bangsa',
  description: 'Speaker asli buatan Indonesia produksi dari CV. Sinar Baja Electric, yang menghasilkan speaker berkualitas terbaik dari tweeter hingga subwoofer.',
  keywords: 'ACR, ACR Speaker, 100% Karya Anak Bangsa, Speaker Indonesia, Loudspeaker Indonesia, Speaker ACR, acrspeaker, acr speaker',
  openGraph: {
    title: 'ACR Speaker | 100% Karya Anak Bangsa',
    description: 'Speaker asli buatan Indonesia produksi dari CV. Sinar Baja Electric, yang menghasilkan speaker berkualitas terbaik dari tweeter hingga subwoofer.',
    url: 'https://acrspeaker.com',
    siteName: 'ACR Speaker',
    images: [
      {
        url: `https://acrspeaker.com/images/acr/logo_acr.webp`,
        width: 1200,
        height: 630,
        alt: 'ACR Speaker Logo',
      },
      {
        url: `https://acrspeaker.com/images/acr/logo_acr.webp`,
        width: 800,
        height: 800,
        alt: 'ACR Speaker Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACR Speaker | 100% Karya Anak Bangsa',
    description: 'Speaker asli buatan Indonesia produksi dari CV. Sinar Baja Electric, yang menghasilkan speaker berkualitas terbaik dari tweeter hingga subwoofer.',
    images: [
      {
        url: `https://acrspeaker.com/images/acr/logo_acr.webp`,
        width: 800,
        height: 800,
        alt: 'ACR Speaker Logo',
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>{children}</>
  );
}
