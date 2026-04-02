import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/lumos-utilities.css";
import "@/styles/components.css";

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
