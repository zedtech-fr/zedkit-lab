import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { welcomePopupCopy } from "../components/site-chrome/i18n/welcome-popup-copy.js";
import { gotoStaticRoute } from "./goto-static-route.js";

const OUT = fileURLToPath(new URL("../../../muse-out/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;

type Box = { x: number; y: number; width: number; height: number };

async function boxOf(page: Page, selector: string): Promise<Box> {
  const box = await page.locator(selector).first().boundingBox();
  expect(box, `${selector} has a box`).not.toBeNull();
  return box as Box;
}

/** Strict area intersection; touching edges are not an overlap. */
function overlaps(a: Box, b: Box, tolerance = 1): boolean {
  return (
    a.x + tolerance < b.x + b.width - tolerance &&
    b.x + tolerance < a.x + a.width - tolerance &&
    a.y + tolerance < b.y + b.height - tolerance &&
    b.y + tolerance < a.y + a.height - tolerance
  );
}

function insideViewport(box: Box, width: number, height: number, tolerance = 1): boolean {
  return (
    box.x >= -tolerance &&
    box.y >= -tolerance &&
    box.x + box.width <= width + tolerance &&
    box.y + box.height <= height + tolerance
  );
}

async function openPopup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.removeItem("zk-welcome-popup-state");
    window.localStorage.removeItem("zk-welcome-popup-dismissed");
  });
  await gotoStaticRoute(page, "/");
  await expect(page.locator("[data-welcome-popup]")).toBeVisible({ timeout: 30_000 });
  // Let the open animation settle so screenshots and boxes are stable.
  await page.waitForTimeout(600);
}

