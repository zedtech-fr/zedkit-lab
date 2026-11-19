"use client";

import { useId, type ReactNode } from "react";
import { Button, Input, Label, Stack, StatusDot, Text } from "@zedtech/zedkit-ui";

import { OffPathLink } from "@/components/site-chrome/off-path-link";
import { welcomePopupCopy } from "@/components/site-chrome/i18n/welcome-popup-copy";
import {
  useFollowProgressForm,
  type FollowProgressStatus,
} from "@/components/site-chrome/follow-progress-form-state";
import { readNewsletterEndpoint } from "@/lib/follow-progress";
import { SITE_GITHUB_URL, SITE_STORY_URL } from "@/lib/site-links.mjs";

/**
 * Firstname + email capture, always rendered. Shared by the welcome popup and
 * the home follow section. When no endpoint is baked in, submit keeps the
 * inputs saved locally and says so honestly instead of posting anywhere.
 * `renderActions` lets the dialog place the submit in its own footer beside
 * the minimize control; otherwise the submit sits in its own row.
 */
export function FollowProgressForm({
  renderActions,
}: {
  renderActions?: (submit: ReactNode) => ReactNode;
}) {
  const endpoint = readNewsletterEndpoint(process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT);
  const form = useFollowProgressForm(endpoint);
  const formId = useId();
  const submit = (
    <Button type="submit" form={formId} disabled={form.status === "submitting"}>
      {form.status === "submitting" ? form.copy.pending : form.copy.submit}
    </Button>
  );
  return (
    <Stack gap="sm" data-follow-progress="form">
      <Text variant="muted" className="text-dense">
        {form.copy.consent}
      </Text>
      <form id={formId} onSubmit={form.onSubmit} noValidate>
        <Stack gap="sm" className="sm:grid sm:grid-pair">
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
        </Stack>
      </form>
      <FollowProgressOutcome
        status={form.status}
        error={form.error}
        success={form.copy.success}
        retry={form.copy.retry}
        onRetry={form.clearError}
      />
      {form.status === "unwired" ? <UnwiredNote /> : null}
      {renderActions ? (
        renderActions(submit)
      ) : (
        <Stack direction="horizontal" gap="sm">
          {submit}
        </Stack>
      )}
    </Stack>
  );
}

function UnwiredNote() {
  const copy = welcomePopupCopy.unwired;
  return (
    <Stack gap="tight" data-follow-progress="unwired">
      <Text role="status" className="text-dense">
        {copy.message}
      </Text>
      <Text variant="muted" className="text-dense">
        {copy.secondaryLead}
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
        <Stack direction="horizontal" gap="sm" className="items-start" data-follow-progress="success">
          <StatusDot tone="active" pulse={false} />
          <Text role="status" typeRole="label">
            {success}
          </Text>
        </Stack>
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
