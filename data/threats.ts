import { accountThreats } from "@/data/threat-libraries/account-compromise";
import { dataExposureThreats } from "@/data/threat-libraries/data-exposure";
import { emailThreats } from "@/data/threat-libraries/email-security";
import { expansionThreats } from "@/data/threat-libraries/expansion-threats";
import { malwareThreats } from "@/data/threat-libraries/malware";
import { mobileThreats } from "@/data/threat-libraries/mobile-personal-security";
import { networkThreats } from "@/data/threat-libraries/network-attacks";
import { phishingThreats } from "@/data/threat-libraries/phishing-social-engineering";
import { ransomwareThreats } from "@/data/threat-libraries/ransomware";
import { supplementalThreats } from "@/data/threat-libraries/supplemental-threats";
import { systemThreats } from "@/data/threat-libraries/system-security";
import { webThreats } from "@/data/threat-libraries/web-threats";
import { Threat } from "@/types/cyber";

export const threats: Threat[] = [
  ...networkThreats,
  ...ransomwareThreats,
  ...phishingThreats,
  ...accountThreats,
  ...malwareThreats,
  ...systemThreats,
  ...webThreats,
  ...dataExposureThreats,
  ...emailThreats,
  ...mobileThreats,
  ...supplementalThreats,
  ...expansionThreats,
];
