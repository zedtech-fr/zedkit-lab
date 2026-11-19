/** Follow-progress form helpers. No backend is wired unless an https endpoint is baked at build. */

import { tryCatch } from "@zedtech/zedkit-core";

export const FOLLOW_PROGRESS_FIRSTNAME_STORAGE_KEY = "zk-follow-progress-firstname";
export const FOLLOW_PROGRESS_EMAIL_STORAGE_KEY = "zk-follow-progress-email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIRSTNAME_MAX_LENGTH = 60;

export function isFollowProgressEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isFollowProgressFirstname(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= FIRSTNAME_MAX_LENGTH;
}

/**
 * Bake-time endpoint from `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`.
 * Only absolute http(s) URLs are used; anything else falls back to links.
 */
export function readNewsletterEndpoint(raw: string | undefined): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  const parsed = tryCatch(() => new URL(trimmed));
  if (!parsed.ok) return null;
  if (parsed.value.protocol !== "https:" && parsed.value.protocol !== "http:") return null;
  if (parsed.value.username || parsed.value.password) return null;
  return parsed.value.toString();
}

export function newsletterEndpointEnvName(): string {
  return "NEXT_PUBLIC_NEWSLETTER_ENDPOINT";
}

export function followProgressPayload(firstname: string, email: string): { firstname: string; email: string } {
  return { firstname: firstname.trim(), email: email.trim() };
}

export function readStoredFirstname(storage: Pick<Storage, "getItem"> | null): string {
  if (storage === null) return "";
  const result = tryCatch(() => storage.getItem(FOLLOW_PROGRESS_FIRSTNAME_STORAGE_KEY));
  if (!result.ok || result.value === null) return "";
  return result.value;
}

export function writeStoredFirstname(storage: Pick<Storage, "setItem"> | null, firstname: string): void {
  if (storage === null) return;
  tryCatch(() => {
    storage.setItem(FOLLOW_PROGRESS_FIRSTNAME_STORAGE_KEY, firstname);
  });
}

export function readStoredEmail(storage: Pick<Storage, "getItem"> | null): string {
  if (storage === null) return "";
  const result = tryCatch(() => storage.getItem(FOLLOW_PROGRESS_EMAIL_STORAGE_KEY));
  if (!result.ok || result.value === null) return "";
  return result.value;
}

export function writeStoredEmail(storage: Pick<Storage, "setItem"> | null, email: string): void {
  if (storage === null) return;
  tryCatch(() => {
    storage.setItem(FOLLOW_PROGRESS_EMAIL_STORAGE_KEY, email);
  });
}

export function parseFollowProgressError(status: number, bodyText: string): string {
  const parsed = tryCatch(() => JSON.parse(bodyText) as { error?: unknown; message?: unknown });
  if (parsed.ok) {
    const message = parsed.value.message ?? parsed.value.error;
    if (typeof message === "string" && message.trim().length > 0) return message.trim();
  }
  if (status >= 400) return `The list did not accept this (${status}).`;
  return "That did not go through.";
}
