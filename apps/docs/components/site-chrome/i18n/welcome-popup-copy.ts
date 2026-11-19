/** English copy for the welcome popup and follow-progress form. Keys only; no markup. */
export const welcomePopupCopy = {
  badge: "Lab",
  headline: "Take the useful bits. Don't ship the packages.",
  notice:
    "Copy, paste, or steal whatever helps you — that's what this code is for. Don't ship the @zedtech/zedkit-* npm packages to production.",
  story: "Read the backstory (in French)",
  close: "Close",
  minimize: "Keep browsing",
  pill: {
    label: "Hear when it opens",
    reopen: "Reopen the welcome message",
  },
  capture: {
    title: "Want the version you can ship?",
    description: "Leave your first name and email. I'll write you the day that version opens.",
  },
  form: {
    firstnameLabel: "First name",
    firstnamePlaceholder: "Ada",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Tell me when it's ready",
    pending: "Sending…",
    success: "You're on the list. I'll write you when it opens.",
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
