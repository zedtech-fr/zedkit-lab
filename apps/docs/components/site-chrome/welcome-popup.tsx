"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Stack,
  Text,
} from "@zedtech/zedkit-ui";

import { FollowProgressForm } from "@/components/site-chrome/follow-progress-form";
import { welcomePopupCopy } from "@/components/site-chrome/i18n/welcome-popup-copy";
import { OffPathLink } from "@/components/site-chrome/off-path-link";
import { readNewsletterEndpoint } from "@/lib/follow-progress";
import { SITE_STORY_URL } from "@/lib/site-links.mjs";
import {
  isTypingTarget,
  readWelcomePopupDismissed,
  writeWelcomePopupDismissed,
  WELCOME_POPUP_DELAY_MS,
  WELCOME_POPUP_FOCUS_RETRY_MS,
} from "@/lib/welcome-popup";

/**
 * Delayed welcome popup: lab notice + follow-progress capture.
 * Mounted once from the root layout so it can appear on any landing route
 * (home, docs, catalog, issues, live console, 404). Opens once per visitor;
 * while the visitor is typing (a live console control holds focus) the open
 * waits instead of stealing keystrokes. Esc, the close button, or the
 * dismiss button all count as dismissed.
 */
export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const hasCapture = readNewsletterEndpoint(process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT) !== null;

  useEffect(() => {
    if (readWelcomePopupDismissed(window.localStorage)) return;
    let retry = 0;
    const tryOpen = () => {
      if (readWelcomePopupDismissed(window.localStorage)) return;
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

  const dismiss = useCallback(() => {
    writeWelcomePopupDismissed(window.localStorage);
    setOpen(false);
  }, []);

  const onOpenChange = useCallback(
    (next: boolean) => {
      if (next) setOpen(true);
      else dismiss();
    },
    [dismiss],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-reading" closeLabel={welcomePopupCopy.close} data-welcome-popup="">
        <Stack gap="md">
          <DialogHeader>
            <DialogTitle>{welcomePopupCopy.headline}</DialogTitle>
            <DialogDescription>{welcomePopupCopy.body}</DialogDescription>
          </DialogHeader>
          <OffPathLink href={SITE_STORY_URL} className="w-fit text-dense link-offset hover:underline">
            {welcomePopupCopy.story}
          </OffPathLink>
          {hasCapture ? (
            <Stack gap="tight">
              <Text typeRole="label">{welcomePopupCopy.capture.title}</Text>
              <Text variant="muted" className="text-dense">
                {welcomePopupCopy.capture.description}
              </Text>
            </Stack>
          ) : null}
          <FollowProgressForm />
          <Stack direction="horizontal" gap="sm" className="justify-end">
            <Button type="button" size="sm" variant="ghost" onClick={dismiss}>
              {welcomePopupCopy.dismiss}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
