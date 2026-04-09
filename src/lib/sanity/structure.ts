import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Projects')
        .child(
          S.documentTypeList('project')
            .title('All Projects')
        ),
      S.listItem()
        .title('Project Categories')
        .child(
          S.documentTypeList('projectCategory')
            .title('Project Categories')
        ),
      S.divider(),
      S.listItem()
        .title('Home Page')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),
      S.listItem()
        .title('About Page')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),
      S.listItem()
        .title('Case Studies Page')
        .child(
          S.document()
            .schemaType('projectsPage')
            .documentId('projectsPage')
        ),
      S.listItem()
        .title('Contact Page')
        .child(
          S.document()
            .schemaType('contactPage')
            .documentId('contactPage')
        ),
      S.divider(),
      S.listItem()
        .title('Navigation')
        .child(
          S.document()
            .schemaType('navigation')
            .documentId('navigation')
        ),
      S.listItem()
        .title('Footer')
        .child(
          S.document()
            .schemaType('footer')
            .documentId('footer')
        ),
      S.listItem()
        .title('Partner Carousel')
        .child(
          S.document()
            .schemaType('partnerCarousel')
            .documentId('partnerCarousel')
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ])
