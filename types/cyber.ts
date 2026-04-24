export type Severity = "low" | "medium" | "high" | "critical";

export type Audience = "individuals" | "businesses" | "both";

export type CategorySlug =
  | "network-attacks"
  | "ransomware"
  | "phishing-social-engineering"
  | "account-compromise"
  | "malware"
  | "system-security"
  | "web-threats"
  | "data-exposure"
  | "email-security"
  | "mobile-personal-security";

export interface Category {
  id: number;
  slug: CategorySlug;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  color: string;
  focusAreas: string[];
}

export interface ThreatFaq {
  question: string;
  answer: string;
}

export interface Threat {
  id: number;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  category: string;
  icon: string;
  severity: Severity;
  threatType: string;
  audience: Audience;
  keywords?: string[];
  affectedSystems: string[];
  shortDescription: string;
  definition: string;
  fullDescription: string;
  howItHappens: string;
  howItReachesTarget: string;
  warningSigns: string[];
  impact: string[];
  prevention: string[];
  selfProtection: string[];
  initialResponse: string[];
  whenToEscalate: string[];
  faq: ThreatFaq[];
}

export interface NavigationLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavigationLink[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AnalysisResult {
  title: string;
  threatType: string;
  severity: Severity;
  needsExpert: boolean;
  summary: string;
  firstSteps: string[];
  recommendations: string[];
}

export type CompanyType =
  | "small"
  | "medium"
  | "large"
  | "education"
  | "technology"
  | "government"
  | "other";

export interface BusinessQuoteSummary {
  companyType: CompanyType;
  computerCount: number;
  serverCount: number;
  estimatedPrice: number;
}

export type IncidentStatus = "open" | "investigating" | "contained" | "closed";

export interface AdminIncident {
  id: string;
  type: string;
  category: string;
  severity: Severity;
  organization: string;
  affectedSystem: string;
  status: IncidentStatus;
  reportedAt: string;
  summary: string;
}

export interface SpecialistProfile {
  id: string;
  name: string;
  primarySpecialty: string;
  subSpecialties: string[];
  description: string;
  experienceLevel: string;
  handles: string[];
  availability: string;
  supportsUnclassified?: boolean;
}
