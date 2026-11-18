/**
 * Welcome popup helpers: delay, minimized-vs-not-yet-shown persistence,
 * typing-focus guard. `open` is transient; only the minimized mode persists,
 * so a dismissed popup returns as a pill on every later page.
 */

import { tryCatch } from "@zedtech/zedkit-core";

/** Delay before the welcome popup opens. Change this one number to retune it. */
export const WELCOME_POPUP_DELAY_MS = 8000;

/** Retry cadence while the visitor is typing (e.g. a live console control has focus). */
export const WELCOME_POPUP_FOCUS_RETRY_MS = 2000;

export const WELCOME_POPUP_DISMISSED_STORAGE_KEY = "zk-welcome-popup-dismissed";

/** Persisted popup mode. Absent storage means the visitor never saw it. */
export const WELCOME_POPUP_STATE_STORAGE_KEY = "zk-welcome-popup-state";
export const WELCOME_POPUP_STATE_MINIMIZED = "minimized";

export type WelcomePopupPersistedState = "not-yet-shown" | "minimized";

/** True when the element is a typing target: opening a modal would steal its keystrokes. */
export function isTypingTarget(
  element: { readonly tagName: string; readonly isContentEditable?: boolean } | null,
): boolean {
  if (element === null) return false;
  if (element.isContentEditable === true) return true;
  return element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT";
}

export function readWelcomePopupDismissed(storage: Pick<Storage, "getItem"> | null): boolean {
  if (storage === null) return false;
  const result = tryCatch(() => storage.getItem(WELCOME_POPUP_DISMISSED_STORAGE_KEY));
  if (!result.ok) return false;
  return result.value === "1";
}

export function writeWelcomePopupDismissed(storage: Pick<Storage, "setItem"> | null): void {
  if (storage === null) return;
  tryCatch(() => {
    storage.setItem(WELCOME_POPUP_DISMISSED_STORAGE_KEY, "1");
  });
}

/**
 * Minimized when the visitor closed the popup at least once. The legacy
 * dismissed flag counts too, so an old dismiss still returns as a pill
 * instead of replaying the full delay.
 */
export function readWelcomePopupState(
  storage: Pick<Storage, "getItem"> | null,
): WelcomePopupPersistedState {
  if (storage === null) return "not-yet-shown";
  const state = tryCatch(() => storage.getItem(WELCOME_POPUP_STATE_STORAGE_KEY));
  if (state.ok && state.value === WELCOME_POPUP_STATE_MINIMIZED) return "minimized";
  if (readWelcomePopupDismissed(storage)) return "minimized";
  return "not-yet-shown";
}

export function writeWelcomePopupMinimized(storage: Pick<Storage, "setItem"> | null): void {
  if (storage === null) return;
  tryCatch(() => {
    storage.setItem(WELCOME_POPUP_STATE_STORAGE_KEY, WELCOME_POPUP_STATE_MINIMIZED);
  });
}
