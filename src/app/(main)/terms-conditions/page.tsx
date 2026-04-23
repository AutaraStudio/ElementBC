import type { Metadata } from 'next';
import { getLegalPage, getPartnerCarousel } from '@/lib/sanity/queries';
import LegalPage from '@/components/sections/LegalPage';
import { termsConditionsDefaultBody } from '@/lib/sanity/legalDefaults';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('termsConditions');
  return {
    title: page?.seoTitle ?? 'Terms & Conditions | Element BC',
    description: page?.seoDescription ?? 'The terms governing your use of the Element BC website.',
  };
}

export default async function TermsConditionsPage() {
  const [data, partnerCarousel] = await Promise.all([
    getLegalPage('termsConditions'),
    getPartnerCarousel(),
  ]);

  return (
    <LegalPage
      data={data}
      fallbackEyebrow="Legal"
      fallbackHeading="Terms & Conditions"
      fallbackBody={termsConditionsDefaultBody}
      partnerCarousel={partnerCarousel}
    />
  );
}
