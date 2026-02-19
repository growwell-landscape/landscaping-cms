"use client";

import { CloudUpload, Loader, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  isLoading: boolean;
  stagedFileCount: number;
  draftFileCount: number;
  activeLanguageCode: string;
  editableLanguageCodes: string[];
  onActiveLanguageChange: (languageCode: string) => void;
  getLanguageName: (languageCode: string) => string;
  onSaveAll: () => void;
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({
  isLoading,
  stagedFileCount,
  draftFileCount,
  activeLanguageCode,
  editableLanguageCodes,
  onActiveLanguageChange,
  getLanguageName,
  onSaveAll,
  onOpenMobileSidebar,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <div className="w-full flex items-start justify-between md:w-auto">
        <div>
          <h1 className="font-semibold text-lg">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage content</p>
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
          disabled={isLoading || stagedFileCount === 0}
          className="order-1 w-full rounded-[5px] bg-indigo-600 hover:bg-indigo-700 sm:order-4 sm:w-auto"
        >
          {isLoading ? <Loader className="animate-spin h-4 w-4" /> : <CloudUpload className="h-4 w-4" />}
          Global Save Changes ({stagedFileCount})
        </Button>

        <div className="order-2 flex items-center justify-between gap-2 border rounded-lg px-2 py-1 sm:order-1 sm:justify-start">
          <span className="text-xs text-slate-500">Language</span>
          <select
            value={activeLanguageCode}
            onChange={(e) => onActiveLanguageChange(e.target.value)}
            className="text-sm bg-transparent outline-none"
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
              <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                {draftFileCount} draft
              </span>
            )}
            {stagedFileCount > 0 && (
              <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                {stagedFileCount} queued
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
