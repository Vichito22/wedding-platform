import type { Metadata, Viewport } from "next";

import {
  CREAM,
  COUPLE,
  SITE_URL,
  VENUE,
  WEDDING_DATE_LABEL,
} from "@/app/siteConfig";
import "./globals.css";

const description = `${COUPLE} se casan el ${WEDDING_DATE_LABEL} en ${VENUE}. Aquí encontrarás todos los detalles de nuestra boda y la lista de regalos.`;
const title = `${COUPLE} — Nuestra Boda`;

export const metadata: Metadata = {
  // Sin metadataBase Next emite las URLs de imagen relativas y WhatsApp,
  // Telegram e Instagram no muestran la vista previa.
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s · ${COUPLE}`,
  },
  description,
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: title,
    title,
    description,
    // `images` no se declara: Next inyecta la de opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: CREAM,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
