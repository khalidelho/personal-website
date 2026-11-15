// Résumé content. The /resume page and its nav link appear once `experience`
// has an entry. `npm run resume:pdf` prints /resume to public/resume.pdf
// (gitignored), which adds a download button.

export interface Role {
  title: string;
  org: string;
  start: string; // e.g. "Apr 2026"
  end: string; // e.g. "Present"
  location?: string;
  points: string[];
  /** Tools named in the points; shown as tags on the homepage only. */
  tags?: string[];
  /** false: the homepage leaves the org out (the name appears on /resume only). */
  orgOnHome?: boolean;
}

export interface Entry {
  title: string;
  org: string;
  year?: string;
}

export interface Project {
  name: string;
  desc: string;
}

export const resume: {
  headline: string;
  location: string;
  summary: string;
  experience: Role[];
  projects: Project[];
  education: Entry[];
  certifications: Entry[];
  skills: { group: string; items: string[] }[];
} = {
  headline: 'AI Engineer — Forward Deployed, Generative AI & Agentic Workflows',
  location: 'Dallas-Fort Worth Metroplex, TX',
  summary:
    "AI engineer who builds AI systems that do real work: LLM agents, Claude API pipelines and MCP integrations, shipped with human-in-the-loop controls. I've lived the processes I automate (financial close, 500-SKU inventory, live production), so I build AI that moves real metrics. CS degree; Python, SQL, REST APIs.",
  experience: [
    {
      title: 'AI Engineer / Forward Deployed Engineer (Contract)',
      org: 'RIVUS Consulting LLC',
      orgOnHome: false,
      location: 'Carrollton, TX (remote)',
      start: 'Apr 2026',
      end: 'Present',
      points: [
        'Owned the roadmap and backlog of an AI automation suite replacing manual invoice prep across 6+ government contracts, cutting invoice preparation from 3 days to 6 hours.',
        'Deployed LLM agents running billing workflows, Claude API pipelines parsing invoices into validated data, MCP integrations linking agents to Microsoft 365, and an AI document assistant, saving ~40 hours a month with human-in-the-loop controls.',
        'Engineered secure Microsoft Graph and Exchange Online integrations (app-only auth) and ran Microsoft 365 end to end, with 100% on-time submissions across 4 billing cycles.',
      ],
      tags: ['Python', 'Claude API', 'MCP', 'LLM agents', 'Microsoft Graph'],
    },
    {
      title: 'AI Engineer / Operations Manager',
      org: 'Drive Dynamics Solutions',
      location: 'Grand Prairie, TX',
      start: 'Aug 2025',
      end: 'Aug 2026',
      points: [
        'Built a WhatsApp AI assistant on the inventory system: staff text it in plain language to check stock and bin locations, log items in and out, and track borrowed tools.',
        'Digitized a completely unorganized ~500-SKU warehouse into an inventory app with a structured location system and QR-code labels, cutting item retrieval from about 2 minutes to 10 seconds.',
        'Standardized order intake and financial close in QuickBooks, cutting recurring order errors from about 10 a month to 2–3.',
      ],
      tags: ['WhatsApp', 'AI assistant', 'QuickBooks', 'QR labeling'],
    },
    {
      title: 'Program Manager; Executive Assistant to the President',
      org: 'Qalam Institute',
      location: 'Dallas, TX',
      start: 'Nov 2023',
      end: 'Apr 2026',
      points: [
        'Ran live production for 6 weekly broadcast and streamed programs; incident analysis and pre-event checks cut AV incidents from several a week to a couple a month.',
      ],
    },
    {
      title: 'Product Manager',
      org: 'Course Finder',
      location: 'Redmond, WA',
      start: 'Sep 2021',
      end: 'Nov 2022',
      points: [
        'Launched a consumer web product adopted by 6,000+ students across 15 colleges, pairing user interviews and focus groups with BigQuery SQL usage data to prioritize features after launch.',
        "Placed 1st at Founders Live Seattle and 2nd of 30 teams at StartupUW's Startup Studio.",
      ],
      tags: ['BigQuery', 'SQL'],
    },
  ],
  projects: [
    {
      name: 'AI Second Brain',
      desc: 'Obsidian vault fed by pipelines that sync notes and OCR-extract PDF, DOCX and XLSX files, queried by a Claude-powered Electron assistant with Microsoft 365 access.',
    },
  ],
  education: [
    {
      title: "B.S. Computer Science / Software Engineering (Dean's List)",
      org: 'University of Washington',
      year: '2023',
    },
  ],
  certifications: [
    { title: 'Project management courses', org: 'Microsoft (6-course series) and Google', year: '2025' },
  ],
  skills: [
    {
      group: 'AI & automation',
      items: ['Python', 'LLM agents & agentic workflows', 'Claude / OpenAI APIs, MCP', 'n8n, CI/CD'],
    },
    {
      group: 'Integration & data',
      items: ['REST APIs & Microsoft Graph', 'SQL & BigQuery', 'JavaScript (React, Node)'],
    },
    {
      group: 'Delivery',
      items: ['Product management', 'Production debugging', 'QuickBooks, Excel'],
    },
  ],
};

export const hasResume = resume.experience.length > 0;
