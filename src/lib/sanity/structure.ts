import type { StructureResolver } from 'sanity/structure'
import {
  HomeIcon,
  UsersIcon,
  CaseIcon,
  EnvelopeIcon,
  CogIcon,
  MenuIcon,
  LinkIcon,
  StarIcon,
  DocumentsIcon,
  TagIcon,
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Element BC')
    .items([
      /* ── Pages ── */
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(HomeIcon)
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                ),
              S.listItem()
                .title('About Page')
                .icon(UsersIcon)
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                ),
              S.listItem()
                .title('Case Studies Page')
                .icon(CaseIcon)
                .child(
                  S.document()
                    .schemaType('projectsPage')
                    .documentId('projectsPage')
                ),
              S.listItem()
                .title('Contact Page')
                .icon(EnvelopeIcon)
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                ),
              S.listItem()
                .title('Privacy Policy')
                .icon(DocumentsIcon)
                .child(
                  S.document()
                    .schemaType('legalPage')
                    .documentId('privacyPolicy')
                ),
              S.listItem()
                .title('Terms & Conditions')
                .icon(DocumentsIcon)
                .child(
                  S.document()
                    .schemaType('legalPage')
                    .documentId('termsConditions')
                ),
            ])
        ),

      S.divider(),

      /* ── Projects ── */
      S.listItem()
        .title('Projects')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('project')
            .title('All Projects')
        ),
      S.listItem()
        .title('Project Categories')
        .icon(TagIcon)
        .child(
          S.documentTypeList('projectCategory')
            .title('Project Categories')
        ),

      S.divider(),

      /* ── Global ── */
      S.listItem()
        .title('Global')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Global')
            .items([
              S.listItem()
                .title('Site Settings')
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
              S.listItem()
                .title('Navigation')
                .icon(MenuIcon)
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                ),
              S.listItem()
                .title('Footer')
                .icon(LinkIcon)
                .child(
                  S.document()
                    .schemaType('footer')
                    .documentId('footer')
                ),
              S.listItem()
                .title('Partner Carousel')
                .icon(StarIcon)
                .child(
                  S.document()
                    .schemaType('partnerCarousel')
                    .documentId('partnerCarousel')
                ),
            ])
        ),
    ])
