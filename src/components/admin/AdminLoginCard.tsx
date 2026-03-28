"use client";

import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

import { ROUTES } from "@/lib/constants";

interface AdminLoginCardProps {
  password: string;
  showPassword: boolean;
  isAuthenticating?: boolean;
  errorMessage?: string;
  onPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onAuthenticate: () => void;
}

export function AdminLoginCard({
  password,
  showPassword,
  isAuthenticating = false,
  errorMessage,
  onPasswordChange,
  onToggleShowPassword,
  onAuthenticate,
}: AdminLoginCardProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundImage: "var(--admin-effect-login-gradient)" }}
    >
      <div className="admin-surface w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--admin-color-primary) 12%, white)", color: "var(--admin-color-primary)" }}>
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="admin-heading text-2xl font-bold">CMS Admin Panel</h1>
          <p className="text-sm text-[var(--admin-color-muted-foreground)]">Enter your password</p>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            disabled={isAuthenticating}
            onChange={(e) => onPasswordChange(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !isAuthenticating) {
                onAuthenticate();
              }
            }}
            className={`admin-input w-full rounded-lg px-4 py-3 ${
              errorMessage ? "border-[var(--admin-color-danger)]" : ""
            }`}
            placeholder="Password"
          />
          <button
            type="button"
            disabled={isAuthenticating}
            onClick={onToggleShowPassword}
            className="absolute right-3 top-3 text-[var(--admin-color-muted-foreground)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-[var(--admin-color-danger)]/25 bg-[color-mix(in_srgb,var(--admin-color-danger)_8%,white)] px-3 py-2 text-sm text-[var(--admin-color-danger)]"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          disabled={isAuthenticating}
          onClick={onAuthenticate}
          className="admin-button-primary flex w-full items-center justify-center gap-2 rounded-lg py-3 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm text-[var(--admin-color-muted-foreground)]">
          Need a client-friendly guide?{" "}
          <Link href={ROUTES.ADMIN_INFO} className="font-medium text-[var(--admin-color-primary)] underline-offset-4 hover:underline">
            Open admin dashboard info
          </Link>
        </p>
      </div>
    </div>
  );
}
