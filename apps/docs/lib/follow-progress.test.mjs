import assert from "node:assert/strict";
import test from "node:test";

const {
  isFollowProgressEmail,
  isFollowProgressFirstname,
  readNewsletterEndpoint,
  followProgressPayload,
  readStoredEmail,
  writeStoredEmail,
  readStoredFirstname,
  writeStoredFirstname,
  parseFollowProgressError,
  newsletterEndpointEnvName,
  FOLLOW_PROGRESS_EMAIL_STORAGE_KEY,
  FOLLOW_PROGRESS_FIRSTNAME_STORAGE_KEY,
} = await import("./follow-progress.ts");

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

test("accepts ordinary emails and rejects empty or incomplete values", () => {
  assert.equal(isFollowProgressEmail("ada@example.com"), true);
  assert.equal(isFollowProgressEmail("  ada@example.com  "), true);
  assert.equal(isFollowProgressEmail(""), false);
  assert.equal(isFollowProgressEmail("ada@"), false);
  assert.equal(isFollowProgressEmail("not-an-email"), false);
});

test("accepts a short firstname and rejects blank or oversized values", () => {
  assert.equal(isFollowProgressFirstname("Ada"), true);
  assert.equal(isFollowProgressFirstname("  Ada  "), true);
  assert.equal(isFollowProgressFirstname(""), false);
  assert.equal(isFollowProgressFirstname("   "), false);
  assert.equal(isFollowProgressFirstname("a".repeat(61)), false);
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

test("payload posts firstname and email, trimmed", () => {
  assert.deepEqual(followProgressPayload("  Ada  ", "  ada@example.com  "), {
    firstname: "Ada",
    email: "ada@example.com",
  });
});

test("firstname and email storage persist and survive a broken store", () => {
  const { store, storage } = memoryStorage();
  assert.equal(readStoredFirstname(storage), "");
  assert.equal(readStoredEmail(storage), "");
  writeStoredFirstname(storage, "Ada");
  writeStoredEmail(storage, "ada@example.com");
  assert.equal(store.get(FOLLOW_PROGRESS_FIRSTNAME_STORAGE_KEY), "Ada");
  assert.equal(store.get(FOLLOW_PROGRESS_EMAIL_STORAGE_KEY), "ada@example.com");
  assert.equal(readStoredFirstname(storage), "Ada");
  assert.equal(readStoredEmail(storage), "ada@example.com");
  assert.equal(readStoredFirstname(null), "");
  assert.equal(readStoredEmail(null), "");
  const broken = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(readStoredFirstname(broken), "");
  assert.equal(readStoredEmail(broken), "");
  writeStoredFirstname(broken, "Ada");
  writeStoredEmail(broken, "ada@example.com");
});

test("error parser prefers a JSON message, then the status", () => {
  assert.equal(parseFollowProgressError(400, '{"message":"Already listed"}'), "Already listed");
  assert.equal(parseFollowProgressError(500, '{"error":"Upstream down"}'), "Upstream down");
  assert.equal(parseFollowProgressError(502, "nope"), "The list did not accept this (502).");
  assert.equal(parseFollowProgressError(0, ""), "That did not go through.");
});
