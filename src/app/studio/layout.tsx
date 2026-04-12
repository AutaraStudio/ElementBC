import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Element BC Studio',
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="sanity-studio" style={{ height: '100vh' }}>
      {children}
    </div>
  );
}
