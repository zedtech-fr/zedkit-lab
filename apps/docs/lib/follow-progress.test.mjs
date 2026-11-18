import assert from "node:assert/strict";
import test from "node:test";

const {
  isFollowProgressEmail,
  readNewsletterEndpoint,
  followProgressPayload,
  readStoredEmail,
  writeStoredEmail,
  readLabNoticeMode,
  writeLabNoticeMode,
  parseFollowProgressError,
  newsletterEndpointEnvName,
  FOLLOW_PROGRESS_EMAIL_STORAGE_KEY,
  LAB_NOTICE_MODE_STORAGE_KEY,
} = await import("./follow-progress.ts");

test("accepts ordinary emails and rejects empty or incomplete values", () => {
  assert.equal(isFollowProgressEmail("ada@example.com"), true);
  assert.equal(isFollowProgressEmail("  ada@example.com  "), true);
  assert.equal(isFollowProgressEmail(""), false);
  assert.equal(isFollowProgressEmail("ada@"), false);
  assert.equal(isFollowProgressEmail("not-an-email"), false);
});

test("newsletter endpoint is used only when it is an absolute http(s) URL", () => {
  assert.equal(readNewsletterEndpoint(undefined), null);
  assert.equal(readNewsletterEndpoint(""), null);
  assert.equal(readNewsletterEndpoint("   "), null);
  assert.equal(readNewsletterEndpoint("javascript:alert(1)"), null);
  assert.equal(readNewsletterEndpoint("/local"), null);
  assert.equal(readNewsletterEndpoint("https://user:pass@example.com/list"), null);
  assert.equal(readNewsletterEndpoint("https://lists.example.com/zedkit"), "https://lists.example.com/zedkit");
  assert.equal(readNewsletterEndpoint("  http://localhost:8787/signup  "), "http://localhost:8787/signup");
  assert.equal(newsletterEndpointEnvName(), "NEXT_PUBLIC_NEWSLETTER_ENDPOINT");
});

test("payload trims the email", () => {
  assert.deepEqual(followProgressPayload("  ada@example.com  "), { email: "ada@example.com" });
});

test("email storage persists and survives a broken store", () => {
  const store = new Map();
  const storage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
  assert.equal(readStoredEmail(storage), "");
  writeStoredEmail(storage, "ada@example.com");
  assert.equal(store.get(FOLLOW_PROGRESS_EMAIL_STORAGE_KEY), "ada@example.com");
  assert.equal(readStoredEmail(storage), "ada@example.com");
  assert.equal(readStoredEmail(null), "");
  const broken = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(readStoredEmail(broken), "");
  writeStoredEmail(broken, "ada@example.com");
});

test("lab notice mode defaults to full and can compact", () => {
  const store = new Map();
  const storage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
  assert.equal(readLabNoticeMode(null), "full");
  assert.equal(readLabNoticeMode(storage), "full");
  writeLabNoticeMode(storage, "compact");
  assert.equal(store.get(LAB_NOTICE_MODE_STORAGE_KEY), "compact");
  assert.equal(readLabNoticeMode(storage), "compact");
});

test("error parser prefers a JSON message, then the status", () => {
  assert.equal(parseFollowProgressError(400, '{"message":"Already listed"}'), "Already listed");
  assert.equal(parseFollowProgressError(500, '{"error":"Upstream down"}'), "Upstream down");
  assert.equal(parseFollowProgressError(502, "nope"), "The list did not accept this (502).");
  assert.equal(parseFollowProgressError(0, ""), "That did not go through.");
});
