export interface Project {
  name: string;
  desc: string;
  kind: string;
  /** Case study or repo URL; the row is a link only when set. */
  href?: string;
}

export const projects: Project[] = [
  {
    name: 'Calasanics',
    desc: 'A calorie tracker you talk to. Describe a meal; get a per-ingredient nutrition card.',
    kind: 'iOS app',
  },
  {
    name: 'Setup Map',
    desc: 'A self-redrawing map of every service and scheduled job on a home server.',
    kind: 'Infrastructure',
  },
  {
    name: 'Private RAG',
    desc: 'Self-hosted search and Q&A over personal documents, fully local.',
    kind: 'AI / Search',
  },
  {
    name: 'Automations',
    desc: 'n8n workflows and Telegram alerts that only ping when a human is needed.',
    kind: 'Automation',
  },
];
