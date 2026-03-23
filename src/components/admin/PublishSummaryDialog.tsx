"use client";

import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface PublishSummary {
  successCount: number;
  failedCount: number;
  publishedFiles: string[];
  uploadedMediaCount?: number;
  deletedMediaCount?: number;
}

interface PublishSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publishSummary: PublishSummary | null;
  getFileLabel: (filePath: string) => string;
}

export function PublishSummaryDialog({
  open,
  onOpenChange,
  publishSummary,
  getFileLabel,
}: PublishSummaryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[var(--admin-color-surface)]"
        style={{ borderColor: "color-mix(in srgb, var(--admin-color-success) 20%, white)" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--admin-color-success)]">
            <CheckCircle2 className="h-5 w-5" />
            Successfully Updated
          </DialogTitle>
          <DialogDescription>
            Your queued CMS changes are published. It can take a few minutes for updates to appear on the live site.
          </DialogDescription>
        </DialogHeader>
        {publishSummary && (
          <div className="rounded-md border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-muted)] p-3 text-sm space-y-1">
            <p className="font-medium text-[var(--admin-color-foreground)]">{publishSummary.successCount} file(s) updated</p>
            {typeof publishSummary.uploadedMediaCount === "number" && (
              <p className="text-[var(--admin-color-muted-foreground)]">
                {publishSummary.uploadedMediaCount} media upload(s), {publishSummary.deletedMediaCount || 0} media deletion(s)
              </p>
            )}
            {publishSummary.failedCount > 0 && (
              <p className="text-[var(--admin-color-danger)]">{publishSummary.failedCount} file(s) failed to update</p>
            )}
            {publishSummary.publishedFiles.length > 0 && (
              <p className="text-[var(--admin-color-muted-foreground)]">
                {publishSummary.publishedFiles.map((filePath) => getFileLabel(filePath)).join(", ")}
              </p>
            )}
          </div>
        )}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
