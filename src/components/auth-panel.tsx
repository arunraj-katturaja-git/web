"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/messages";
import { useAuth } from "@/components/auth-provider";

interface AuthPanelProps {
  readonly dictionary: Dictionary;
}

export function AuthPanel({ dictionary }: Readonly<AuthPanelProps>) {
  const { auth } = dictionary;
  const { initialized, isAuthenticated, user, requestOtp, verifyOtp, logout } = useAuth();
  const [otpLength, setOtpLength] = useState(4);
  const [isOpen, setIsOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [normalizedMobile, setNormalizedMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [busyAction, setBusyAction] = useState<"request" | "verify" | "logout" | null>(null);

  async function handleRequestOtp() {
    setBusyAction("request");
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const payload = await requestOtp(mobile);
      const resolvedOtpLength = payload.otpLength ?? payload.code?.length ?? 4;
      setNormalizedMobile(payload.mobile);
      setOtpLength(resolvedOtpLength);
      setDemoOtp(payload.code ?? null);
      setOtpCode("");
      setStep("otp");
      setStatusMessage(`${auth.demoOtp}: ${payload.code ?? "1234"}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to request OTP.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleVerifyOtp() {
    setBusyAction("verify");
    setErrorMessage(null);

    try {
      await verifyOtp(normalizedMobile || mobile, otpCode);
      setStatusMessage(auth.sessionReady);
      setOtpCode("");
      setDemoOtp(null);
      setOtpLength(4);
      setStep("mobile");
      setIsOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to verify OTP.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleLogout() {
    setBusyAction("logout");
    setErrorMessage(null);

    try {
      await logout();
      setMobile("");
      setNormalizedMobile("");
      setOtpCode("");
      setDemoOtp(null);
      setOtpLength(4);
      setStep("mobile");
      setIsOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to logout.");
    } finally {
      setBusyAction(null);
    }
  }

  function resetToMobileStep() {
    setStep("mobile");
    setOtpCode("");
    setDemoOtp(null);
    setOtpLength(4);
    setErrorMessage(null);
    setStatusMessage(null);
  }

  return (
    <div className="relative">
      <button
        className="rounded-full border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary-strong shadow-sm transition hover:border-primary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-70"
        disabled={!initialized}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {initialized
          ? isAuthenticated
            ? user?.mobile ?? auth.sessionReady
            : auth.login
          : auth.loading}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-40 mt-3 w-80 rounded-3xl border border-primary/15 bg-white p-5 shadow-2xl">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{auth.sessionReady}</p>
                <p className="mt-2 text-lg font-semibold text-ink">{user?.mobile}</p>
              </div>
              <button
                className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-75"
                disabled={busyAction === "logout"}
                onClick={() => void handleLogout()}
                type="button"
              >
                {busyAction === "logout" ? auth.loading : auth.logout}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{auth.guest}</p>
                <p className="mt-2 text-lg font-semibold text-ink">{auth.login}</p>
              </div>

              {step === "mobile" ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-ink">{auth.mobileLabel}</span>
                  <input
                    autoComplete="tel"
                    className="w-full rounded-2xl border border-primary/20 px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                    inputMode="numeric"
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder={auth.mobilePlaceholder}
                    value={mobile}
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted">{normalizedMobile || mobile}</p>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-ink">{auth.otpLabel}</span>
                    <input
                      autoComplete="one-time-code"
                      className="w-full rounded-2xl border border-primary/20 px-4 py-3 text-sm tracking-[0.4em] text-ink outline-none transition focus:border-primary"
                      inputMode="numeric"
                      maxLength={Math.max(otpLength, 6)}
                      onChange={(event) =>
                        setOtpCode(event.target.value.replace(/\D/g, "").slice(0, Math.max(otpLength, 6)))
                      }
                      placeholder={otpLength === 4 ? auth.otpPlaceholder : "1".repeat(otpLength)}
                      value={otpCode}
                    />
                  </label>
                  <button
                    className="text-sm font-medium text-primary transition hover:text-primary-strong"
                    onClick={resetToMobileStep}
                    type="button"
                  >
                    {auth.changeMobile}
                  </button>
                </div>
              )}

              {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
              {!errorMessage && statusMessage ? <p className="text-sm text-primary-strong">{statusMessage}</p> : null}
              {!errorMessage && demoOtp && step === "otp" ? (
                <p className="text-xs font-medium text-muted">
                  {auth.demoOtp}: <span className="font-semibold tracking-[0.25em] text-primary-strong">{demoOtp}</span>
                </p>
              ) : null}

              {step === "mobile" ? (
                <button
                  className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-75"
                  disabled={busyAction === "request" || mobile.trim().length === 0}
                  onClick={() => void handleRequestOtp()}
                  type="button"
                >
                  {busyAction === "request" ? auth.loading : auth.requestOtp}
                </button>
              ) : (
                <button
                  className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-75"
                  disabled={busyAction === "verify" || otpCode.length !== otpLength}
                  onClick={() => void handleVerifyOtp()}
                  type="button"
                >
                  {busyAction === "verify" ? auth.loading : auth.verifyOtp}
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
