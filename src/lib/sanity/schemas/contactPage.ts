import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "contacts", title: "Contacts" },
    { name: "address", title: "Address" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Hero ── */
    defineField({ name: "heroEyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeading", title: "Heading", type: "string", group: "hero" }),

    /* ── Contacts ── */
    defineField({ name: "getInTouchEyebrow", title: "Get In Touch Eyebrow", type: "string", group: "contacts" }),
    defineField({
      name: "teamContacts",
      title: "Team Contacts",
      type: "array",
      group: "contacts",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string" }),
          defineField({ name: "role", title: "Role", type: "string" }),
          defineField({ name: "phone", title: "Phone Number", type: "string" }),
          defineField({ name: "email", title: "Email Address", type: "string" }),
        ],
        preview: { select: { title: "name", subtitle: "role" } },
      }],
    }),
    defineField({ name: "phoneLabel", title: "Phone Label", type: "string", group: "contacts" }),
    defineField({ name: "phoneNumber", title: "Phone Number", type: "string", group: "contacts" }),
    defineField({ name: "emailLabel", title: "Email Label", type: "string", group: "contacts" }),
    defineField({ name: "emailAddress", title: "Email Address", type: "string", group: "contacts" }),

    /* ── Address ── */
    defineField({ name: "addressEyebrow", title: "Eyebrow", type: "string", group: "address" }),
    defineField({ name: "addressLine1", title: "Address Line 1", type: "string", group: "address" }),
    defineField({ name: "addressLine2", title: "Address Line 2", type: "string", group: "address" }),
    defineField({ name: "addressLine3", title: "Address Line 3", type: "string", group: "address" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps URL", type: "url", group: "address" }),
    defineField({ name: "visitLabel", title: "Visit Label", type: "string", group: "address" }),
    defineField({
      name: "bookVisitUrl",
      title: "Book a Visit URL",
      type: "url",
      group: "address",
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),

    /* ── SEO ── */
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      validation: (r) => r.max(60).warning("Keep under 60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      validation: (r) => r.max(160).warning("Keep under 160 characters"),
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
