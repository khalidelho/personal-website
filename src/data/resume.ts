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
  headline: 'Forward Deployed Engineer — AI Automation & Integrations',
  location: 'Dallas-Fort Worth Metroplex, TX',
  summary:
    'Automation-focused engineer with a Computer Science degree who delivers customer-facing automation end to end, from scoping through launch, with no specs and no playbook. Builds production automation in Python and workflow tools (n8n, GitHub Actions); thinks in data flows, edge cases, and failure modes; and ramps up fast in new domains.',
  experience: [
    {
      title: 'Field AI Engineer / IT & Billing Manager (Contract)',
      org: 'RIVUS Consulting LLC',
      location: 'Carrollton, TX',
      start: 'Apr 2026',
      end: 'Present',
      points: [
        'Scoped and delivered an end-to-end AI automation suite for 6+ government contracts: clarified requirements, defined the technical approach, and shipped production Python automation, cutting invoice prep from roughly 3 days to under a day.',
        'Automated workflows across the customer stack: ADP payroll exports, Microsoft 365 via REST/Graph APIs, and Claude API pipelines parsing invoice PDFs into validated data, eliminating an estimated 35–40 hours of manual work monthly.',
        'Operated and debugged workflows in live production: monitoring, failure alerting, credential rotation, and validation rules catching edge cases before they reached invoices, delivering 4 consecutive on-time billing cycles.',
      ],
      tags: ['Python', 'Claude API', 'Microsoft Graph', 'REST APIs', 'ADP'],
    },
    {
      title: 'Implementation Engineer / Operations Manager',
      org: 'Drive Dynamics',
      location: 'Grand Prairie, TX',
      start: 'Aug 2025',
      end: 'Aug 2026',
      points: [
        'Digitized a completely unorganized ~500-SKU warehouse into an inventory app with a structured location system, cutting item retrieval from about 2 minutes to 10 seconds.',
        'Built a QR-code labeling system that streamlined picking, and standardized order intake and financial close in QuickBooks, cutting recurring order errors from roughly 10 per month to 2–3.',
      ],
      tags: ['QuickBooks', 'QR labeling'],
    },
    {
      title: 'Program Manager',
      org: 'Qalam Institute',
      location: 'Dallas, TX',
      start: 'Nov 2023',
      end: 'Mar 2026',
      points: [
        'Ran live technical production for 6 weekly broadcast and streamed programs, resolving issues in real time; incident analysis and pre-event checks cut AV incidents from several a week to a couple a month.',
      ],
    },
    {
      title: 'Product Manager',
      org: 'Course Finder',
      location: 'Redmond, WA',
      start: 'Sep 2021',
      end: 'Nov 2022',
      points: [
        'Launched a consumer web product adopted by 6,000+ students across 15 colleges, setting up recurring user focus groups and interviews to gather continuous feedback on improvements.',
        'Paired direct user feedback with BigQuery SQL usage data to prioritize features and iterate post-launch.',
      ],
      tags: ['BigQuery', 'SQL'],
    },
  ],
  projects: [
    {
      name: 'AI Second Brain',
      desc: 'Obsidian-based knowledge system: automated pipelines sync notes and OCR-extract documents (PDF, DOCX, XLSX) into a searchable vault, queried by a custom Claude-powered desktop assistant (Electron/JavaScript) with Microsoft 365 integration.',
    },
    {
      name: 'Telegram Contract-Alerts Agent',
      desc: 'Notification agent wired into the billing automation stack: scheduled jobs push real-time Telegram alerts on contract deadlines, missing timesheet data, pipeline failures, and steps needing human action.',
    },
  ],
  education: [
    {
      title: 'B.S. Computer Science / Software Engineering',
      org: 'University of Washington',
      year: '2023',
    },
  ],
  certifications: [],
  skills: [
    {
      group: 'Automation',
      items: ['Python (production automation)', 'Workflow automation (n8n, CI/CD)', 'AI & LLM automation (Claude API, MCP)'],
    },
    {
      group: 'Integration & data',
      items: ['REST APIs & integrations', 'SQL & BigQuery', 'JavaScript (React, Node)'],
    },
    {
      group: 'Delivery',
      items: ['Production debugging & monitoring', 'Customer-facing delivery', 'B2B ops & ERP (QuickBooks, Excel)'],
    },
  ],
};

export const hasResume = resume.experience.length > 0;
