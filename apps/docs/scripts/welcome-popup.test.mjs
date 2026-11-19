import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(app, rel), "utf8");
}

function walkLayouts(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".next" || name === "out") continue;
      walkLayouts(path, out);
    } else if (name === "layout.tsx" || name === "not-found.tsx") {
      out.push(relative(app, path).split("\\").join("/"));
    }
  }
  return out;
}

test("root layout mounts the welcome popup once, ahead of Provider, so every route gets it", () => {
  const layout = read("app/layout.tsx");
  const provider = read("app/provider.tsx");
  const popup = read("components/site-chrome/welcome-popup.tsx");
  const form = read("components/site-chrome/follow-progress-form.tsx");
  const formState = read("components/site-chrome/follow-progress-form-state.ts");
  const copy = read("components/site-chrome/i18n/welcome-popup-copy.ts");
  assert.match(layout, /import \{ WelcomePopup \} from "@\/components\/site-chrome\/welcome-popup"/);
  assert.match(layout, /<SkipLink \/>\s*<WelcomePopup \/>\s*<Provider>\{children\}<\/Provider>/);
  assert.doesNotMatch(provider, /WelcomePopup/);
  assert.match(popup, /data-welcome-popup=/);
  assert.match(popup, /data-welcome-stage=/);
  assert.match(popup, /data-welcome-capture=/);
  assert.match(popup, /typeRole="title"/);
  assert.match(popup, /border-0/);
  assert.match(popup, /bg-transparent/);
  assert.match(popup, /overflow-hidden/);
  assert.match(popup, /rounded-xl/);
  assert.match(popup, /FeaturedHomeSurface/);
  assert.match(popup, /FeaturedHomeReply/);
  assert.match(popup, /data-home-six-sentences=/);
  assert.match(popup, /text-balance/);
  assert.match(popup, /data-welcome-story=/);
  assert.match(popup, /variant="ghost"/);
  assert.match(popup, /welcomePopupCopy\.badge/);
  const featured = read("components/site-chrome/featured-home-surface.tsx");
  assert.match(featured, /data-home-six-sentences-card="featured"/);
  assert.match(featured, /variant="glass"/);
  assert.match(featured, /padding="card"/);
  assert.match(featured, /padding="md"/);
  assert.match(featured, /radius="xl"/);
  assert.match(popup, /WELCOME_POPUP_DELAY_MS/);
  assert.match(popup, /readWelcomePopupState/);
  assert.match(popup, /writeWelcomePopupMinimized/);
  assert.match(popup, /isTypingTarget\(document\.activeElement\)/);
  assert.match(popup, /WELCOME_POPUP_FOCUS_RETRY_MS/);
  assert.match(popup, /DialogContent/);
  assert.match(popup, /DialogFooter/);
  assert.match(popup, /closeLabel/);
  assert.match(popup, /welcomePopupCopy\.minimize/);
  assert.match(popup, /data-welcome-capture=/);
  assert.match(popup, /FollowProgressForm/);
  assert.match(popup, /renderActions/);
  assert.match(popup, /SITE_STORY_URL/);
  assert.match(popup, /WidgetButton/);
  assert.match(popup, /data-welcome-pill=/);
  assert.match(popup, /data-welcome-pill-host=/);
  const signature = read("app/docs-signature.css");
  assert.match(signature, /\[data-welcome-pill-host\]/);
  assert.match(signature, /padding-bottom: max\(0\.75rem, env\(safe-area-inset-bottom\)\);/);
  assert.match(signature, /\[data-slot="dialog-content"\]\[data-welcome-popup\]/);
  assert.match(signature, /border: 0;/);
  assert.match(signature, /overflow: hidden;/);
  assert.match(signature, /padding: 0;/);
  assert.match(signature, /background-color: transparent;/);
  assert.match(signature, /border-radius: var\(--radius-xl\);/);
  assert.match(signature, /env\(safe-area-inset-bottom\)/);
  assert.match(signature, /\[data-welcome-story\]/);
  assert.match(signature, /\[data-welcome-pill\]/);
  assert.match(
    signature,
    /:root button\[data-welcome-pill\] \{[^}]*background-color:\s*hsl\(var\(--primary\)\)/,
  );
  assert.match(signature, /@media \(height < 45rem\)/);
  assert.match(
    signature,
    /@media \(height < 45rem\) \{[\s\S]*max-height:\s*calc\(100dvh/,
  );
  assert.match(popup, /FeaturedHomeSurface className="h-auto"/);
  assert.doesNotMatch(popup, /h-full justify-between/);
  assert.match(
    signature,
    /\[data-welcome-popup\] \[data-home-six-sentences-card="featured"\] \{[^}]*height:\s*auto/,
  );
  assert.match(
    signature,
    /\[data-welcome-popup\] \[data-slot="dialog-footer"\] \{[^}]*position:\s*static/,
  );
  assert.doesNotMatch(signature, /\[data-slot="dialog-content"\]\[data-welcome-popup\][^{]*\{[^}]*backdrop-filter: var\(--zk-glass-overlay-filter\)/);
  assert.match(popup, /minimized && !open/);
  assert.match(popup, /welcomePopupCopy\.pill\.reopen/);
  assert.match(popup, /aria-haspopup="dialog"/);
  assert.match(form, /NEXT_PUBLIC_NEWSLETTER_ENDPOINT|NEWSLETTER_ENDPOINT_ENV/);
  assert.match(form, /data-follow-progress="form"/);
  assert.match(form, /data-follow-progress="success"/);
  assert.match(form, /form.copy.success/);
  assert.match(form, /data-follow-progress="unwired"/);
  assert.doesNotMatch(form, /data-follow-progress="fallback"/);
  assert.doesNotMatch(form, /endpoint === null\) return/);
  assert.match(
    formState,
    /if \(endpoint === null\) \{\s*setStatus\("unwired"\);[\s\S]*return;\s*\}\s*setStatus\("submitting"\);/,
  );
  assert.match(form, /name="firstname"/);
  assert.match(form, /name="email"/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /renderActions\?/);
  assert.match(formState, /endpoint: string \| null/);
  assert.match(formState, /endpoint === null/);
  assert.match(formState, /"unwired"/);
  assert.match(formState, /writeStoredFirstname/);
  assert.match(formState, /writeStoredEmail/);
  assert.match(formState, /followProgressPayload\(trimmedFirstname, trimmedEmail\)/);
  assert.match(formState, /method: "POST"/);
  assert.match(form, /copy\.retry/);
  assert.match(copy, /invalidFirstname/);
  assert.match(copy, /invalidEmail/);
  assert.match(copy, /unwired/);
  assert.match(copy, /badge: "Lab"/);
  assert.match(copy, /Welcome to the lab. Mind the sawdust./);
  assert.match(copy, /Don.t ship the @zedtech\/zedkit-\* npm packages to production/);
  assert.match(copy, /nothing was sent/);
  assert.doesNotMatch(popup, /mailto:/);
  assert.doesNotMatch(form, /mailto:/);
});

test("nested layouts do not remount the popup; live console still sits under the root layout", () => {
  const layouts = walkLayouts(join(app, "app"));
  assert.ok(layouts.includes("app/layout.tsx"), layouts.join(", "));
  assert.ok(layouts.includes("app/(home)/layout.tsx"));
  assert.ok(layouts.includes("app/(site)/layout.tsx"));
  assert.ok(layouts.includes("app/(run-console)/layout.tsx"));
  assert.ok(layouts.includes("app/docs/[[...slug]]/layout.tsx"));
  assert.ok(layouts.includes("app/not-found.tsx"));
  const remounts = [];
  for (const rel of layouts) {
    if (rel === "app/layout.tsx") continue;
    const src = read(rel);
    if (src.includes("WelcomePopup")) remounts.push(rel);
  }
  assert.deepEqual(remounts, []);
  // Live console and foundations hide the marketing nav ("none") but still
  // render inside the root layout, so the popup can appear there too.
  const nav = read("lib/site-nav-data.ts");
  assert.match(nav, /isLiveConsolePath\(pathname\) \|\| isFoundationsPath\(pathname\)\) return "none"/);
  const run = read("app/(run-console)/layout.tsx");
  assert.doesNotMatch(run, /WelcomePopup/);
  assert.match(run, /main id="main-content"/);
  const popupLib = read("lib/welcome-popup.ts");
  assert.match(popupLib, /export const WELCOME_POPUP_DELAY_MS = 3000;/);
  assert.match(popupLib, /INPUT.*TEXTAREA.*SELECT/s);
  assert.match(popupLib, /WELCOME_POPUP_STATE_STORAGE_KEY/);
  assert.match(popupLib, /readWelcomePopupState/);
  assert.match(popupLib, /writeWelcomePopupMinimized/);
});

test("the lab banner is gone: no component, no compact chrome, no mode storage", () => {
  assert.equal(existsSync(join(app, "components/site-chrome/lab-notice-banner.tsx")), false);
  assert.equal(existsSync(join(app, "components/site-chrome/i18n/lab-notice-copy.ts")), false);
  const layout = read("app/layout.tsx");
  assert.doesNotMatch(layout, /LabNoticeBanner/);
  assert.doesNotMatch(layout, /data-lab-notice-banner/);
  const follow = read("lib/follow-progress.ts");
  assert.doesNotMatch(follow, /LabNoticeMode/);
  assert.doesNotMatch(follow, /lab-notice-mode/);
});

test("home keeps the fuller follow block on the shared firstname + email form", () => {
  const section = read("app/(home)/_home/sections/home-follow-section.tsx");
  const homeCopy = read("app/(home)/_home/i18n/home-follow-copy.ts");
  assert.match(section, /FollowProgressForm/);
  assert.match(section, /data-home-follow=""/);
  assert.doesNotMatch(section, /compact/);
  assert.match(homeCopy, /Take the lab home with you/);
});

test("story and github URLs point at the article and zedkit-lab", () => {
  const links = read("lib/site-links.mjs");
  assert.match(
    links,
    /export const SITE_GITHUB_URL = "https:\/\/github.com\/zedtech-fr\/zedkit-lab"/,
  );
  assert.match(links, /export const SITE_STORY_URL =/);
  assert.match(links, /medium.com\/p\/ce86bfc96636/);
  assert.match(links, /NEWSLETTER_ENDPOINT_ENV = "NEXT_PUBLIC_NEWSLETTER_ENDPOINT"/);
  const hrefs = read("features/reviews/model/github-hrefs.ts");
  assert.match(hrefs, /export const GITHUB_REPO = "zedtech-fr\/zedkit-lab"/);
});
