import type { Metadata } from 'next';
import { getContactPage, getPartnerCarousel } from '@/lib/sanity/queries';
import StaggerLink from '@/components/ui/StaggerLink';
import AboutHeroBackgroundSvg from '@/components/ui/svgs/AboutHeroBackgroundSvg';
import SectionDivider from '@/components/ui/SectionDivider';
import PartnerCarousel from '@/components/sections/PartnerCarousel';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await getContactPage();
  return {
    title: contactPage?.seoTitle ?? 'Contact | Element BC',
    description: contactPage?.seoDescription,
  };
}

export default async function ContactPage() {
  const [contactPage, partnerCarousel] = await Promise.all([
    getContactPage(),
    getPartnerCarousel(),
  ]);

  const heroEyebrow = contactPage?.heroEyebrow ?? 'Contact';
  const heroHeading = contactPage?.heroHeading ?? 'Bringing architectural ideas to life in glass.';
  const teamContacts = contactPage?.teamContacts ?? [];
  const phoneLabel = contactPage?.phoneLabel ?? 'Talk to us';
  const phoneNumber = contactPage?.phoneNumber ?? '020 8156 7290';
  const emailLabel = contactPage?.emailLabel ?? 'Write us';
  const emailAddress = contactPage?.emailAddress ?? 'info@elementbc.co.uk';
  const addressEyebrow = contactPage?.addressEyebrow ?? 'Address';
  const addressLine1 = contactPage?.addressLine1 ?? '71-75 Shelton Street';
  const addressLine2 = contactPage?.addressLine2 ?? 'Covent Garden, London';
  const addressLine3 = contactPage?.addressLine3 ?? 'WC2H 9JQ, UK';
  const googleMapsUrl = contactPage?.googleMapsUrl ?? '#';
  const visitLabel = contactPage?.visitLabel ?? 'Visit us';
  const bookVisitUrl = contactPage?.bookVisitUrl ?? '#';

  const phoneHref = `tel:${phoneNumber.replace(/\s/g, '')}`;
  const emailHref = `mailto:${emailAddress}`;

  return (
    <>
      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section data-hero-wrap="" data-theme="buff" className="contact_hero-wrap u-theme-buff">
        <div data-wf--spacer--variant="page-top" className="u-section-spacer is-page-top u-ignore-trim"></div>

        {/* Background SVG */}
        <div className="about_bg-wrap u-cover-absolute">
          <div className="about_bg-svg u-position-absolute">
            <AboutHeroBackgroundSvg className="global_svg" />
          </div>
        </div>

        <div className="contact_hero-contain u-container">
          <div className="contact_hero-layout u-flex-vertical-nowrap u-gap-5 u-alignment-start">

            {/* Eyebrow */}
            <div data-stagger="" className="contact_hero-eyebrow u-flex-horizontal-nowrap u-gap-2">
              <EyebrowSvg className="global_eyebrow-svg" />
              <div data-anim-hero="" data-split="word" className="contact_hero_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">{heroEyebrow}</div>
            </div>

            {/* Heading */}
            <div className="contact_hero_heading-wrap">
              <h1 data-split="word" data-anim-hero="" className="contact_hero-heading u-max-width-70rem u-text-style-h1 u-text-decoration-justify-last u-text-transform-uppercase">{heroHeading}</h1>
            </div>

          </div>
        </div>

        <div data-wf--spacer--variant="large" className="u-section-spacer is-large u-ignore-trim"></div>
      </section>

      {/* ============================================================
          TEAM CONTACTS
      ============================================================ */}
      <section data-theme="charcoal" data-hover-axis="y" data-hover="" className="contact_info-wrap u-position-relative u-theme-charcoal">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="contact_info-contain u-container">

          <div data-stagger="" className="contact_info-list">
            {teamContacts.map((contact) => (
              <div key={contact._key} data-stagger-item="" data-hover-item="" className="contact_info-item u-grid-custom u-align-items-center u-overflow-hidden u-position-relative">
                <div data-hover-tile="" className="contact_info-tile u-cover-absolute"></div>
                <div className="contact_info-border u-position-absolute u-width-full"></div>

                {/* Name */}
                <div className="contact_info-col u-column-start-1 u-column-span-4 u-position-relative">
                  <div className="u-text-style-h4 u-text-transform-uppercase">
                    {contact.name?.includes('MRICS')
                      ? contact.name.replace('MRICS', '').trim()
                      : contact.name}
                  </div>
                  <div className="u-text-style-small u-text-transform-uppercase u-color-faded u-margin-top-1">
                    {[contact.name?.includes('MRICS') ? 'MRICS' : null, contact.role].filter(Boolean).join(' / ')}
                  </div>
                </div>

                {/* Phone */}
                <div className="contact_info-col u-column-start-7 u-column-span-3 u-position-relative">
                  <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                    <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">Call</div>
                    {contact.phone && (
                      <StaggerLink href={`tel:${contact.phone.replace(/\s/g, '')}`} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">{contact.phone}</StaggerLink>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="contact_info-col u-column-start-10 u-column-span-3 u-position-relative">
                  <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                    <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">Email</div>
                    {contact.email && (
                      <StaggerLink href={`mailto:${contact.email}`} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">{contact.email}</StaggerLink>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="contact_info-border is-bottom u-position-absolute u-width-full"></div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}
      <SectionDivider theme="charcoal" />

      {/* ============================================================
          GENERAL ENQUIRIES & ADDRESS
      ============================================================ */}
      <section data-theme="charcoal" data-hover-axis="y" data-hover="" className="contact_address-wrap u-position-relative u-theme-charcoal">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="contact_address-contain u-container">

          <div data-stagger="" className="contact_info-list">

            {/* General enquiries */}
            <div data-stagger-item="" data-hover-item="" className="contact_info-item u-grid-custom u-align-items-center u-overflow-hidden u-position-relative">
              <div data-hover-tile="" className="contact_info-tile u-cover-absolute"></div>
              <div className="contact_info-border u-position-absolute u-width-full"></div>

              <div className="contact_info-col u-column-start-1 u-column-span-4 u-position-relative">
                <div className="u-text-style-h4 u-text-transform-uppercase">General Enquiries</div>
              </div>

              <div className="contact_info-col u-column-start-7 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">{phoneLabel}</div>
                  <StaggerLink href={phoneHref} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">{phoneNumber}</StaggerLink>
                </div>
              </div>

              <div className="contact_info-col u-column-start-10 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">{emailLabel}</div>
                  <StaggerLink href={emailHref} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">{emailAddress}</StaggerLink>
                </div>
              </div>
            </div>

            {/* Address */}
            <div data-stagger-item="" data-hover-item="" className="contact_info-item u-grid-custom u-align-items-center u-overflow-hidden u-position-relative">
              <div data-hover-tile="" className="contact_info-tile u-cover-absolute"></div>
              <div className="contact_info-border u-position-absolute u-width-full"></div>

              <div className="contact_address-col u-column-start-1 u-column-span-4 u-position-relative">
                <div className="u-text-style-h4 u-text-transform-uppercase">{addressEyebrow}</div>
              </div>

              <div className="contact_address-col u-column-start-7 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">Address</div>
                  <StaggerLink href={googleMapsUrl} external className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">Google Maps</StaggerLink>
                </div>
              </div>

              <div className="contact_address-col u-column-start-10 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">{visitLabel}</div>
                  <StaggerLink href={bookVisitUrl} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">Book a Visit</StaggerLink>
                </div>
              </div>
            </div>

          </div>

          <div className="contact_info-border is-bottom u-position-absolute u-width-full"></div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          PARTNER CAROUSEL
      ============================================================ */}
      <PartnerCarousel heading={partnerCarousel?.heading} />
    </>
  );
}
