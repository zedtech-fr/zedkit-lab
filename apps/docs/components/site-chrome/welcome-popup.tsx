"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Heading,
  Stack,
  StatusDot,
  Text,
  WidgetButton,
} from "@zedtech/zedkit-ui";

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
 * UI decisions:     One translucent violet glass panel — the Dialog surface itself — because a second card
 *                   or the default solid chrome (border, bg-card) reads as a white ring and a messy
 *                   white–violet–white stack. Title, notice, and the capture form share that one surface.
 *                   Inverted kit buttons keep contrast on the violet. Minimized WidgetButton pill sits
 *                   just above the identity dock, in the dock family.
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
        data-surface="glass"
        className="pointer-events-auto"
      >
        <StatusDot tone="active" pulse={false} />
        <Text typeRole="label" className="truncate">
          {welcomePopupCopy.pill.label}
        </Text>
      </WidgetButton>
      {/* Reserves the dock trigger's own height; the host shares the dock's bottom padding rule, so this pill sits one token gap above the dock. */}
      <Text as="span" aria-hidden="true" className="block h-control-height" />
    </Stack>
  );
}

export function WelcomePopup() {
  const { minimize, minimized, onOpenChange, open, setOpen } = useWelcomePopupMode();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-reading overflow-hidden border-0 bg-transparent p-0 shadow-none rounded-2xl"
          closeLabel={welcomePopupCopy.close}
          data-welcome-popup=""
        >
          <Stack gap="md" data-welcome-stage="">
            <DialogHeader>
              <DialogTitle asChild>
                <Heading level={2} typeRole="title">
                  {welcomePopupCopy.headline}
                </Heading>
              </DialogTitle>
              <DialogDescription asChild>
                <Text typeRole="body">{welcomePopupCopy.notice}</Text>
              </DialogDescription>
            </DialogHeader>
            <OffPathLink href={SITE_STORY_URL} className="w-fit link-offset hover:underline">
              {welcomePopupCopy.story}
            </OffPathLink>
            <Stack gap="sm" data-welcome-capture="">
              <Stack gap="tight">
                <Text typeRole="label">{welcomePopupCopy.capture.title}</Text>
                <Text typeRole="body">{welcomePopupCopy.capture.description}</Text>
              </Stack>
              <FollowProgressForm
                renderActions={(submit) => (
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={minimize}>
                      {welcomePopupCopy.minimize}
                    </Button>
                    {submit}
                  </DialogFooter>
                )}
              />
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      {minimized && !open ? <WelcomePill onReopen={() => setOpen(true)} /> : null}
    </>
  );
}
