"use client";

import { Briefcase, CheckCircle2, ChevronRight, CircleDot, Globe, Image, Settings } from "lucide-react";
import { CMS_FILES, getFileMetadata } from "@/lib/cms-utils";

const ICON_MAP: Record<string, typeof Settings> = {
  Settings,
  Image,
  Briefcase,
  Globe,
};

interface FileStateProps {
  selectFileInput: string;
  selectedFile: string | null;
  dirtyFiles: Record<string, boolean>;
  stagedFiles: Record<string, boolean>;
  onSelectFile: (filePath: string) => void;
}

export function AdminFileNavList({
  selectFileInput,
  selectedFile,
  dirtyFiles,
  stagedFiles,
  onSelectFile,
}: FileStateProps) {
  return (
    <>
      {Object.values(CMS_FILES).map((filePath) => {
        const metadata = getFileMetadata(filePath);
        if (!metadata) return null;

        const Icon = ICON_MAP[metadata.icon as keyof typeof ICON_MAP];

        return (
          <button
            key={filePath}
            onClick={() => onSelectFile(filePath)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
              selectFileInput === filePath || selectedFile === filePath
                ? "bg-[var(--admin-color-accent)] text-[var(--admin-color-primary)]"
                : "text-[var(--admin-color-foreground)] hover:bg-[var(--admin-color-surface-muted)]"
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{metadata.label}</span>
            {dirtyFiles[filePath] && !stagedFiles[filePath] && (
              <span className="ml-auto inline-block h-2.5 w-2.5 rounded-full bg-[var(--admin-color-warning)]" />
            )}
            {dirtyFiles[filePath] && stagedFiles[filePath] && (
              <CheckCircle2 className="ml-auto h-4 w-4 text-[var(--admin-color-success)]" />
            )}
          </button>
        );
      })}
    </>
  );
}

interface AdminFileCardProps {
  filePath: string;
  selected: boolean;
  hasDraftChanges?: boolean;
  isQueued?: boolean;
  onClick: () => void;
}

export function AdminFileCard({
  filePath,
  selected,
  hasDraftChanges,
  isQueued,
  onClick,
}: AdminFileCardProps) {
  const metadata = getFileMetadata(filePath);
  if (!metadata) return null;

  const IconComponent = ICON_MAP[metadata.icon as keyof typeof ICON_MAP];

  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-xl border transition-all ${
        selected
          ? "border-[var(--admin-color-primary)] bg-[var(--admin-color-accent)] shadow-lg"
          : "border-[var(--admin-color-border)] bg-[var(--admin-color-surface)] hover:shadow-lg"
      }`}
    >
      <div className="flex justify-between mb-3">
        <div
          className={`rounded-lg p-2 ${selected ? "" : "bg-[var(--admin-color-surface-muted)]"}`}
          style={
            selected
              ? { backgroundColor: "color-mix(in srgb, var(--admin-color-primary) 10%, white)" }
              : undefined
          }
        >
          <IconComponent className={`h-6 w-6 ${selected ? "text-[var(--admin-color-primary)]" : "text-[var(--admin-color-muted-foreground)]"}`} />
        </div>
        {selected && <ChevronRight className="h-5 w-5 text-[var(--admin-color-primary)]" />}
      </div>

      <h3 className="admin-heading font-semibold text-[var(--admin-color-foreground)]">{metadata.label}</h3>
      <p className="mt-1 text-sm text-[var(--admin-color-muted-foreground)]">{metadata.description}</p>
      {(hasDraftChanges || isQueued) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {hasDraftChanges && (
            <span className="admin-badge-warning inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium">
              <CircleDot className="h-3 w-3" />
              Draft
            </span>
          )}
          {isQueued && (
            <span className="admin-badge-success inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium">
              <CheckCircle2 className="h-3 w-3" />
              Queued
            </span>
          )}
        </div>
      )}

      <code className="mt-3 block text-xs font-mono text-[var(--admin-color-muted-foreground)]">{filePath}</code>
    </button>
  );
}
