export const ADMIN_USERNAME = "Admin";
export const ADMIN_PASSWORD = "A12345a";
export const ADMIN_SESSION_KEY = "cyvero-admin-session";
export const SPECIALIST_SESSION_KEY = "cyvero-specialist-session";
export const CLIENT_SPECIALIST_CONVERSATIONS_KEY = "cyvero-client-specialist-conversations";
export const DEVICE_PREFERENCE_KEY = "cyvero-device-preference";

export function createPrototypeReference(prefix: string) {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");

  return `${prefix}-${year}-${randomPart}`;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(value: string) {
  return /^\+?[0-9\s-]{8,16}$/.test(value.trim());
}

export function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join(" ");
}

export function formatArabicDate(value: string | number | Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatArabicDateTime(value: string | number | Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
