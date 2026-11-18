"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Button, Container, Stack, Text } from "@zedtech/zedkit-ui";

import { FollowProgressForm } from "@/components/site-chrome/follow-progress-form";
import { OffPathLink } from "@/components/site-chrome/off-path-link";
import { labNoticeCopy } from "@/components/site-chrome/i18n/lab-notice-copy";
import {
  LAB_NOTICE_MODE_EVENT,
  readLabNoticeMode,
  writeLabNoticeMode,
  type LabNoticeMode,
} from "@/lib/follow-progress";
import { SITE_STORY_URL } from "@/lib/site-links.mjs";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LAB_NOTICE_MODE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LAB_NOTICE_MODE_EVENT, onStoreChange);
  };
}

function readMode(): LabNoticeMode {
  return readLabNoticeMode(window.localStorage);
}

function setMode(mode: LabNoticeMode) {
  writeLabNoticeMode(window.localStorage, mode);
  window.dispatchEvent(new Event(LAB_NOTICE_MODE_EVENT));
}

/**
 * Site-wide lab notice + follow-progress capture.
 * Mounted once from the root layout so every route (home, docs, catalog,
 * issues, live console, 404) shows it. Dismissible to a compact bar; never hidden.
 */
export function LabNoticeBanner() {
  const mode = useSyncExternalStore(subscribe, readMode, () => "full");
  const compact = mode === "compact";
  const collapse = useCallback(() => setMode("compact"), []);
  const expand = useCallback(() => setMode("full"), []);

  return (
    <div
      data-lab-notice-banner=""
      data-lab-notice-mode={mode}
      role="region"
      aria-label={labNoticeCopy.regionLabel}
      className="border-b border-border muted-wash"
    >
      <Container width="wide">
        {compact ? (
          <Stack
            direction="horizontal"
            gap="sm"
            className="flex-wrap items-center surface-pad-block-sm"
          >
            <Text className="text-dense">{labNoticeCopy.compact}</Text>
            <OffPathLink href={SITE_STORY_URL} className="text-dense link-offset hover:underline">
              {labNoticeCopy.story}
            </OffPathLink>
            <Button type="button" size="sm" variant="ghost" className="ms-auto shrink-0" onClick={expand}>
              {labNoticeCopy.expand}
            </Button>
          </Stack>
        ) : (
          <Stack gap="sm" className="surface-pad-block-sm">
            <Stack
              direction="horizontal"
              gap="sm"
              className="flex-wrap items-start justify-between"
            >
              <Stack gap="tight" className="max-w-reading content-shrink">
                <Text className="font-medium">
                  {labNoticeCopy.title}
                </Text>
                <Text className="text-dense">{labNoticeCopy.body}</Text>
                <OffPathLink href={SITE_STORY_URL} className="w-fit text-dense link-offset hover:underline">
                  {labNoticeCopy.story}
                </OffPathLink>
              </Stack>
              <Button type="button" size="sm" variant="ghost" className="shrink-0" onClick={collapse}>
                {labNoticeCopy.dismiss}
              </Button>
            </Stack>
            <FollowProgressForm compact />
          </Stack>
        )}
      </Container>
    </div>
  );
}
