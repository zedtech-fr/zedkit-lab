"use client";

import { useEffect, useState, type FormEvent } from "react";
import { tryCatchAsync } from "@zedtech/zedkit-core";

import { welcomePopupCopy } from "@/components/site-chrome/i18n/welcome-popup-copy";
import {
  followProgressPayload,
  isFollowProgressEmail,
  isFollowProgressFirstname,
  parseFollowProgressError,
  readStoredEmail,
  readStoredFirstname,
  writeStoredEmail,
  writeStoredFirstname,
} from "@/lib/follow-progress";

export type FollowProgressStatus = "idle" | "submitting" | "success" | "error" | "unwired";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

/**
 * Capture state for one form instance. A null endpoint means the list is not
 * wired on this build: submit validates and persists, then reports `unwired`
 * honestly instead of posting anywhere or faking success.
 */
export function useFollowProgressForm(endpoint: string | null) {
  const copy = welcomePopupCopy.form;
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FollowProgressStatus>("idle");
  const [fieldError, setFieldError] = useState<"firstname" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFirstname(readStoredFirstname(storage()));
    setEmail(readStoredEmail(storage()));
  }, []);

  function onFirstnameChange(value: string) {
    setFirstname(value);
    writeStoredFirstname(storage(), value);
    if (fieldError === "firstname") setFieldError(null);
  }

  function onEmailChange(value: string) {
    setEmail(value);
    writeStoredEmail(storage(), value);
    if (fieldError === "email") setFieldError(null);
  }

  function clearError() {
    setStatus("idle");
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedFirstname = firstname.trim();
    const trimmedEmail = email.trim();
    writeStoredFirstname(storage(), trimmedFirstname);
    writeStoredEmail(storage(), trimmedEmail);
    if (!isFollowProgressFirstname(trimmedFirstname)) {
      setFieldError("firstname");
      return;
    }
    if (!isFollowProgressEmail(trimmedEmail)) {
      setFieldError("email");
      return;
    }
    setFieldError(null);
    if (endpoint === null) {
      setStatus("unwired");
      setError(null);
      return;
    }
    setStatus("submitting");
    setError(null);
    const result = await tryCatchAsync(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(followProgressPayload(trimmedFirstname, trimmedEmail)),
      });
      const bodyText = await response.text();
      if (!response.ok) {
        throw new Error(parseFollowProgressError(response.status, bodyText));
      }
    });
    if (!result.ok) {
      setStatus("error");
      setError(result.error.message.trim() || copy.error);
      return;
    }
    setStatus("success");
    setError(null);
  }

  return {
    firstname,
    email,
    status,
    fieldError,
    error,
    onFirstnameChange,
    onEmailChange,
    onSubmit,
    clearError,
    copy,
  };
}
