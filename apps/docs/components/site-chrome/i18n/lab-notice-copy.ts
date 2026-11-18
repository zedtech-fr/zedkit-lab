/** English copy for the site-wide lab notice and follow-progress form. Keys only; no markup. */
export const labNoticeCopy = {
  regionLabel: "Lab notice",
  title: "This is a lab.",
  body: "The @zedtech/zedkit-* npm packages are an experiment — don't use them in production. Copy, paste, or steal anything useful; that's what the code is for.",
  story: "Read the story behind zedkit",
  compact: "This is a lab — not for production. Copy what you need.",
  dismiss: "Show a shorter notice",
  expand: "Show the full notice",
  follow: {
    title: "Want the rest?",
    description: "I'll open a real zedkit repo — the one you can actually build on. Leave your email if you want to hear when it's ready.",
    compactTitle: "Want the rest?",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Keep me posted",
    pending: "Sending…",
    success: "Thanks — I'll write when there's news.",
    invalid: "Enter a valid email.",
    error: "That didn't go through. Try again?",
    retry: "Try again",
    consent:
      "I'll only use this to email you about zedkit. You can unsubscribe anytime.",
    medium: "Follow on Medium",
    github: "Watch on GitHub",
    fallback: "No email list is wired yet. Follow along here in the meantime:",
  },
} as const;
