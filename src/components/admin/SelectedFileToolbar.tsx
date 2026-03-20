"use client";

import { Loader, Plus, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFileToolbarProps {
  title: string;
  description: string;
  itemCount: number;
  isLoading: boolean;
  canAddTopLevelItems: boolean;
  selectedFileHasDraftChanges: boolean;
  selectedFileIsQueued: boolean;
  selectedFileHasPendingChanges: boolean;
  onReload: () => void;
  onAddItem: () => void;
  onSaveCurrent: () => void;
  onResetCurrent: () => void;
}

export function SelectedFileToolbar({
  title,
  description,
  itemCount,
  isLoading,
  canAddTopLevelItems,
  selectedFileHasDraftChanges,
  selectedFileIsQueued,
  selectedFileHasPendingChanges,
  onReload,
  onAddItem,
  onSaveCurrent,
  onResetCurrent,
}: SelectedFileToolbarProps) {
  return (
    <div
      className="sticky top-0 z-10 border-b border-[var(--admin-color-border)] p-4 space-y-4 backdrop-blur"
      style={{ backgroundColor: "color-mix(in srgb, var(--admin-color-surface) 95%, transparent)" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="admin-heading text-base font-semibold">
            {title} ({itemCount})
          </h2>
          <p className="text-sm text-[var(--admin-color-muted-foreground)]">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={onReload}
            disabled={isLoading}
            className="admin-button-outline rounded-[5px]"
          >
            {isLoading ? <Loader className="animate-spin h-4 w-4" /> : <Loader className="h-4 w-4" />}
            Reload
          </Button>
          <Button
            variant="outline"
            onClick={onResetCurrent}
            disabled={isLoading || !selectedFileHasPendingChanges}
            className="admin-button-outline rounded-[5px]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Local Changes
          </Button>
          {canAddTopLevelItems && (
            <Button
              onClick={onAddItem}
              disabled={isLoading}
              className="admin-button-primary inline-flex items-center gap-2 rounded-[6px] text-center"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          )}
          {selectedFileHasDraftChanges && (
            <Button
              onClick={onSaveCurrent}
              disabled={isLoading}
              className="admin-button-primary inline-flex items-center gap-2 rounded-[6px] text-center"
            >
              {isLoading ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              Save Current Locally
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {selectedFileHasDraftChanges && (
          <span className="admin-badge-warning rounded-full px-3 py-1 font-medium">
            Draft changes pending local save
          </span>
        )}
        {selectedFileIsQueued && (
          <span className="admin-badge-success rounded-full px-3 py-1 font-medium">
            Local save complete. Ready for global update
          </span>
        )}
      </div>
    </div>
  );
}
