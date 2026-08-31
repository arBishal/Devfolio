export interface Project {
  name: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
}

export interface Experience {
  title: string;
  period: string;
  company: string;
  achievements: string[];
}

export interface ExternalLink {
  label: string;
  url: string;
  display: string;
}

export interface Skills {
  programming: string[];
  webStack: string[];
  databases: string[];
  tools: string[];
  aiWorkflows: string[];
  practices: string[];
}

export interface Personal {
  fullName: string;
  shortName: string;
  title: string;
  username: string;
  location: string;
  education: string[];
  bio: string[];
  portfolioVersion: string;
}

export interface Resume {
  filePath: string;
  downloadFilename: string;
}

export interface Contact {
  email: string;
  links: ExternalLink[];
  note: string;
}

export interface Blog {
  tagline: string;
  links: ExternalLink[];
}

export interface Publication {
  title: string;
  status: string;
  year: string;
  journal: string;
  authors: string;
}

export interface Interests {
  researchFocus: string;
  creativePursuits: string;
}

export interface PortfolioData {
  personal: Personal;
  resume: Resume;
  skills: Skills;
  projects: Project[];
  experience: Experience[];
  publications: Publication[];
  interests: Interests;
  contact: Contact;
  blog: Blog;
}
