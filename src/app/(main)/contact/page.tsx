import type { Metadata } from 'next';
import { getContactPage } from '@/lib/sanity/queries';
import StaggerLink from '@/components/ui/StaggerLink';
import AboutHeroBackgroundSvg from '@/components/ui/svgs/AboutHeroBackgroundSvg';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await getContactPage();
  return {
    title: contactPage?.seoTitle ?? 'Contact | Element BC',
    description: contactPage?.seoDescription,
  };
}

const EyebrowSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 61 42" fill="none" data-stagger-item="" className={className}>
    <path d="M25.3848 0.64093V4.85967C25.3848 5.21835 25.0933 5.5087 24.7331 5.5087H0.652998C-0.0716348 5.5087 -0.256013 6.51215 0.421455 6.76408L12.4015 11.2774C12.4744 11.3073 12.5516 11.3201 12.633 11.3201H24.7374C25.0976 11.3201 25.3891 11.6105 25.3891 11.9692V17.1316H0.652998C-0.0716348 17.1316 -0.256013 18.1308 0.421455 18.387L12.4015 22.9003C12.4744 22.9302 12.5516 22.943 12.633 22.943H24.7374C25.0976 22.943 25.3891 23.2334 25.3891 23.5921V28.7545H0.652998C-0.0716348 28.7545 -0.256013 29.7579 0.421455 30.0141L31.7736 41.8206C31.8465 41.8505 31.9237 41.8633 32.0052 41.8633H59.5412C59.9014 41.8633 60.193 41.5729 60.193 41.2143V36.5045C60.193 36.2355 60.0214 35.9921 59.7685 35.8981L48.0972 31.5043C47.4197 31.2481 47.6041 30.2447 48.3287 30.2447H59.5369C59.8971 30.2447 60.1887 29.9543 60.1887 29.5957V24.8859C60.1887 24.6169 60.0172 24.3735 59.7642 24.2795L48.0929 19.8857C47.4154 19.6295 47.5998 18.6261 48.3244 18.6261H59.5326C59.8928 18.6261 60.1844 18.3357 60.1844 17.977V13.263C60.1844 12.994 60.0129 12.7506 59.7599 12.6566L26.2638 0.0431294C25.8394 -0.11913 25.3806 0.196854 25.3806 0.649472" fill="currentColor" />
  </svg>
);

export default async function ContactPage() {
  const contactPage = await getContactPage();

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
      <section data-hero-wrap="" data-theme="buff" className="contact_hero-wrap">
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
          GET IN TOUCH SECTION
      ============================================================ */}
      <section data-theme="charcoal" data-hover-axis="y" data-hover="" className="contact_info-wrap u-position-relative">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="contact_info-contain u-container">

          {/* Section heading */}
          <div data-split-wrapper="" className="contact_info_heading-wrap u-flex-horizontal-nowrap u-justify-content-between u-align-items-end">
            <div className="contact_info_heading-inner">
              <h2 data-split="word" className="u-max-width-17ch u-text-style-h2 u-text-transform-uppercase u-text-decoration-justify-last">{contactPage?.getInTouchEyebrow ?? 'Get In Touch'}</h2>
            </div>
          </div>

          {/* Contact rows */}
          <div data-stagger="" className="contact_info-list">

            {/* Team contacts */}
            {teamContacts.map((contact) => (
              <div key={contact._key} data-stagger-item="" data-hover-item="" className="contact_info-item u-grid-custom u-align-items-center u-overflow-hidden u-position-relative">
                <div data-hover-tile="" className="contact_info-tile u-cover-absolute"></div>
                <div className="contact_info-border u-position-absolute u-width-full"></div>

                {/* Name */}
                <div className="contact_info-col u-column-start-1 u-column-span-4 u-position-relative">
                  <div className="u-text-style-h4 u-text-transform-uppercase">{contact.name}</div>
                  {contact.role && (
                    <div className="u-text-style-small u-text-transform-uppercase u-color-faded u-margin-top-1">{contact.role}</div>
                  )}
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

            {/* General enquiries */}
            <div data-stagger-item="" data-hover-item="" className="contact_info-item u-grid-custom u-align-items-center u-overflow-hidden u-position-relative">
              <div data-hover-tile="" className="contact_info-tile u-cover-absolute"></div>
              <div className="contact_info-border u-position-absolute u-width-full"></div>

              {/* Label */}
              <div className="contact_info-col u-column-start-1 u-column-span-4 u-position-relative">
                <div className="u-text-style-h4 u-text-transform-uppercase">General Enquiries</div>
              </div>

              {/* Phone */}
              <div className="contact_info-col u-column-start-7 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">{phoneLabel}</div>
                  <StaggerLink href={phoneHref} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">{phoneNumber}</StaggerLink>
                </div>
              </div>

              {/* Email */}
              <div className="contact_info-col u-column-start-10 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">{emailLabel}</div>
                  <StaggerLink href={emailHref} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">{emailAddress}</StaggerLink>
                </div>
              </div>
            </div>

          </div>

          <div className="contact_info-border is-bottom u-position-absolute u-width-full"></div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          ADDRESS SECTION
      ============================================================ */}
      <section data-theme="charcoal" data-hover-axis="y" data-hover="" className="contact_address-wrap u-position-relative">
        <div className="contact_address-contain u-container">

          <div data-stagger="" className="contact_address-list">
            <div data-stagger-item="" data-hover-item="" className="contact_info-item u-grid-custom u-align-items-center u-overflow-hidden u-position-relative">
              <div data-hover-tile="" className="contact_info-tile u-cover-absolute"></div>
              <div className="contact_info-border u-position-absolute u-width-full"></div>

              {/* Label */}
              <div className="contact_address-col u-column-start-1 u-column-span-4 u-position-relative">
                <div className="u-text-style-h4 u-text-transform-uppercase">{addressEyebrow}</div>
              </div>

              {/* Address */}
              <div className="contact_address-col u-column-start-7 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">Address</div>
                  <StaggerLink href={googleMapsUrl} external className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">Google Maps</StaggerLink>
                </div>
              </div>

              {/* Visit */}
              <div className="contact_address-col u-column-start-10 u-column-span-3 u-position-relative">
                <div className="contact_detail-block u-flex-vertical-nowrap u-gap-2">
                  <div className="contact_detail-label u-text-style-small u-text-transform-uppercase u-color-faded">{visitLabel}</div>
                  <StaggerLink href={bookVisitUrl} className="contact_detail-value u-text-style-main u-weight-bold u-text-transform-uppercase u-text-decoration-underline">Book a Visit</StaggerLink>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>
    </>
  );
}
