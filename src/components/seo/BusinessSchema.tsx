import { SITE_URL } from '@/lib/siteUrl';
import type { SanityContactPage, SanitySiteSettings } from '@/lib/sanity/queries';

/**
 * Site-wide Organization structured data (JSON-LD). Rendered once in the public
 * layout so every page carries a single ProfessionalService entity, keyed by a
 * stable @id. Values are pulled from Sanity (contact + site settings) so they
 * stay in sync with the CMS — undefined fields are dropped by JSON.stringify.
 */
export default function BusinessSchema({
  contact,
  settings,
}: {
  contact: SanityContactPage | null;
  settings: SanitySiteSettings | null;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: settings?.siteTitle ?? 'Element BC',
    description: settings?.seoDescription,
    url: SITE_URL,
    telephone: contact?.phoneNumber,
    email: contact?.emailAddress,
    address: contact?.addressLine1
      ? {
          '@type': 'PostalAddress',
          streetAddress: contact.addressLine1,
          addressLocality: contact.addressLine2,
          postalCode: contact.addressLine3,
          addressCountry: 'GB',
        }
      : undefined,
    areaServed: { '@type': 'City', name: 'London' },
    hasMap: contact?.googleMapsUrl?.trim(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
