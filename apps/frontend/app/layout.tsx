import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuestra Boda",
  description: "Te invitamos a celebrar nuestra boda — 6 de marzo de 2027",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
