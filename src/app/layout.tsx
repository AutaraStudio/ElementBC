import type { Metadata } from "next";
import localFont from "next/font/local";

const adelphi = localFont({
  src: "../../public/fonts/AdelphiPEVFWeb-All.woff2",
  variable: "--font-adelphi",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Element BC",
  description: "Element BC — Building Consultancy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={adelphi.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
