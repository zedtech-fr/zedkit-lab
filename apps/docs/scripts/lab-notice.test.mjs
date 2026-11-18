import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
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

test("root layout mounts the lab notice banner once, ahead of Provider, so every route gets it", () => {
  const layout = read("app/layout.tsx");
  const provider = read("app/provider.tsx");
  const banner = read("components/site-chrome/lab-notice-banner.tsx");
  const form = read("components/site-chrome/follow-progress-form.tsx");
  const formState = read("components/site-chrome/follow-progress-form-state.ts");
  assert.match(layout, /import \{ LabNoticeBanner \} from "@\/components\/site-chrome\/lab-notice-banner"/);
  assert.match(layout, /<SkipLink \/>\s*<LabNoticeBanner \/>\s*<Provider>\{children\}<\/Provider>/);
  assert.doesNotMatch(provider, /LabNoticeBanner/);
  assert.match(banner, /data-lab-notice-banner=/);
  assert.match(banner, /data-lab-notice-mode=\{mode\}/);
  assert.match(banner, /readLabNoticeMode/);
  assert.match(banner, /Show a shorter notice|labNoticeCopy\.dismiss/);
  assert.match(banner, /Show the full notice|labNoticeCopy\.expand/);
  assert.match(banner, /FollowProgressForm/);
  assert.match(banner, /SITE_STORY_URL/);
  assert.doesNotMatch(banner, /display:\s*none|hidden unless|return null/);
  assert.match(form, /NEXT_PUBLIC_NEWSLETTER_ENDPOINT|NEWSLETTER_ENDPOINT_ENV/);
  assert.match(form, /data-follow-progress="fallback"/);
  assert.match(form, /data-follow-progress="form"/);
  assert.match(formState, /writeStoredEmail/);
  assert.match(form, /copy\.retry/);
});

test("nested layouts do not remount the banner; every route file still sits under the root layout", () => {
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
    if (src.includes("LabNoticeBanner")) remounts.push(rel);
  }
  assert.deepEqual(remounts, []);
  // Live console and foundations hide the marketing nav ("none") but still
  // render inside the root layout, so the banner stays visible there.
  const nav = read("lib/site-nav-data.ts");
  assert.match(nav, /isLiveConsolePath\(pathname\) \|\| isFoundationsPath\(pathname\)\) return "none"/);
  const run = read("app/(run-console)/layout.tsx");
  assert.doesNotMatch(run, /LabNoticeBanner/);
  assert.match(run, /main id="main-content"/);
});

test("story and github URLs point at the article and zedkit-lab", () => {
  const links = read("lib/site-links.mjs");
  assert.match(
    links,
    /export const SITE_GITHUB_URL = "https:\/\/github.com\/zedtech-fr\/zedkit-lab"/,
  );
  assert.match(links, /export const SITE_STORY_URL =/);
  assert.match(links, /medium.com\/@romain-zt\/zedkit-jai-donn/);
  assert.match(links, /NEWSLETTER_ENDPOINT_ENV = "NEXT_PUBLIC_NEWSLETTER_ENDPOINT"/);
  const hrefs = read("features/reviews/model/github-hrefs.ts");
  assert.match(hrefs, /export const GITHUB_REPO = "zedtech-fr\/zedkit-lab"/);
});
