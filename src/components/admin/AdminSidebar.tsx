"use client";

import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminFileNavList } from "@/components/admin/AdminFileNavigation";

interface AdminSidebarProps {
  selectFileInput: string;
  selectedFile: string | null;
  dirtyFiles: Record<string, boolean>;
  stagedFiles: Record<string, boolean>;
  onSelectFile: (filePath: string) => void;
  onLogout: () => void;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

export function AdminSidebar({
  selectFileInput,
  selectedFile,
  dirtyFiles,
  stagedFiles,
  onSelectFile,
  onLogout,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}: AdminSidebarProps) {
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r border-[var(--admin-color-border)] bg-[var(--admin-color-surface)] flex-col z-30">
        <div className="admin-heading p-4 border-b border-[var(--admin-color-border)] text-base font-semibold">CMS Admin</div>

        <div className="flex-1 p-4 space-y-2 overflow-auto no-scrollbar">
          <AdminFileNavList
            selectFileInput={selectFileInput}
            selectedFile={selectedFile}
            dirtyFiles={dirtyFiles}
            stagedFiles={stagedFiles}
            onSelectFile={onSelectFile}
          />
        </div>

        <div className="p-4 border-t border-[var(--admin-color-border)]">
          <button
            onClick={onLogout}
            className="admin-button-danger w-full flex items-center gap-2 rounded-lg px-3 py-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/30"
            onClick={onCloseMobileSidebar}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] border-r border-[var(--admin-color-border)] bg-[var(--admin-color-surface)] flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--admin-color-border)] p-4">
              <span className="admin-heading text-base font-semibold">CMS Admin</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCloseMobileSidebar}
                className="h-8 w-8"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 p-4 space-y-2 overflow-auto no-scrollbar">
              <AdminFileNavList
                selectFileInput={selectFileInput}
                selectedFile={selectedFile}
                dirtyFiles={dirtyFiles}
                stagedFiles={stagedFiles}
                onSelectFile={onSelectFile}
              />
            </div>

            <div className="p-4 border-t border-[var(--admin-color-border)]">
              <button
                onClick={onLogout}
                className="admin-button-danger w-full flex items-center gap-2 rounded-lg px-3 py-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
