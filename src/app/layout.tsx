import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/lumos-utilities.css";
import "@/styles/components.css";

export const metadata: Metadata = {
  title: 'Element BC',
  description: 'Element BC — Building Consultancy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
