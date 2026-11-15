import { parse } from 'yaml';
// Imported with ?raw so Vite inlines the file at build time; the path is
// resolved by the bundler, not at runtime.
import source from '../../data/resume.yaml?raw';

export interface Link { label: string; url: string; handle: string }
export interface Entry {
  org: string;
  role?: string;
  degree?: string;
  gpa?: string;
  location?: string;
  dates: string;
  logo?: string;
  items?: string[];
}
export interface Publication {
  venue: string;
  note?: string;
  award?: string;
  title: string;
  url?: string;
  /** Filename in public/papers/ — the paper's first page. */
  thumb?: string;
  /** Public code release, when there is one. */
  repo?: string;
  year: number;
}

/** One stop on the homepage's career path. */
export interface PathStop {
  date: string;
  org: string;
  role: string;
  kind?: 'education';
  current?: boolean;
}
export interface SkillGroup { label: string; items: string[] }
export interface Project { title: string; url?: string; dates: string; description: string }

export interface Resume {
  name: string;
  tagline: string;
  /** Filename in public/ */
  photo?: string;
  focus: string[];
  location: string;
  email: string;
  links: Link[];
  summary: string;
  path: PathStop[];
  experience: Entry[];
  publications: Publication[];
  education: Entry[];
  skills: SkillGroup[];
  projects: Project[];
  awards: string[];
  leadership: Entry[];
}

export const resume = parse(source) as Resume;
