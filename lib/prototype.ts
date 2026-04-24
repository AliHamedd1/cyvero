export const ADMIN_USERNAME = "Admin";
export const ADMIN_PASSWORD = "Admil123";
export const ADMIN_SESSION_KEY = "cyvero-admin-session";

export function createPrototypeReference(prefix: string) {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");

  return `${prefix}-${year}-${randomPart}`;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join(" ");
}