for (const { width, height } of VIEWPORTS) {
  test(`welcome popup is finished at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openPopup(page);

    const dialog = page.locator("[data-welcome-popup]");
    const panel = page.locator('[data-welcome-popup] [data-home-six-sentences-card="featured"]');
    const badge = page.locator('[data-welcome-popup] [data-slot="badge"]').first();
    const email = page.locator('[data-welcome-popup] input[name="email"]');
    const submit = page.locator('[data-welcome-popup] [data-slot="dialog-footer"] button[type="submit"]');
    const minimize = page.getByRole("button", { name: welcomePopupCopy.minimize });

    const dialogBox = await boxOf(page, "[data-welcome-popup]");
    const panelBox = await boxOf(page, '[data-welcome-popup] [data-home-six-sentences-card="featured"]');
    const badgeBox = await boxOf(page, '[data-welcome-popup] [data-slot="badge"]');
    const emailBox = await boxOf(page, '[data-welcome-popup] input[name="email"]');
    const submitBox = await boxOf(
      page,
      '[data-welcome-popup] [data-slot="dialog-footer"] button[type="submit"]',
    );
    const rawMinimizeBox = await minimize.boundingBox();
    expect(rawMinimizeBox, "keep browsing has a box").not.toBeNull();
    const minimizeBox = rawMinimizeBox as Box;

    // The dialog fits the visual viewport.
    expect(insideViewport(dialogBox, width, height), "dialog fits the viewport").toBe(true);

    // Fields and footer actions never overlap each other.
    expect(overlaps(emailBox, submitBox), "email / submit overlap").toBe(false);
    expect(overlaps(emailBox, minimizeBox), "email / keep-browsing overlap").toBe(false);
    expect(overlaps(submitBox, minimizeBox), "submit / keep-browsing overlap").toBe(false);

    // First paint shows the whole footer; nothing is clipped mid-button.
    expect(insideViewport(submitBox, width, height), "submit fully visible").toBe(true);
    expect(insideViewport(minimizeBox, width, height), "keep browsing fully visible").toBe(true);

    // The Lab badge is a compact pill, not a full-width bar.
    expect(badgeBox.width, "badge is compact").toBeLessThan(panelBox.width * 0.5);
    expect(badgeBox.width, "badge is pill-sized").toBeLessThan(180);
    expect(
      panelBox.x + panelBox.width - (badgeBox.x + badgeBox.width),
      "badge clears the panel edge",
    ).toBeGreaterThan(32);

    // No white rim: the dialog frame is transparent and borderless.
    const frame = await dialog.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        borderWidth: style.borderTopWidth,
        borderColor: style.borderColor,
        background: style.backgroundColor,
      };
    });
    expect(frame.borderWidth).toBe("0px");
    expect(frame.background).toBe("rgba(0, 0, 0, 0)");
    const panelFill = await panel.evaluate((node) => getComputedStyle(node).backgroundColor);
    const channels = panelFill.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
    expect(channels.length).toBe(3);
    const lightness = channels.reduce((sum, channel) => sum + channel, 0) / (3 * 255);
    expect(lightness, `featured panel stays deep primary (${panelFill})`).toBeLessThan(0.6);

    // Same type family as the home quote, one step down for a dialog.
    const titleType = await page
      .locator('[data-welcome-popup] [data-slot="dialog-title"]')
      .evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          size: style.fontSize,
          weight: style.fontWeight,
          height: style.lineHeight,
          style: style.fontStyle,
        };
      });
    expect(titleType, "popup title sits on the band step").toEqual({
      size: "18px",
      weight: "600",
      height: "23.4px",
      style: "italic",
    });

    const tag = `${width}x${height}`;
    await expect(badge).toContainText(welcomePopupCopy.badge);
    await expect(submit).toContainText(welcomePopupCopy.form.submit);
    await expect(email).toBeVisible();
    await page.screenshot({ path: `${OUT}welcome-popup-${tag}.png` });

    // Corner crops: a pale frame would show here.
    const margin = 96;
    const corners = {
      "top-left": { x: dialogBox.x, y: dialogBox.y, width: margin, height: margin },
      "top-right": {
        x: dialogBox.x + dialogBox.width - margin,
        y: dialogBox.y,
        width: margin,
        height: margin,
      },
      "bottom-left": {
        x: dialogBox.x,
        y: dialogBox.y + dialogBox.height - margin,
        width: margin,
        height: margin,
      },
      "bottom-right": {
        x: dialogBox.x + dialogBox.width - margin,
        y: dialogBox.y + dialogBox.height - margin,
        width: margin,
        height: margin,
      },
    } as const;
    for (const [name, clip] of Object.entries(corners)) {
      await page.screenshot({ path: `${OUT}welcome-popup-${tag}-corner-${name}.png`, clip });
    }

    // Minimize to the pill, then capture the home Consistency card for comparison.
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-welcome-popup]")).toBeHidden();
    await expect(page.locator("[data-welcome-pill]")).toBeVisible();
    await page.screenshot({ path: `${OUT}welcome-pill-${tag}.png` });
    const card = page.locator("#six-sentences li.lg\\:span-rest").last();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const cardQuoteType = await card
      .locator('[data-home-six-sentences-quote] [data-slot="heading"]')
      .evaluate((node) => {
        const style = getComputedStyle(node);
        return { size: style.fontSize, weight: style.fontWeight };
      });
    expect(cardQuoteType, "card quote stays on the shell section step").toEqual({
      size: "30px",
      weight: "500",
    });
    await card.screenshot({ path: `${OUT}home-consistency-card-${tag}.png` });
  });
}

test("welcome popup form states read finished on the glass", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPopup(page);

  // Client validation only: a bad email never leaves the browser.
  await page.locator('[data-welcome-popup] input[name="firstname"]').fill("Ada");
  await page.locator('[data-welcome-popup] input[name="email"]').fill("not-an-email");
  await page
    .locator('[data-welcome-popup] [data-slot="dialog-footer"] button[type="submit"]')
    .click();
  const fieldError = page.locator('[data-welcome-popup] [role="alert"]').first();
  await expect(fieldError).toContainText(welcomePopupCopy.form.invalidEmail);
  // Destructive ink on the frost, not foreground-tinted (near-white) type.
  const errorInk = await fieldError.evaluate((node) => getComputedStyle(node).color);
  const errorChannels = errorInk.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
  expect(errorChannels.length).toBe(3);
  const errorLightness = errorChannels.reduce((sum, channel) => sum + channel, 0) / (3 * 255);
  expect(errorLightness, `field error stays dark on the frost (${errorInk})`).toBeLessThan(0.7);
  await page.screenshot({ path: `${OUT}welcome-form-invalid-390x844.png` });

  // A valid submit lands on a finished terminal state. External calls stay
  // blocked so this never touches the network when an endpoint is baked in.
  await page.route(
    (url) => url.hostname !== "127.0.0.1" && url.hostname !== "localhost",
    async (route) => route.abort(),
  );
  await page.locator('[data-welcome-popup] input[name="email"]').fill("ada@example.com");
  await page
    .locator('[data-welcome-popup] [data-slot="dialog-footer"] button[type="submit"]')
    .click();
  const terminal = page.locator(
    '[data-welcome-popup] [data-follow-progress="success"], [data-welcome-popup] [data-follow-progress="unwired"], [data-welcome-popup] [role="alert"]',
  );
  await expect(terminal.first()).toBeVisible();
  await page.screenshot({ path: `${OUT}welcome-form-after-submit-390x844.png` });
});
