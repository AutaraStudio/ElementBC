import Script from 'next/script';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimationProvider from "@/components/ui/AnimationProvider";
import { getNavigation, getFooter } from "@/lib/sanity/queries";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, footer] = await Promise.all([getNavigation(), getFooter()]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/lumosframework/scripts@v1.1.1/theme-collector.js"
        strategy="beforeInteractive"
      />
      <AnimationProvider />
      <Navbar navLinks={nav?.navLinks} />
      {children}
      <Footer
        navLinks={footer?.footerNavLinks}
        legalLinks={footer?.legalLinks}
        builtByText={footer?.builtByText}
        builtByUrl={footer?.builtByUrl}
      />
    </>
  );
}
