export interface Project {
  name: string;
  desc: string;
  kind: string;
  /** Line icon shown with the kind label. */
  icon?: 'smartphone' | 'brain' | 'network' | 'search' | 'workflow';
  /** Case study or repo URL; the row is a link only when set. */
  href?: string;
  /** "What I built": shown in an expandable panel under the row. */
  highlights?: string[];
  /** Stack, shown as tags in the panel. */
  tags?: string[];
}

export const projects: Project[] = [
  {
    name: 'Calasanics',
    desc: 'A calorie tracker you talk to. Describe a meal; get a per-ingredient nutrition card.',
    kind: 'iOS app',
    icon: 'smartphone',
    highlights: ['Turns a spoken or typed meal into a per-ingredient nutrition card computed from a real food database.'],
    tags: ['Expo', 'React Native'],
  },
  {
    name: 'AI Second Brain',
    desc: 'An Obsidian vault that fills itself, with a Claude-powered desktop assistant on top.',
    kind: 'AI / Knowledge',
    icon: 'brain',
    highlights: [
      'Automated pipelines sync notes and OCR-extract PDF, DOCX and XLSX documents into a searchable vault.',
      'A custom desktop assistant queries the vault with Claude and reaches into Microsoft 365.',
    ],
    tags: ['Obsidian', 'Electron', 'JavaScript', 'Claude API', 'Microsoft 365'],
  },
  {
    name: 'Setup Map',
    desc: 'A self-redrawing map of every service and scheduled job on a home server.',
    kind: 'Infrastructure',
    icon: 'network',
    highlights: [
      'One frame per setup, with each box colored by live launchd, Docker, port and GitHub checks.',
      'A nightly redraw calls Claude only for the setups whose sources changed.',
      'Sends a Telegram alert when a redraw fails.',
    ],
    tags: ['Excalidraw', 'launchd', 'Docker', 'Claude'],
  },
  {
    name: 'Private RAG',
    desc: 'Self-hosted search and Q&A over personal documents, fully local.',
    kind: 'AI / Search',
    icon: 'search',
    highlights: [
      'Hybrid search (BM25, embeddings and a reranker) over documents indexed in place, with no cloud calls.',
      'A sidecar extractor makes PDF, XLSX and DOCX files searchable.',
      'Served to a local chat assistant over MCP, with a nightly re-index that audits for secrets.',
    ],
    tags: ['RAG', 'MCP', 'Ollama', 'launchd'],
  },
  {
    name: 'Automations',
    desc: 'n8n workflows and Telegram alerts that only ping when a human is needed.',
    kind: 'Automation',
    icon: 'workflow',
    highlights: [
      'Self-hosted n8n in Docker, with its assistant running on a local model.',
      'Telegram alerts say what to do and where, repeat until it is done, then go quiet.',
    ],
    tags: ['n8n', 'Docker', 'Telegram', 'Ollama'],
  },
];
