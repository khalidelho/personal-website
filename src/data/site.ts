export const site = {
  name: 'Khalid Elhousieny',
  initials: 'K.E.',
  title: 'Khalid Elhousieny — IT systems, automation, small apps',
  description:
    'I run infrastructure and build the tools around it: automations that stay quiet, apps that do one thing, and maps of systems so nobody has to remember them.',
  focus: ['IT systems', 'Automation', 'Small apps'],
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
    email: '',
    github: 'https://github.com/khalidelho',
    linkedin: 'https://www.linkedin.com/in/khalidel/',
  },
};

export const contactLinks = () =>
  [
    { label: 'Email', href: site.links.email && `mailto:${site.links.email}` },
    { label: 'LinkedIn', href: site.links.linkedin },
    { label: 'Medium', href: site.medium && `https://medium.com/@${site.medium}` },
    { label: 'GitHub', href: site.links.github },
  ].filter((l) => l.href);
