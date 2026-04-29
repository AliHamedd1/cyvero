export type Severity = "low" | "medium" | "high" | "critical";

export type Audience = "individuals" | "businesses" | "both";

export type DevicePreference = "mobile" | "desktop";

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
  matchMode?: "exact" | "prefix";
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

export interface RatingReview {
  id: string;
  name: string;
  role: string;
  category: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface SpecialistAccount {
  specialistId: string;
  specialistName: string;
  username: string;
  password: string;
}

export interface SpecialistSession {
  specialistId: string;
  specialistName: string;
  username: string;
  loggedInAt: string;
}

export type SpecialistConversationStatus =
  | "pending"
  | "quoted"
  | "active"
  | "awaiting-client"
  | "closed"
  | "cancelled";

export type SpecialistConversationUrgency = "routine" | "priority" | "critical";

export type SpecialistMessageSender = "client" | "specialist" | "system";

export type SpecialistQuoteStatus = "pending-client" | "accepted" | "rejected";

export type SpecialistCancellationReason = "السعر مرتفع" | "غير مناسب" | "تم الحل" | "سبب آخر";

export interface SpecialistConversationClient {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  city: string;
}

export interface SpecialistConversationMessage {
  id: string;
  sender: SpecialistMessageSender;
  senderName: string;
  body: string;
  sentAt: string;
}

export interface SpecialistConversationQuote {
  price: number;
  durationDays: number;
  status: SpecialistQuoteStatus;
  proposedAt: string;
  respondedAt?: string;
}

export interface SpecialistConversationCancellation {
  reason: SpecialistCancellationReason;
  details?: string;
  cancelledAt: string;
  cancelledBy: "client" | "specialist";
}

export interface SpecialistConversation {
  id: string;
  reference: string;
  specialistId: string;
  specialistName: string;
  status: SpecialistConversationStatus;
  urgency: SpecialistConversationUrgency;
  issueTitle: string;
  issueDetails: string;
  createdAt: string;
  updatedAt: string;
  verificationNote: string;
  client: SpecialistConversationClient;
  messages: SpecialistConversationMessage[];
  quote?: SpecialistConversationQuote;
  cancellation?: SpecialistConversationCancellation;
  closedAt?: string;
}

export interface SpecialistRating {
  id: string;
  specialistId: string;
  specialistName: string;
  clientName: string;
  reference: string;
  serviceArea: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface ExpertRequestSubmission {
  id: string;
  reference: string;
  name: string;
  email: string;
  issueType: string;
  platform: string;
  urgency: string;
  description: string;
  attachmentsName?: string;
  consent: boolean;
  submittedAt: string;
}

export interface SubscriptionOrder {
  id: string;
  reference: string;
  planId: string;
  planName: string;
  planPrice: string;
  fullName: string;
  email: string;
  submittedAt: string;
}

export interface SalesLead {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  notes: string;
  submittedAt: string;
  quoteSummary: BusinessQuoteSummary;
}
