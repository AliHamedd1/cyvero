import {
  Activity,
  AlertTriangle,
  ArrowUpLeft,
  BadgeHelp,
  BookOpen,
  Bug,
  Database,
  Globe,
  KeyRound,
  Mail,
  Network,
  Radar,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  network: Network,
  "shield-alert": ShieldAlert,
  "scan-face": Search,
  "key-round": KeyRound,
  bug: Bug,
  "server-cog": Server,
  "globe-lock": Globe,
  "database-zap": Database,
  "mail-warning": Mail,
  smartphone: Smartphone,
  "network-signal": Radar,
  "service-outage": Activity,
  "file-lock": ShieldAlert,
  "phishing-link": Mail,
  "account-lock": KeyRound,
  "malware-bug": Bug,
  "system-shield": Server,
  "web-globe": Globe,
  "data-vault": Database,
  "mail-shield": Mail,
  "mobile-safe": Smartphone,
  default: ShieldCheck,
  sparkles: Sparkles,
  alert: AlertTriangle,
  activity: Activity,
  help: BadgeHelp,
  book: BookOpen,
  arrow: ArrowUpLeft,
};

export function CyberIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? iconMap.default;
  return <Icon className={className} aria-hidden="true" />;
}
