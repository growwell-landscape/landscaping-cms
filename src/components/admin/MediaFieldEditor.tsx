"use client";

import { AlertCircle, CheckCircle2, RefreshCw, Upload, X } from "lucide-react";

import { stringifyValue } from "@/lib/cms-utils";
import { resolveMediaUrl } from "@/lib/media-url";
import type { MediaUploadFieldState } from "@/types/cms";
import { createUploadInputId, isVideoPath, toLabel } from "@/components/admin/itemEditorUtils";

interface MediaFieldEditorProps {
  allowProjectGalleryVideo: boolean;
  disabled?: boolean;
  fieldName: string;
  fieldPath: (string | number)[];
  getMediaUploadState?: (fieldPath: (string | number)[]) => MediaUploadFieldState | null;
  onFieldChange: (fieldPath: (string | number)[], value: unknown) => void;
  onImageRemove: (fieldPath: (string | number)[], currentValue?: string) => void;
  onImageUpload: (fieldPath: (string | number)[], file: File, currentValue?: string) => void;
  uploadScopeId: string;
  value: unknown;
}

export function MediaFieldEditor({
  allowProjectGalleryVideo,
  disabled,
  fieldName,
  fieldPath,
  getMediaUploadState,
  onFieldChange,
  onImageRemove,
  onImageUpload,
  uploadScopeId,
  value,
}: Readonly<MediaFieldEditorProps>): JSX.Element {
  const currentValue = stringifyValue(value).trim();
  const resolvedPreviewUrl = resolveMediaUrl(currentValue);
  const hasMedia = currentValue.length > 0;
  const isVideoMedia = isVideoPath(currentValue);
  const rootPathSegment = fieldPath[0];
  const supportsVideoUpload =
    allowProjectGalleryVideo &&
    typeof rootPathSegment === "string" &&
    rootPathSegment === "images";
  const uploadInputId = createUploadInputId(fieldPath, uploadScopeId);
  const canPreview =
    currentValue.startsWith("/") ||
    currentValue.startsWith("http://") ||
    currentValue.startsWith("https://");
  const acceptedFileTypes = supportsVideoUpload
    ? "image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg,video/quicktime"
    : "image/jpeg,image/png,image/webp";
  const mediaUploadState = getMediaUploadState?.(fieldPath) || null;
  const uploadProgress = Math.round(
    Math.max(0, Math.min(100, mediaUploadState?.progress ?? 0))
  );
  const isUploading = mediaUploadState?.status === "processing";
  const uploadStatusLabel =
    mediaUploadState?.status === "queued"
      ? "Queued"
      : mediaUploadState?.status === "error"
        ? "Failed"
        : mediaUploadState?.status === "processing"
          ? "Uploading"
          : "";
  const uploadStatusColor =
    mediaUploadState?.status === "queued"
      ? "#16a34a"
      : mediaUploadState?.status === "error"
        ? "#dc2626"
        : "#2563eb";
  const uploadStatusStyle =
    mediaUploadState?.status === "queued"
      ? {
          borderColor: "color-mix(in srgb, var(--admin-color-success) 20%, white)",
          backgroundColor:
            "color-mix(in srgb, var(--admin-color-success) 10%, white)",
          color: "var(--admin-color-success)",
        }
      : mediaUploadState?.status === "error"
        ? {
            borderColor: "color-mix(in srgb, var(--admin-color-danger) 20%, white)",
            backgroundColor:
              "color-mix(in srgb, var(--admin-color-danger) 10%, white)",
            color: "var(--admin-color-danger)",
          }
        : {
            borderColor: "color-mix(in srgb, var(--admin-color-info) 20%, white)",
            backgroundColor:
              "color-mix(in srgb, var(--admin-color-info) 10%, white)",
            color: "var(--admin-color-info)",
          };

  return (
    <div className="space-y-3">
      {hasMedia ? (
        <div className="rounded-md border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-muted)] p-2">
          {canPreview ? (
            isVideoMedia ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                className="h-32 w-full rounded object-cover bg-black"
                controls
                src={resolvedPreviewUrl}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedPreviewUrl}
                alt={toLabel(fieldName)}
                className="h-32 w-full rounded object-cover"
              />
            )
          ) : (
            <p className="break-all text-xs text-[var(--admin-color-muted-foreground)]">{currentValue}</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-[var(--admin-color-muted-foreground)]">No media selected.</p>
      )}

      <input
        className="admin-input w-full rounded-lg px-3 py-2 disabled:opacity-50"
        disabled={disabled}
        onChange={(event) => onFieldChange(fieldPath, event.target.value)}
        placeholder="/uploads/path/file.jpg"
        type="text"
        value={stringifyValue(value)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-xs font-medium ${
            disabled || isUploading ? "bg-[var(--admin-color-border)] text-[var(--admin-color-muted-foreground)]" : "admin-button-primary"
          }`}
          htmlFor={uploadInputId}
        >
          {hasMedia ? (
            <RefreshCw className={`h-3.5 w-3.5 ${isUploading ? "animate-spin" : ""}`} />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {isUploading ? "Uploading..." : hasMedia ? "Re-upload" : "Upload"}
        </label>
        <input
          accept={acceptedFileTypes}
          className="hidden"
          disabled={disabled || isUploading}
          id={uploadInputId}
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];

            if (selectedFile) {
              onImageUpload(fieldPath, selectedFile, currentValue || undefined);
            }

            event.target.value = "";
          }}
          type="file"
        />

        {hasMedia && (
          <button
            className="admin-button-danger inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium disabled:opacity-50"
            disabled={disabled || isUploading}
            onClick={() => onImageRemove(fieldPath, currentValue)}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
            Remove
          </button>
        )}
      </div>
      {mediaUploadState && (
        <div
          className="flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs"
          style={uploadStatusStyle}
        >
          <div
            aria-hidden
            className="relative h-8 w-8 rounded-full"
            style={{
              background: `conic-gradient(${uploadStatusColor} ${uploadProgress * 3.6}deg, #cbd5e1 0deg)`,
            }}
          >
            <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-[var(--admin-color-surface)] text-[10px] font-semibold text-[var(--admin-color-foreground)]">
              {uploadProgress}%
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 font-medium">
              {mediaUploadState.status === "queued" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : mediaUploadState.status === "error" ? (
                <AlertCircle className="h-3.5 w-3.5" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>{uploadStatusLabel}</span>
            </div>
            {mediaUploadState.message && <p className="truncate">{mediaUploadState.message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
