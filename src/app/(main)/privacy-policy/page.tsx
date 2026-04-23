import type { Metadata } from 'next';
import { getLegalPage } from '@/lib/sanity/queries';
import LegalPage from '@/components/sections/LegalPage';
import { privacyPolicyDefaultBody } from '@/lib/sanity/legalDefaults';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage('privacyPolicy');
  return {
    title: page?.seoTitle ?? 'Privacy Policy | Element BC',
    description: page?.seoDescription ?? 'How Element BC collects, uses, and protects your information.',
  };
}

export default async function PrivacyPolicyPage() {
  const data = await getLegalPage('privacyPolicy');

  return (
    <LegalPage
      data={data}
      fallbackEyebrow="Legal"
      fallbackHeading="Privacy Policy"
      fallbackBody={privacyPolicyDefaultBody}
    />
  );
}
