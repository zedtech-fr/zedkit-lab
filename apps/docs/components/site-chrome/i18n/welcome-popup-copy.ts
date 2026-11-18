/** English copy for the welcome popup and follow-progress form. Keys only; no markup. */
export const welcomePopupCopy = {
  dialogLabel: "Welcome to the lab",
  headline: "Welcome to the lab. Mind the sawdust.",
  body: "Quick safety talk before you look around. The @zedtech/zedkit-* packages on npm are my workbench, not a store shelf, so don't ship them to production. The code itself is another story: copy it, paste it, steal the good bits. That's what it's here for.",
  story: "Read the story behind zedkit",
  close: "Close",
  dismiss: "Keep browsing",
  capture: {
    title: "Want the version you can build on?",
    description:
      "I'm turning this lab into a repo you can actually depend on. Leave your first name and email and I'll write the day it opens. One email. No drip campaign.",
  },
  form: {
    firstnameLabel: "First name",
    firstnamePlaceholder: "Ada",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Tell me when it's ready",
    pending: "Sending…",
    success: "You're on the list. I'll write when it opens.",
    invalidFirstname: "One word is plenty — what should I call you?",
    invalidEmail: "That address won't survive the trip. Check it?",
    error: "That didn't go through — likely my wiring, not your typing.",
    retry: "Try again",
    consent: "One email when the repo opens. Nothing else, never shared, unsubscribe anytime.",
  },
  fallback: {
    line: "I'm turning this lab into a repo you can actually depend on. No signup form is wired here yet — follow along in the meantime:",
    medium: "Follow on Medium",
    github: "Watch on GitHub",
  },
} as const;
