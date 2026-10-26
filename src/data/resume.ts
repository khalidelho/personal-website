// Résumé content. The /resume page and its nav link appear once `experience`
// has an entry. Drop a PDF at public/resume.pdf to add a download button.

export interface Role {
  title: string;
  org: string;
  start: string; // e.g. "2024"
  end: string; // e.g. "Present"
  location?: string;
  points: string[];
}

export interface Entry {
  title: string;
  org: string;
  year?: string;
}

export const resume: {
  summary: string;
  experience: Role[];
  education: Entry[];
  certifications: Entry[];
  skills: { group: string; items: string[] }[];
} = {
  summary: '',
  experience: [],
  education: [],
  certifications: [],
  skills: [],
};

export const hasResume = resume.experience.length > 0;
