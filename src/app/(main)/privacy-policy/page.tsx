import type { Metadata } from 'next';
import { getLegalPage, getPartnerCarousel } from '@/lib/sanity/queries';
import LegalPage from '@/components/sections/LegalPage';
import { privacyPolicyDefaultBody } from '@/lib/sanity/legalDefaults';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacyPolicy');
  return {
    title: { absolute: page?.seoTitle ?? 'Privacy Policy | Element BC' },
    description: page?.seoDescription ?? 'How Element BC collects, uses, and protects your information.',
  };
}

export default async function PrivacyPolicyPage() {
  const [data, partnerCarousel] = await Promise.all([
    getLegalPage('privacyPolicy'),
    getPartnerCarousel(),
  ]);

  return (
    <LegalPage
      data={data}
      fallbackEyebrow="Legal"
      fallbackHeading="Privacy Policy"
      fallbackBody={privacyPolicyDefaultBody}
      partnerCarousel={partnerCarousel}
    />
  );
}
