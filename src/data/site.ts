export const site = {
  name: 'Khalid Elhousieny',
  initials: 'K.E.',
  title: 'Khalid Elhousieny — AI Engineer: generative AI, agentic workflows & automation',
  description:
    'I build AI systems that do real work: LLM agents, Claude API pipelines and MCP integrations, shipped end to end and kept running in production.',
  focus: ['Generative AI', 'Agentic workflows', 'AI automation'],
  /** Shown as the scrolling Tools strip between About and Contact. */
  tools: ['TypeScript', 'Python', 'Bash', 'Docker', 'launchd', 'n8n', 'Expo', 'React Native', 'Claude API', 'RAG'],
  /**
   * Medium handle without the @, from MEDIUM_HANDLE in .env at build time.
   * Empty = no Medium link and no Writing section.
   */
  medium: import.meta.env.MEDIUM_HANDLE ?? '',
  // Empty links are hidden. Fill these in before launch.
  links: {
    /** From CONTACT_EMAIL in .env at build time. */
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
