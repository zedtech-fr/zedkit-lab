"use client";

import { useId } from "react";
import { Button, Input, Label, Stack, Text } from "@zedtech/zedkit-ui";

import { OffPathLink } from "@/components/site-chrome/off-path-link";
import { labNoticeCopy } from "@/components/site-chrome/i18n/lab-notice-copy";
import { useFollowProgressForm } from "@/components/site-chrome/follow-progress-form-state";
import { readNewsletterEndpoint } from "@/lib/follow-progress";
import { SITE_GITHUB_URL, SITE_STORY_URL } from "@/lib/site-links.mjs";

export type FollowProgressFormProps = {
  /** Compact layout for the site-wide banner. */
  compact?: boolean;
};

function FollowProgressFallback({ compact }: { compact: boolean }) {
  const copy = labNoticeCopy.follow;
  return (
    <Stack gap="tight" data-follow-progress="fallback">
      {compact ? null : (
        <Text variant="muted" className="text-dense">
          {copy.fallback}
        </Text>
      )}
      <Stack direction="horizontal" gap="sm" className="flex-wrap">
        <OffPathLink href={SITE_STORY_URL} className="text-dense link-offset hover:underline">
          {copy.medium}
        </OffPathLink>
        <OffPathLink href={SITE_GITHUB_URL} className="text-dense link-offset hover:underline">
          {copy.github}
        </OffPathLink>
      </Stack>
    </Stack>
  );
}

export function FollowProgressForm({ compact = false }: FollowProgressFormProps) {
  const endpoint = readNewsletterEndpoint(process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT);
  if (endpoint === null) return <FollowProgressFallback compact={compact} />;
  return <FollowProgressFields compact={compact} endpoint={endpoint} />;
}

function FollowProgressFields({ compact, endpoint }: { compact: boolean; endpoint: string }) {
  const emailId = useId();
  const errorId = useId();
  const form = useFollowProgressForm(endpoint);
  const invalid = form.status === "error";
  return (
    <Stack gap="sm" data-follow-progress="form">
      {compact ? (
        <Text typeRole="label">{form.copy.compactTitle}</Text>
      ) : (
        <Text variant="muted" className="text-dense">
          {form.copy.consent}
        </Text>
      )}
      <form onSubmit={form.onSubmit} noValidate>
        <Stack
          direction={compact ? "horizontal" : "vertical"}
          gap="sm"
          className={compact ? "flex-wrap items-end" : undefined}
        >
          <Stack gap="tight" className="content-shrink flex-1">
            <Label htmlFor={emailId}>{form.copy.emailLabel}</Label>
            <Input
              id={emailId}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder={form.copy.emailPlaceholder}
              value={form.email}
              aria-invalid={invalid}
              aria-describedby={invalid ? errorId : undefined}
              disabled={form.status === "submitting"}
              onChange={(event) => form.onEmailChange(event.target.value)}
            />
          </Stack>
          <Button type="submit" size="sm" disabled={form.status === "submitting"}>
            {form.status === "submitting" ? form.copy.pending : form.copy.submit}
          </Button>
        </Stack>
      </form>
      {form.status === "success" ? (
        <Text role="status" className="text-dense">
          {form.copy.success}
        </Text>
      ) : null}
      {form.error !== null ? (
        <Stack direction="horizontal" gap="sm" className="flex-wrap items-center">
          <Text id={errorId} role="alert" className="text-dense text-destructive-foreground">
            {form.error}
          </Text>
          <Button type="button" size="sm" variant="outline" onClick={form.clearError}>
            {form.copy.retry}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
