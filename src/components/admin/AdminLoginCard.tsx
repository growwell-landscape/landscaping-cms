"use client";

import { Eye, EyeOff, Lock } from "lucide-react";

interface AdminLoginCardProps {
  password: string;
  showPassword: boolean;
  errorMessage?: string;
  onPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onAuthenticate: () => void;
}

export function AdminLoginCard({
  password,
  showPassword,
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
            onChange={(e) => onPasswordChange(e.target.value)}
            className={`admin-input w-full rounded-lg px-4 py-3 ${
              errorMessage ? "border-[var(--admin-color-danger)]" : ""
            }`}
            placeholder="Password"
          />
          <button
            onClick={onToggleShowPassword}
            className="absolute right-3 top-3 text-[var(--admin-color-muted-foreground)]"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {errorMessage && (
          <p className="text-sm text-[var(--admin-color-danger)]">{errorMessage}</p>
        )}

        <button
          onClick={onAuthenticate}
          className="admin-button-primary w-full rounded-lg py-3"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
