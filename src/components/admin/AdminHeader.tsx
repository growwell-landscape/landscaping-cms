"use client";

import Link from "next/link";
import { CloudUpload, Loader, Menu, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

interface AdminHeaderProps {
  isLoading: boolean;
  stagedFileCount: number;
  draftFileCount: number;
  pendingFileCount: number;
  activeLanguageCode: string;
  editableLanguageCodes: string[];
  onActiveLanguageChange: (languageCode: string) => void;
  getLanguageName: (languageCode: string) => string;
  onSaveAll: () => void;
  onResetAll: () => void;
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({
  isLoading,
  stagedFileCount,
  draftFileCount,
  pendingFileCount,
  activeLanguageCode,
  editableLanguageCodes,
  onActiveLanguageChange,
  getLanguageName,
  onSaveAll,
  onResetAll,
  onOpenMobileSidebar,
}: AdminHeaderProps) {
  const globalSaveBlockedByDrafts = draftFileCount > 0;
  const canGlobalSave =
    !isLoading && stagedFileCount > 0 && !globalSaveBlockedByDrafts;

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--admin-color-border)] bg-[var(--admin-color-surface)] px-4 py-3 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <div className="w-full flex items-start justify-between md:w-auto">
        <div>
          <h1 className="admin-heading text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-[var(--admin-color-muted-foreground)]">
            Manage content.{" "}
            <Link href={ROUTES.ADMIN_INFO} className="font-medium text-[var(--admin-color-primary)] underline-offset-4 hover:underline">
              Client dashboard guide
            </Link>
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 md:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full flex flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Button
          onClick={onSaveAll}
          disabled={!canGlobalSave}
          className="admin-button-primary order-1 w-full rounded-[5px] sm:order-4 sm:w-auto"
        >
          {isLoading ? <Loader className="animate-spin h-4 w-4" /> : <CloudUpload className="h-4 w-4" />}
          Global Save Changes ({stagedFileCount})
        </Button>
        <Button
          onClick={onResetAll}
          disabled={isLoading || pendingFileCount === 0}
          variant="outline"
          className="order-1 w-full rounded-[5px] sm:order-3 sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All Changes
        </Button>

        <div className="order-2 flex items-center justify-between gap-2 rounded-lg border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-elevated)] px-2 py-1 sm:order-1 sm:justify-start">
          <span className="text-xs text-[var(--admin-color-muted-foreground)]">Language</span>
          <select
            value={activeLanguageCode}
            onChange={(e) => onActiveLanguageChange(e.target.value)}
            className="text-sm bg-transparent text-[var(--admin-color-foreground)] outline-none"
          >
            {editableLanguageCodes.map((languageCode) => (
              <option key={languageCode} value={languageCode}>
                {getLanguageName(languageCode)}
              </option>
            ))}
          </select>
        </div>

        {(draftFileCount > 0 || stagedFileCount > 0) && (
          <div className="order-3 flex items-center gap-2 sm:order-2">
            {draftFileCount > 0 && (
              <span className="admin-badge-warning text-xs px-2 py-1 rounded">
                {draftFileCount} draft
              </span>
            )}
            {stagedFileCount > 0 && (
              <span className="admin-badge-success text-xs px-2 py-1 rounded">
                {stagedFileCount} queued
              </span>
            )}
            {globalSaveBlockedByDrafts && stagedFileCount > 0 && (
              <span className="admin-badge-danger text-xs px-2 py-1 rounded">
                Save or reset drafts before global save
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
