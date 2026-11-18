/** Welcome popup helpers: delay, once-per-visitor dismiss, typing-focus guard. */

import { tryCatch } from "@zedtech/zedkit-core";

/** Delay before the welcome popup opens. Change this one number to retune it. */
export const WELCOME_POPUP_DELAY_MS = 8000;

/** Retry cadence while the visitor is typing (e.g. a live console control has focus). */
export const WELCOME_POPUP_FOCUS_RETRY_MS = 2000;

export const WELCOME_POPUP_DISMISSED_STORAGE_KEY = "zk-welcome-popup-dismissed";

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
