import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({ name: "getInTouchEyebrow", title: "Get In Touch Eyebrow", type: "string" }),
    defineField({
      name: "teamContacts",
      title: "Team Contacts",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "phone", title: "Phone Number", type: "string" }),
            defineField({ name: "email", title: "Email Address", type: "string" }),
          ],
          preview: {
            select: { title: "name", subtitle: "role" },
          },
        },
      ],
    }),
    defineField({ name: "phoneLabel", title: "Phone Label", type: "string" }),
    defineField({ name: "phoneNumber", title: "Phone Number", type: "string" }),
    defineField({ name: "emailLabel", title: "Email Label", type: "string" }),
    defineField({ name: "emailAddress", title: "Email Address", type: "string" }),
    defineField({ name: "addressEyebrow", title: "Address Eyebrow", type: "string" }),
    defineField({ name: "addressLine1", title: "Address Line 1", type: "string" }),
    defineField({ name: "addressLine2", title: "Address Line 2", type: "string" }),
    defineField({ name: "addressLine3", title: "Address Line 3", type: "string" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps URL", type: "url" }),
    defineField({ name: "visitLabel", title: "Visit Label", type: "string" }),
    defineField({ name: "bookVisitUrl", title: "Book a Visit URL", type: "url", validation: (Rule) => Rule.uri({ allowRelative: true }) }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
