"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemEditorComponent } from "@/components/admin/ItemEditorComponent";
import type { DataItem, DynamicField, MediaUploadFieldState } from "@/types/cms";

const ADMIN_CONFIG_LANGUAGE_EDITABLE_ROOT_PATHS = [
  "hero",
  "about",
  "aboutPage",
  "contact",
  "team",
  "testimonials",
];
const ADMIN_CONFIG_LANGUAGE_EDITABLE_FIELD_PATH_PREFIXES = [
  "hero",
  "about",
  "aboutPage",
  "contact",
  "team",
  "testimonials",
  "site.companyName",
  "site.tagline",
  "site.description",
  "seo.title",
  "seo.searchTitle",
  "seo.description",
];

interface SiteConfigSection {
  key: string;
  label: string;
}

interface AdminItemEditorListProps {
  selectedFile: string | null;
  items: DataItem[];
  fields: DynamicField[];
  password: string;
  isLoading: boolean;
  canAddTopLevelItems: boolean;
  isSiteConfigFile: boolean;
  siteConfigItem: DataItem | null;
  siteConfigLocalId: string | null;
  siteConfigSections: SiteConfigSection[];
  siteConfigHiddenFieldPaths: string[];
  isAutoIdFile: boolean;
  activeLanguageCode: string;
  defaultLanguageCode: string;
  allLanguageCodes: string[];
  isLanguageEditableFile: boolean;
  allowProjectGalleryVideo: boolean;
  onAddItem: () => void;
  onUpdateItemField: (
    localItemId: string,
    fieldPath: (string | number)[],
    value: unknown
  ) => void;
  getMediaUploadState: (
    localItemId: string,
    fieldPath: (string | number)[]
  ) => MediaUploadFieldState | null;
  onImageUpload: (
    localItemId: string,
    fieldPath: (string | number)[],
    file: File,
    currentValue?: string
  ) => void;
  onImageRemove: (
    localItemId: string,
    fieldPath: (string | number)[],
    currentValue?: string
  ) => void;
  onDeleteItem: (localItemId: string) => void;
}

function resolveLocalItemId(item: DataItem): string {
  if (typeof item.__localId === "string" && item.__localId) return item.__localId;
  return String(item.id);
}

export function AdminItemEditorList({
  selectedFile,
  items,
  fields,
  password,
  isLoading,
  canAddTopLevelItems,
  isSiteConfigFile,
  siteConfigItem,
  siteConfigLocalId,
  siteConfigSections,
  siteConfigHiddenFieldPaths,
  isAutoIdFile,
  activeLanguageCode,
  defaultLanguageCode,
  allLanguageCodes,
  isLanguageEditableFile,
  allowProjectGalleryVideo,
  onAddItem,
  onUpdateItemField,
  getMediaUploadState,
  onImageUpload,
  onImageRemove,
  onDeleteItem,
}: AdminItemEditorListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--admin-color-border)] bg-[var(--admin-color-surface-muted)] p-8 text-center">
        <p className="mb-4 text-sm text-[var(--admin-color-muted-foreground)]">No records found for this file yet.</p>
        {canAddTopLevelItems && (
          <Button onClick={onAddItem} disabled={isLoading} className="admin-button-primary">
            <Plus className="h-4 w-4" />
            Create First Item
          </Button>
        )}
      </div>
    );
  }

  if (isSiteConfigFile && siteConfigItem && siteConfigLocalId) {
    return (
      <>
        {siteConfigSections.map((section) => (
          <div key={`${siteConfigLocalId}-${section.key}`} className="rounded-md border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-muted)] p-3">
            <ItemEditorComponent
              currentFilePath={selectedFile}
              item={siteConfigItem}
              fields={fields}
              password={password}
              disabled={isLoading}
              autoIdFromContent={false}
              activeLanguageCode={activeLanguageCode}
              defaultLanguageCode={defaultLanguageCode}
              availableLanguageCodes={allLanguageCodes}
              enableLanguageEditing={isLanguageEditableFile}
              allowProjectGalleryVideo={allowProjectGalleryVideo}
              languageEditableRootPaths={ADMIN_CONFIG_LANGUAGE_EDITABLE_ROOT_PATHS}
              languageEditablePathPrefixes={ADMIN_CONFIG_LANGUAGE_EDITABLE_FIELD_PATH_PREFIXES}
              hiddenFieldPaths={siteConfigHiddenFieldPaths}
              filterFieldNames={[section.key]}
              titleOverride={section.label}
              hideDeleteAction
              defaultExpanded={false}
              onFieldChange={(fieldPath, value) =>
                onUpdateItemField(siteConfigLocalId, fieldPath, value)
              }
              getMediaUploadState={(fieldPath) =>
                getMediaUploadState(siteConfigLocalId, fieldPath)
              }
              onImageUpload={(fieldPath, file, currentValue) =>
                onImageUpload(siteConfigLocalId, fieldPath, file, currentValue)
              }
              onImageRemove={(fieldPath, currentValue) =>
                onImageRemove(siteConfigLocalId, fieldPath, currentValue)
              }
              onDelete={() => {}}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((item) => {
        const localItemId = resolveLocalItemId(item);

        return (
          <div key={localItemId} className="rounded-md border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-muted)] p-3">
            <ItemEditorComponent
              currentFilePath={selectedFile}
              item={item}
              fields={fields}
              password={password}
              disabled={isLoading}
              autoIdFromContent={isAutoIdFile}
              activeLanguageCode={activeLanguageCode}
              defaultLanguageCode={defaultLanguageCode}
              availableLanguageCodes={allLanguageCodes}
              enableLanguageEditing={isLanguageEditableFile}
              allowProjectGalleryVideo={allowProjectGalleryVideo}
              onFieldChange={(fieldPath, value) => onUpdateItemField(localItemId, fieldPath, value)}
              getMediaUploadState={(fieldPath) =>
                getMediaUploadState(localItemId, fieldPath)
              }
              onImageUpload={(fieldPath, file, currentValue) =>
                onImageUpload(localItemId, fieldPath, file, currentValue)
              }
              onImageRemove={(fieldPath, currentValue) =>
                onImageRemove(localItemId, fieldPath, currentValue)
              }
              onDelete={() => onDeleteItem(localItemId)}
            />
          </div>
        );
      })}
    </>
  );
}
