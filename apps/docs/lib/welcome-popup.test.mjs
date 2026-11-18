import assert from "node:assert/strict";
import test from "node:test";

const {
  WELCOME_POPUP_DELAY_MS,
  WELCOME_POPUP_FOCUS_RETRY_MS,
  WELCOME_POPUP_DISMISSED_STORAGE_KEY,
  isTypingTarget,
  readWelcomePopupDismissed,
  writeWelcomePopupDismissed,
} = await import("./welcome-popup.ts");

function memoryStorage() {
  const store = new Map();
  return {
    store,
    storage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => {
        store.set(key, value);
      },
    },
  };
}

test("popup opens after a delay of about 8 seconds", () => {
  assert.equal(typeof WELCOME_POPUP_DELAY_MS, "number");
  assert.ok(WELCOME_POPUP_DELAY_MS >= 5000, `delay ${WELCOME_POPUP_DELAY_MS}ms opens too fast`);
  assert.ok(WELCOME_POPUP_DELAY_MS <= 12000, `delay ${WELCOME_POPUP_DELAY_MS}ms keeps visitors waiting`);
  assert.equal(typeof WELCOME_POPUP_FOCUS_RETRY_MS, "number");
  assert.ok(WELCOME_POPUP_FOCUS_RETRY_MS > 0);
  assert.ok(WELCOME_POPUP_FOCUS_RETRY_MS < WELCOME_POPUP_DELAY_MS);
});

test("dismiss persists once per visitor and survives a broken store", () => {
  const { store, storage } = memoryStorage();
  assert.equal(readWelcomePopupDismissed(null), false);
  assert.equal(readWelcomePopupDismissed(storage), false);
  writeWelcomePopupDismissed(storage);
  assert.equal(store.get(WELCOME_POPUP_DISMISSED_STORAGE_KEY), "1");
  assert.equal(readWelcomePopupDismissed(storage), true);
  const broken = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(readWelcomePopupDismissed(broken), false);
  writeWelcomePopupDismissed(broken);
});

test("typing targets hold the open so a console control keeps its keystrokes", () => {
  assert.equal(isTypingTarget(null), false);
  assert.equal(isTypingTarget({ tagName: "BODY", isContentEditable: false }), false);
  assert.equal(isTypingTarget({ tagName: "BUTTON", isContentEditable: false }), false);
  assert.equal(isTypingTarget({ tagName: "INPUT", isContentEditable: false }), true);
  assert.equal(isTypingTarget({ tagName: "TEXTAREA", isContentEditable: false }), true);
  assert.equal(isTypingTarget({ tagName: "SELECT", isContentEditable: false }), true);
  assert.equal(isTypingTarget({ tagName: "DIV", isContentEditable: true }), true);
});
