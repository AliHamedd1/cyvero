import { specialists } from "@/data/specialists";
import { SpecialistAccount } from "@/types/cyber";

const specialistCredentials = [
  { specialistId: "salem-network", username: "salem.network", password: "Cyvero123" },
  { specialistId: "reem-malware", username: "reem.malware", password: "Cyvero123" },
  { specialistId: "talal-accounts", username: "talal.accounts", password: "Cyvero123" },
  { specialistId: "huda-email", username: "huda.email", password: "Cyvero123" },
  { specialistId: "nasser-ir", username: "nasser.ir", password: "Cyvero123" },
  { specialistId: "lina-systems", username: "lina.systems", password: "Cyvero123" },
  { specialistId: "mazen-endpoint", username: "mazen.endpoint", password: "Cyvero123" },
  { specialistId: "sara-web", username: "sara.web", password: "Cyvero123" },
  { specialistId: "mohra-general", username: "mohra.general", password: "Cyvero123" },
  { specialistId: "adel-triage", username: "adel.triage", password: "Cyvero123" },
  { specialistId: "yousef-cloud", username: "yousef.cloud", password: "Cyvero123" },
];

export const specialistAccounts: SpecialistAccount[] = specialistCredentials.map((account) => ({
  ...account,
  specialistName: specialists.find((specialist) => specialist.id === account.specialistId)?.name ?? account.username,
}));
