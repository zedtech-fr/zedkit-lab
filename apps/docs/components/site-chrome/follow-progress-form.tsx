"use client";

import { useId } from "react";
import { Button, Input, Label, Stack, Text } from "@zedtech/zedkit-ui";

import { OffPathLink } from "@/components/site-chrome/off-path-link";
import { welcomePopupCopy } from "@/components/site-chrome/i18n/welcome-popup-copy";
import {
  useFollowProgressForm,
  type FollowProgressStatus,
} from "@/components/site-chrome/follow-progress-form-state";
import { readNewsletterEndpoint } from "@/lib/follow-progress";
import { SITE_GITHUB_URL, SITE_STORY_URL } from "@/lib/site-links.mjs";

function FollowProgressFallback() {
  const copy = welcomePopupCopy.fallback;
  return (
    <Stack gap="tight" data-follow-progress="fallback">
      <Text variant="muted" className="text-dense">
        {copy.line}
      </Text>
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

/** Firstname + email capture. Shared by the welcome popup and the home follow section. */
export function FollowProgressForm() {
  const endpoint = readNewsletterEndpoint(process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT);
  if (endpoint === null) return <FollowProgressFallback />;
  return <FollowProgressFields endpoint={endpoint} />;
}

function FollowProgressFields({ endpoint }: { endpoint: string }) {
  const form = useFollowProgressForm(endpoint);
  return (
    <Stack gap="sm" data-follow-progress="form">
      <Text variant="muted" className="text-dense">
        {form.copy.consent}
      </Text>
      <form onSubmit={form.onSubmit} noValidate>
        <Stack gap="sm">
          <FirstnameField
            value={form.firstname}
            invalid={form.fieldError === "firstname"}
            errorMessage={form.copy.invalidFirstname}
            disabled={form.status === "submitting"}
            label={form.copy.firstnameLabel}
            placeholder={form.copy.firstnamePlaceholder}
            onChange={form.onFirstnameChange}
          />
          <EmailField
            value={form.email}
            invalid={form.fieldError === "email"}
            errorMessage={form.copy.invalidEmail}
            disabled={form.status === "submitting"}
            label={form.copy.emailLabel}
            placeholder={form.copy.emailPlaceholder}
            onChange={form.onEmailChange}
          />
          <Button type="submit" disabled={form.status === "submitting"}>
            {form.status === "submitting" ? form.copy.pending : form.copy.submit}
          </Button>
        </Stack>
      </form>
      <FollowProgressOutcome
        status={form.status}
        error={form.error}
        success={form.copy.success}
        retry={form.copy.retry}
        onRetry={form.clearError}
      />
    </Stack>
  );
}

type FieldProps = {
  value: string;
  invalid: boolean;
  errorMessage: string;
  disabled: boolean;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function FirstnameField({ value, invalid, errorMessage, disabled, label, placeholder, onChange }: FieldProps) {
  const inputId = useId();
  const errorId = useId();
  return (
    <Stack gap="tight">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        type="text"
        name="firstname"
        autoComplete="given-name"
        placeholder={placeholder}
        value={value}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {invalid ? (
        <Text id={errorId} role="alert" className="text-dense text-destructive-foreground">
          {errorMessage}
        </Text>
      ) : null}
    </Stack>
  );
}

function EmailField({ value, invalid, errorMessage, disabled, label, placeholder, onChange }: FieldProps) {
  const inputId = useId();
  const errorId = useId();
  return (
    <Stack gap="tight">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder={placeholder}
        value={value}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {invalid ? (
        <Text id={errorId} role="alert" className="text-dense text-destructive-foreground">
          {errorMessage}
        </Text>
      ) : null}
    </Stack>
  );
}

function FollowProgressOutcome({
  status,
  error,
  success,
  retry,
  onRetry,
}: {
  status: FollowProgressStatus;
  error: string | null;
  success: string;
  retry: string;
  onRetry: () => void;
}) {
  return (
    <Stack gap="tight">
      {status === "success" ? (
        <Text role="status" className="text-dense">
          {success}
        </Text>
      ) : null}
      {error !== null ? (
        <Stack direction="horizontal" gap="sm" className="flex-wrap items-center">
          <Text role="alert" className="text-dense text-destructive-foreground">
            {error}
          </Text>
          <Button type="button" size="sm" variant="outline" onClick={onRetry}>
            {retry}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
