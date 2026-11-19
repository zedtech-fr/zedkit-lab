/** English copy for the welcome popup and follow-progress form. Keys only; no markup. */
export const welcomePopupCopy = {
  headline: "Welcome to the lab. Mind the sawdust.",
  notice:
    "Don't ship the @zedtech/zedkit-* npm packages to production. Copy, paste, or steal the useful bits — that's what the code is for.",
  story: "Read the story behind zedkit (in French)",
  close: "Close",
  minimize: "Keep browsing",
  pill: {
    label: "Hear when it opens",
    reopen: "Reopen the welcome message",
  },
  capture: {
    title: "Want the version you can build on?",
    description: "Leave your first name and email. I'll write the day this repo opens.",
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
    consent: "One email. Never shared.",
  },
  unwired: {
    message:
      "The list isn't wired on this build, so nothing was sent. Your name and email stay saved in this browser.",
    secondaryLead: "Follow along in the meantime:",
    medium: "Follow on Medium",
    github: "Watch on GitHub",
  },
} as const;
