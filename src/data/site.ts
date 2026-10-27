export const site = {
  name: 'Khalid Elhousieny',
  initials: 'K.E.',
  title: 'Khalid Elhousieny — Forward Deployed Engineer, AI automation & integrations',
  description:
    'I deliver customer-facing automation end to end, from scoping through launch: Python and workflow pipelines, API integrations and Claude-powered tools that keep running in production.',
  focus: ['AI automation', 'Integrations', 'Forward deployed'],
  /** Shown as the scrolling Tools strip between About and Contact. */
  tools: ['TypeScript', 'Python', 'Bash', 'Docker', 'launchd', 'n8n', 'Expo', 'React Native', 'Claude API', 'RAG'],
  /**
   * Medium handle without the @, from MEDIUM_HANDLE in .env (kept out of the
   * repo because the leak guard's deny list covers it). Empty = no Medium link
   * and no Writing section.
   */
  medium: import.meta.env.MEDIUM_HANDLE ?? '',
  // Empty links are hidden. Fill these in before launch.
  links: {
    /** From CONTACT_EMAIL in .env (it matches the leak guard's deny list). */
    email: import.meta.env.CONTACT_EMAIL ?? '',
    github: 'https://github.com/khalidelho',
    linkedin: 'https://www.linkedin.com/in/khalidel/',
  },
};

export const contactLinks = () =>
  [
    { label: 'Email', icon: 'mail', href: site.links.email && `mailto:${site.links.email}` },
    { label: 'LinkedIn', icon: 'linkedin', href: site.links.linkedin },
    { label: 'Medium', icon: 'medium', href: site.medium && `https://medium.com/@${site.medium}` },
    { label: 'GitHub', icon: 'github', href: site.links.github },
  ].filter((l) => l.href) as { label: string; icon: 'mail' | 'linkedin' | 'medium' | 'github'; href: string }[];
