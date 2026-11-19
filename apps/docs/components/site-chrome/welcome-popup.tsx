"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  Heading,
  Stack,
  Text,
  WidgetButton,
} from "@zedtech/zedkit-ui";

import { FeaturedHomeReply, FeaturedHomeSurface } from "@/components/site-chrome/featured-home-surface";
import { FollowProgressForm } from "@/components/site-chrome/follow-progress-form";
import { welcomePopupCopy } from "@/components/site-chrome/i18n/welcome-popup-copy";
import { OffPathLink } from "@/components/site-chrome/off-path-link";
import { SITE_STORY_URL } from "@/lib/site-links.mjs";
import {
  isTypingTarget,
  readWelcomePopupState,
  writeWelcomePopupMinimized,
  WELCOME_POPUP_DELAY_MS,
  WELCOME_POPUP_FOCUS_RETRY_MS,
} from "@/lib/welcome-popup";

/**
 * Métier:           Public TypeScript kit: npm packages plus a docs site, not a hosted app with accounts.
 * Client personas:  The docs maintainer, turning a lab into a repo visitors can depend on; needs first-time
 *                   visitors to grasp the lab rule in one glance and leave a firstname + email for one email.
 * Customers:        Developers reading the docs on a laptop or a phone.
 * Customer personas: Hurried scanner (skims, dismisses, reopens through a pill) and interested reader (leaves
 *                   a name on the first visit); both burned by hype and drip campaigns; both often on phones.
 * UI decisions:     Reuse the home Quality/Consistency featured card chrome (FeaturedHomeSurface +
 *                   FeaturedHomeReply, same data attributes and tokens): deep primary panel, italic
 *                   title, a Lab pill, white notice and story link, and the capture form inside the
 *                   light glass reply. Dialog chrome stays transparent so it cannot paint a white rim.
 *                   Primary submit and ghost minimize sit on the inner card. The reopen pill uses the
 *                   same primary ink. Minimized WidgetButton sits just above the identity dock.
 *
 * Delayed welcome popup: lab notice + follow-progress capture. Mounted once
 * from the root layout so it can appear on any landing route (home, docs,
 * catalog, issues, live console, 404). First visit opens after a delay, and
 * while the visitor is typing (a live console control holds focus) the open
 * waits instead of stealing keystrokes. Closing (X, Esc, or the minimize
 * control) collapses the popup into a persistent pill on every later page;
 * only the minimized mode persists, `open` stays transient.
 */
function useWelcomePopupMode() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (readWelcomePopupState(window.localStorage) === "minimized") {
      setMinimized(true);
      return;
    }
    let retry = 0;
    const tryOpen = () => {
      if (readWelcomePopupState(window.localStorage) === "minimized") return;
      if (isTypingTarget(document.activeElement)) {
        retry = window.setTimeout(tryOpen, WELCOME_POPUP_FOCUS_RETRY_MS);
        return;
      }
      setOpen(true);
    };
    const timer = window.setTimeout(tryOpen, WELCOME_POPUP_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(retry);
    };
  }, []);

  const minimize = useCallback(() => {
    writeWelcomePopupMinimized(window.localStorage);
    setMinimized(true);
    setOpen(false);
  }, []);

  const onOpenChange = useCallback(
    (next: boolean) => {
      if (next) setOpen(true);
      else minimize();
    },
    [minimize],
  );

  return { minimize, minimized, onOpenChange, open, setOpen };
}

function WelcomePill({ onReopen }: { onReopen: () => void }) {
  return (
    <Stack
      gap="sm"
      data-welcome-pill-host=""
      className="pointer-events-none fixed right-control-inline bottom-control-inline items-end sm:right-float sm:bottom-float"
    >
      <WidgetButton
        type="button"
        aria-label={welcomePopupCopy.pill.reopen}
        aria-haspopup="dialog"
        onClick={onReopen}
        data-welcome-pill=""
        className="pointer-events-auto"
      >
        <Badge>{welcomePopupCopy.badge}</Badge>
        <Text typeRole="label" className="truncate">
          {welcomePopupCopy.pill.label}
        </Text>
      </WidgetButton>
      {/* Reserves the dock trigger's own height; the host shares the dock's bottom padding rule, so this pill sits one token gap above the dock. */}
      <Text as="span" aria-hidden="true" className="block h-control-height" />
    </Stack>
  );
}

/**
 * Badge, title, notice, and story link. Same featured-card stack as the home
 * Quality/Consistency cards, one type step down for a dialog; the end padding
 * reserves the kit close control's own lane so the X cannot sit on the badge.
 */
function WelcomePopupIntro() {
  return (
    <Stack gap="sm" className="pr-dialog-header-end">
      <Stack direction="horizontal" gap="sm">
        <Badge>{welcomePopupCopy.badge}</Badge>
      </Stack>
      <blockquote data-home-six-sentences-quote="">
        <DialogTitle asChild>
          <Heading as="div" typeRole="heading" className="text-balance">
            {welcomePopupCopy.headline}
          </Heading>
        </DialogTitle>
      </blockquote>
      <DialogDescription asChild>
        <Text typeRole="body">{welcomePopupCopy.notice}</Text>
      </DialogDescription>
      <OffPathLink
        href={SITE_STORY_URL}
        data-welcome-story=""
        className="w-fit link-offset hover:underline"
      >
        {welcomePopupCopy.story}
      </OffPathLink>
    </Stack>
  );
}

export function WelcomePopup() {
  const { minimize, minimized, onOpenChange, open, setOpen } = useWelcomePopupMode();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="overflow-hidden rounded-xl border-0 bg-transparent shadow-none sm:max-w-reading"
          closeLabel={welcomePopupCopy.close}
          data-welcome-popup=""
        >
          <div data-welcome-stage="" data-home-six-sentences="">
            <FeaturedHomeSurface className="h-auto">
              <Stack gap="lg">
                <WelcomePopupIntro />
                <FeaturedHomeReply>
                  <Stack gap="sm" data-welcome-capture="">
                    <Stack gap="tight">
                      <Text typeRole="label">{welcomePopupCopy.capture.title}</Text>
                      <Text typeRole="body">{welcomePopupCopy.capture.description}</Text>
                    </Stack>
                    <FollowProgressForm
                      renderActions={(submit) => (
                        <DialogFooter>
                          <Button type="button" variant="ghost" onClick={minimize}>
                            {welcomePopupCopy.minimize}
                          </Button>
                          {submit}
                        </DialogFooter>
                      )}
                    />
                  </Stack>
                </FeaturedHomeReply>
              </Stack>
            </FeaturedHomeSurface>
          </div>
        </DialogContent>
      </Dialog>
      {minimized && !open ? <WelcomePill onReopen={() => setOpen(true)} /> : null}
    </>
  );
}
