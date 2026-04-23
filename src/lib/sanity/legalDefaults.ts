// Boilerplate fallback content for legal pages. Used when the corresponding
// Sanity document has no body — clients can override everything in the Studio.
// Each block uses the standard Portable Text shape so it can be rendered by
// @portabletext/react without modification.

type Block = {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h2' | 'h3';
  children: { _type: 'span'; _key: string; text: string; marks: string[] }[];
  markDefs: never[];
};

const span = (key: string, text: string): Block['children'][number] => ({
  _type: 'span',
  _key: key,
  text,
  marks: [],
});

const block = (key: string, style: Block['style'], text: string): Block => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [span(`${key}s`, text)],
});

export const privacyPolicyDefaultBody: Block[] = [
  block('p1', 'normal', 'This Privacy Policy describes how Element BC ("we", "us", or "our") collects, uses, and shares information about you when you visit our website or otherwise interact with us. By using our site you agree to the practices described below.'),

  block('h-info', 'h2', 'Information We Collect'),
  block('p2', 'normal', 'We may collect information you provide directly to us — for example when you complete a contact form, request a proposal, or correspond with us by email. This typically includes your name, email address, phone number, company name, and the contents of your message.'),
  block('p3', 'normal', 'We also automatically collect certain information when you visit the site, such as your IP address, browser type, device information, referring URL, and pages viewed. This data is used to operate and improve the site.'),

  block('h-use', 'h2', 'How We Use Your Information'),
  block('p4', 'normal', 'We use the information we collect to respond to enquiries, provide and improve our services, communicate with you about projects or proposals, comply with legal obligations, and protect the security and integrity of our website.'),

  block('h-share', 'h2', 'Sharing of Information'),
  block('p5', 'normal', 'We do not sell your personal information. We may share information with trusted service providers who help us operate our business (for example email and analytics providers), where required by law, or in connection with a business transfer such as a merger or acquisition.'),

  block('h-cookies', 'h2', 'Cookies and Analytics'),
  block('p6', 'normal', 'Our website may use cookies and similar technologies to remember your preferences, understand how the site is used, and improve performance. You can control cookies through your browser settings; disabling them may affect site functionality.'),

  block('h-rights', 'h2', 'Your Rights'),
  block('p7', 'normal', 'Depending on your location, you may have rights to access, correct, delete, or restrict the use of your personal data, or to object to certain processing. To exercise these rights please contact us using the details below.'),

  block('h-retention', 'h2', 'Data Retention'),
  block('p8', 'normal', 'We retain personal information for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required or permitted by law.'),

  block('h-security', 'h2', 'Security'),
  block('p9', 'normal', 'We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorised access. No method of transmission over the internet is fully secure, however, and we cannot guarantee absolute security.'),

  block('h-changes', 'h2', 'Changes to This Policy'),
  block('p10', 'normal', 'We may update this Privacy Policy from time to time. The "Last updated" date at the top of the page reflects the most recent revision. Please review this page periodically.'),

  block('h-contact', 'h2', 'Contact Us'),
  block('p11', 'normal', 'If you have any questions about this Privacy Policy or our handling of your personal information, please contact us via the details on our Contact page.'),
];

export const termsConditionsDefaultBody: Block[] = [
  block('p1', 'normal', 'These Terms and Conditions ("Terms") govern your access to and use of the Element BC website. By accessing or using the site you agree to be bound by these Terms. If you do not agree, please do not use the site.'),

  block('h-use', 'h2', 'Use of the Site'),
  block('p2', 'normal', 'You may use the site for lawful purposes only. You agree not to use the site in any way that is unlawful, fraudulent, or harmful, or that could damage, disable, overburden, or impair the site or interfere with any other party\'s use of it.'),

  block('h-ip', 'h2', 'Intellectual Property'),
  block('p3', 'normal', 'All content on the site — including text, images, graphics, logos, and code — is owned by or licensed to Element BC and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.'),

  block('h-content', 'h2', 'Accuracy of Information'),
  block('p4', 'normal', 'We aim to keep the information on the site accurate and up to date but make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the site or the information contained on it.'),

  block('h-third', 'h2', 'Third-Party Links'),
  block('p5', 'normal', 'The site may contain links to third-party websites. These links are provided for convenience only and we have no control over the content of those sites. We accept no responsibility for them or for any loss or damage that may arise from your use of them.'),

  block('h-liability', 'h2', 'Limitation of Liability'),
  block('p6', 'normal', 'To the fullest extent permitted by law, Element BC will not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the site, even if we have been advised of the possibility of such damages.'),

  block('h-indemnity', 'h2', 'Indemnity'),
  block('p7', 'normal', 'You agree to indemnify and hold Element BC harmless from any claim, demand, loss, or damages, including reasonable legal fees, made by any third party arising out of your breach of these Terms or your misuse of the site.'),

  block('h-changes', 'h2', 'Changes to These Terms'),
  block('p8', 'normal', 'We may update these Terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised Terms. Please review this page regularly.'),

  block('h-law', 'h2', 'Governing Law'),
  block('p9', 'normal', 'These Terms are governed by and construed in accordance with the laws of England and Wales, and any disputes arising under them are subject to the exclusive jurisdiction of the courts of England and Wales.'),

  block('h-contact', 'h2', 'Contact Us'),
  block('p10', 'normal', 'If you have any questions about these Terms, please contact us via the details on our Contact page.'),
];
