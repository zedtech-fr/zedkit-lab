"use client";

import { useEffect, useState, type FormEvent } from "react";
import { tryCatchAsync } from "@zedtech/zedkit-core";

import { labNoticeCopy } from "@/components/site-chrome/i18n/lab-notice-copy";
import {
  followProgressPayload,
  isFollowProgressEmail,
  parseFollowProgressError,
  readStoredEmail,
  writeStoredEmail,
} from "@/lib/follow-progress";

export type FollowProgressStatus = "idle" | "submitting" | "success" | "error";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function useFollowProgressForm(endpoint: string) {
  const copy = labNoticeCopy.follow;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FollowProgressStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(readStoredEmail(storage()));
  }, []);

  function onEmailChange(value: string) {
    setEmail(value);
    writeStoredEmail(storage(), value);
    if (status === "error") {
      setStatus("idle");
      setError(null);
    }
  }

  function clearError() {
    setStatus("idle");
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    writeStoredEmail(storage(), trimmed);
    if (!isFollowProgressEmail(trimmed)) {
      setStatus("error");
      setError(copy.invalid);
      return;
    }
    setStatus("submitting");
    setError(null);
    const result = await tryCatchAsync(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(followProgressPayload(trimmed)),
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

  return { email, status, error, onEmailChange, onSubmit, clearError, copy };
}
