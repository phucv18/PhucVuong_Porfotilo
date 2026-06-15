export interface NavLink {
  label: string;
  anchor: string;
}

export interface HeroData {
  navLinks: NavLink[];
  heading: string;
  subheading: string;
  portraitUrl: string;
  contactCta: string;
  roles: string[];
  rolePrefix?: string;
  roleSuffix?: string;
}

export interface MarqueeData {
  items: string[];
}

export interface AboutCard {
  type: string;
  title: string;
  text: string;
}

export interface AboutData {
  heading: string;
  paragraph: string;
  cards: AboutCard[];
  interactiveImg: string;
  contactCta: string;
}

export interface SoftwareSkill {
  name: string;
  percentage: number;
  color: string;
}

export interface FormatSkill {
  name: string;
  desc: string;
}

export interface CoreStrength {
  title: string;
  desc: string;
}

export interface SkillsData {
  heading: string;
  software: SoftwareSkill[];
  formats: FormatSkill[];
  coreStrengths: CoreStrength[];
}

export interface MilestoneItem {
  time: string;
  role: string;
  employer: string;
  details: string;
}

export interface ExperienceData {
  heading: string;
  milestones: MilestoneItem[];
}

export interface ProjectItem {
  number: string;
  category: string;
  name: string;
  ctaLabel: string;
  videoUrl: string;
  thumbUrl: string;
  desc: string;
}

export interface ProjectsData {
  heading: string;
  list: ProjectItem[];
}

export interface ContactData {
  heading: string;
  subheading: string;
  phone: string;
  email: string;
  facebook: string;
  facebookUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  ctaLabel: string;
}

export interface ContentData {
  system: {
    siteName: string;
    theme: {
      bgColor: string;
      fontFamily: string;
    };
  };
  hero: HeroData;
  marquee: MarqueeData;
  about: AboutData;
  skills: SkillsData;
  experience: ExperienceData;
  projects: ProjectsData;
  contact: ContactData;
}
