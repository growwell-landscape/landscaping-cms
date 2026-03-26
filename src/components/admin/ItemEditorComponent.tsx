/**
 * Item Editor Component
 * Displays and edits item fields (supports nested objects and arrays)
 */

"use client";

import { useId, useState } from "react";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import type { DataItem, DynamicField, MediaUploadFieldState } from "@/types/cms";
import { stringifyValue } from "@/lib/cms-utils";
import {
  buildLocalizedFieldKey,
  isLanguageVariantKey,
  isTranslatableTextField,
} from "@/lib/language-utils";
import { MediaFieldEditor } from "@/components/admin/MediaFieldEditor";
import {
  createDefaultFromSample,
  getFieldSelectOptions,
  isImageLikeField,
  isRecord,
  shouldUseTextarea,
  toLabel,
} from "@/components/admin/itemEditorUtils";

interface SearchableSelectFieldProps {
  disabled?: boolean;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

function SearchableSelectField({
  disabled,
  options,
  placeholder = "Select a value",
  value,
  onChange,
}: Readonly<SearchableSelectFieldProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedOption = options.find((option) => option.value === value);

  const normalizedQuery = query.trim().toLowerCase();
  const matchedOptions = normalizedQuery
    ? options.filter((option) => {
        const haystack = `${option.label} ${option.value}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : options;
  const filteredOptions = selectedOption
    ? [
        selectedOption,
        ...matchedOptions.filter((option) => option.value !== selectedOption.value),
      ]
    : matchedOptions;

  return (
    <div className="relative">
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setQuery("");
            setIsOpen((current) => !current);
          }}
          className="admin-input flex w-full items-center rounded-lg px-3 py-2 pr-10 text-left disabled:opacity-50"
        >
          <span className={value ? "text-[var(--admin-color-foreground)]" : "text-[var(--admin-color-muted-foreground)]"}>
            {selectedOption?.label || value || placeholder}
          </span>
        </button>
        <button
          type="button"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (disabled) return;
            setQuery("");
            setIsOpen((current) => !current);
          }}
          className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-[var(--admin-color-muted-foreground)] disabled:opacity-50"
          aria-label="Toggle options"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute z-20 mt-2 w-full rounded-lg border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-elevated)] shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="border-b border-[var(--admin-color-border)] p-2">
            <input
              type="text"
              value={query}
              autoFocus
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
              className="admin-input w-full rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[var(--admin-color-foreground)] transition-colors hover:bg-[var(--admin-color-accent)]"
                >
                  <span>{option.label}</span>
                  {value === option.value ? <Check className="h-4 w-4 text-[var(--admin-color-primary)]" /> : null}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-[var(--admin-color-muted-foreground)]">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ItemEditorComponentProps {
  /** Current file path being edited */
  currentFilePath?: string | null;
  /** Item to edit */
  item: DataItem;
  /** Available fields */
  fields: DynamicField[];
  /** Admin password (kept for API compatibility) */
  password: string;
  /** Callback when field changes */
  onFieldChange: (fieldPath: (string | number)[], value: unknown) => void;
  /** Upload status for the provided media field path */
  getMediaUploadState?: (
    fieldPath: (string | number)[]
  ) => MediaUploadFieldState | null;
  /** Callback to upload image at given field path */
  onImageUpload: (
    fieldPath: (string | number)[],
    file: File,
    currentValue?: string
  ) => void;
  /** Callback to remove image at given field path */
  onImageRemove: (fieldPath: (string | number)[], currentValue?: string) => void;
  /** Callback to delete item */
  onDelete: () => void;
  /** If true, id is auto-generated from content fields */
  autoIdFromContent?: boolean;
  /** Whether component is disabled */
  disabled?: boolean;
  /** Allow video upload support for project gallery media arrays */
  allowProjectGalleryVideo?: boolean;
  /** Active language code used in editor */
  activeLanguageCode?: string;
  /** Default language code configured for site */
  defaultLanguageCode?: string;
  /** Configured language codes */
  availableLanguageCodes?: string[];
  /** Enable language-aware editing for this file */
  enableLanguageEditing?: boolean;
  /** Exact dot-paths to hide from rendering */
  hiddenFieldPaths?: string[];
  /** Limit rendered top-level fields to this list */
  filterFieldNames?: string[];
  /** Limit language-aware editing to these top-level roots */
  languageEditableRootPaths?: string[];
  /** Limit language-aware editing to specific dot-path prefixes */
  languageEditablePathPrefixes?: string[];
  /** Custom heading used for collapsed and expanded title */
  titleOverride?: string;
  /** Hide delete action (used for singleton config editors) */
  hideDeleteAction?: boolean;
  /** Initial expand state */
  defaultExpanded?: boolean;
}

/**
 * Item Editor Component
 */
export function ItemEditorComponent({
  currentFilePath,
  item,
  fields,
  onFieldChange,
  getMediaUploadState,
  onImageUpload,
  onImageRemove,
  onDelete,
  autoIdFromContent,
  disabled,
  allowProjectGalleryVideo = false,
  activeLanguageCode = "en",
  defaultLanguageCode = "en",
  availableLanguageCodes = ["en"],
  enableLanguageEditing = false,
  hiddenFieldPaths = [],
  filterFieldNames,
  languageEditableRootPaths,
  languageEditablePathPrefixes,
  titleOverride,
  hideDeleteAction = false,
  defaultExpanded = false,
}: Readonly<ItemEditorComponentProps>) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const uploadScopeId = useId().replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
  const languageCodes = Array.from(new Set(availableLanguageCodes));
  const isSecondaryLanguageSelected =
    enableLanguageEditing && activeLanguageCode !== defaultLanguageCode;
  const hiddenKeys = new Set<string>(["__localId"]);
  const hiddenPathSet = new Set(hiddenFieldPaths);
  const filteredFieldSet = filterFieldNames ? new Set(filterFieldNames) : null;
  const languageEditableRootSet = languageEditableRootPaths
    ? new Set(languageEditableRootPaths)
    : null;
  const languageEditablePathPrefixesList = (languageEditablePathPrefixes || [])
    .map((path) => path.trim())
    .filter(Boolean);
  if (autoIdFromContent) hiddenKeys.add("id");

  const isHiddenPath = (fieldPath: (string | number)[]) =>
    hiddenPathSet.has(fieldPath.map((segment) => String(segment)).join("."));
  const buildPathKey = (fieldPath: (string | number)[]) =>
    fieldPath
      .filter((segment): segment is string => typeof segment === "string")
      .join(".");
  const isLanguageEditablePath = (fieldPath: (string | number)[]) => {
    const pathKey = buildPathKey(fieldPath);
    if (languageEditablePathPrefixesList.length > 0) {
      return languageEditablePathPrefixesList.some(
        (prefix) => pathKey === prefix || pathKey.startsWith(`${prefix}.`)
      );
    }

    if (!languageEditableRootSet || languageEditableRootSet.size === 0) {
      return true;
    }
    const rootSegment = fieldPath[0];
    return typeof rootSegment === "string" && languageEditableRootSet.has(rootSegment);
  };

  const getLocalizedPreviewValue = (
    fieldName: string,
    value: unknown,
    fieldPath: (string | number)[]
  ): unknown => {
    if (!isSecondaryLanguageSelected) {
      return value;
    }

    if (!isLanguageEditablePath(fieldPath)) {
      return value;
    }

    if (!isTranslatableTextField(fieldName, value, languageCodes)) {
      return value;
    }

    const localizedKey = buildLocalizedFieldKey(fieldName, activeLanguageCode);
    const localizedValue = item[localizedKey];
    return typeof localizedValue === "string" ? localizedValue : value;
  };

  const localizedTitleKey = buildLocalizedFieldKey("title", activeLanguageCode);
  const localizedNameKey = buildLocalizedFieldKey("name", activeLanguageCode);
  const displayTitle =
    (isSecondaryLanguageSelected
      ? stringifyValue(item[localizedTitleKey] ?? item.title) ||
        stringifyValue(item[localizedNameKey] ?? item.name)
      : stringifyValue(item.title) || stringifyValue(item.name));
  const hasSavedIdentity =
    typeof item.id === "number" ||
    (typeof item.id === "string" && item.id.trim().length > 0);

  const previewEntries = Object.entries(item)
    .filter(([key, value]) => {
      if (filteredFieldSet && !filteredFieldSet.has(key)) return false;
      if (hiddenKeys.has(key)) return false;
      if (enableLanguageEditing && isLanguageVariantKey(key, languageCodes)) {
        return false;
      }
      return !isRecord(value) && !Array.isArray(value);
    })
    .map(([key, value]) => [key, getLocalizedPreviewValue(key, value, [key])] as const)
    .slice(0, 2);

  const handleArrayAdd = (
    fieldPath: (string | number)[],
    fieldName: string,
    currentArray: unknown[]
  ) => {
    const firstValue = currentArray[0];
    let newValue: unknown;

    if (firstValue !== undefined) {
      newValue = createDefaultFromSample(firstValue);
    } else if (fieldName.toLowerCase().includes("feature")) {
      newValue = { title: "" };
    } else {
      newValue = "";
    }

    onFieldChange(fieldPath, [newValue, ...currentArray]);
  };

  const handleArrayRemove = (
    fieldPath: (string | number)[],
    currentArray: unknown[],
    removeIndex: number
  ) => {
    onFieldChange(
      fieldPath,
      currentArray.filter((_, index) => index !== removeIndex)
    );
  };

  const renderScalarField = (
    fieldName: string,
    value: unknown,
    fieldPath: (string | number)[]
  ) => {
    if (isImageLikeField(fieldName, value, fieldPath)) {
      return (
        <MediaFieldEditor
          allowProjectGalleryVideo={allowProjectGalleryVideo}
          disabled={disabled}
          fieldName={fieldName}
          fieldPath={fieldPath}
          getMediaUploadState={getMediaUploadState}
          onFieldChange={onFieldChange}
          onImageRemove={onImageRemove}
          onImageUpload={onImageUpload}
          uploadScopeId={uploadScopeId}
          value={value}
        />
      );
    }

    if (typeof value === "boolean") {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onFieldChange(fieldPath, e.target.checked)}
          disabled={disabled}
          className="h-4 w-4"
        />
      );
    }

    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onFieldChange(fieldPath, Number(e.target.value))}
          disabled={disabled}
          className="admin-input w-full rounded-lg px-3 py-2 disabled:opacity-50"
        />
      );
    }

    if (typeof value === "string") {
      const selectOptions = getFieldSelectOptions(fieldPath, currentFilePath || undefined);
      if (selectOptions) {
        const hasCurrentValue = selectOptions.some((option) => option.value === value);
        const options = hasCurrentValue
          ? selectOptions
          : [{ value, label: value || "Current Value" }, ...selectOptions];

        return (
          <SearchableSelectField
            disabled={disabled}
            options={options}
            value={value}
            onChange={(nextValue) => onFieldChange(fieldPath, nextValue)}
          />
        );
      }
    }

    if (shouldUseTextarea(fieldName, value)) {
      return (
        <textarea
          value={stringifyValue(value)}
          onChange={(e) => onFieldChange(fieldPath, e.target.value)}
          disabled={disabled}
          rows={4}
          className="admin-input w-full resize-y rounded-lg px-3 py-2 disabled:opacity-50"
        />
      );
    }

    return (
      <input
        type="text"
        value={stringifyValue(value)}
        onChange={(e) => onFieldChange(fieldPath, e.target.value)}
        disabled={disabled}
        className="admin-input w-full rounded-lg px-3 py-2 disabled:opacity-50"
      />
    );
  };

  const renderField = (
    fieldName: string,
    value: unknown,
    fieldPath: (string | number)[],
    depth = 0,
    parentRecord?: Record<string, unknown>
  ): JSX.Element | null => {
    if (hiddenKeys.has(fieldName)) return null;
    if (isHiddenPath(fieldPath)) return null;
    if (enableLanguageEditing && isLanguageVariantKey(fieldName, languageCodes)) return null;

    let resolvedValue = value;
    let resolvedFieldPath = fieldPath;

    if (
      isSecondaryLanguageSelected &&
      parentRecord &&
      isLanguageEditablePath(fieldPath) &&
      isTranslatableTextField(fieldName, value, languageCodes)
    ) {
      const localizedKey = buildLocalizedFieldKey(fieldName, activeLanguageCode);
      resolvedFieldPath = [...fieldPath.slice(0, -1), localizedKey];
      const localizedValue = parentRecord[localizedKey];
      if (typeof localizedValue === "string") {
        resolvedValue = localizedValue;
      }
    }

    if (Array.isArray(resolvedValue)) {
      return (
        <div
          key={fieldPath.join(".")}
          className="space-y-3 rounded-lg border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-muted)] p-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="admin-heading text-sm font-semibold text-[var(--admin-color-foreground)]">{toLabel(fieldName)}</h4>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleArrayAdd(resolvedFieldPath, fieldName, resolvedValue)}
              className="admin-button-primary inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          {resolvedValue.length === 0 ? (
            <p className="text-xs text-[var(--admin-color-muted-foreground)]">No items yet.</p>
          ) : (
            resolvedValue.map((entry, index) => {
              const itemPath = [...resolvedFieldPath, index];
              return (
                <div
                  key={`${fieldPath.join(".")}-${index}`}
                  className="space-y-3 rounded-md border border-[var(--admin-color-border)] bg-[var(--admin-color-surface-elevated)] p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[var(--admin-color-muted-foreground)]">
                      {toLabel(fieldName)} #{resolvedValue.length - index}
                    </p>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleArrayRemove(resolvedFieldPath, resolvedValue, index)}
                      className="admin-button-danger inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  {isRecord(entry) ? (
                    <div className="space-y-3">
                      {Object.entries(entry).map(([childKey, childValue]) =>
                        renderField(
                          childKey,
                          childValue,
                          [...itemPath, childKey],
                          depth + 1,
                          entry
                        )
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-[var(--admin-color-muted-foreground)]">
                        Value
                      </label>
                      {renderScalarField(fieldName, entry, itemPath)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      );
    }

    if (isRecord(resolvedValue)) {
      return (
        <div
          key={fieldPath.join(".")}
          className={`space-y-3 rounded-lg border border-[var(--admin-color-border)] p-3 ${
            depth === 0 ? "bg-[var(--admin-color-surface-muted)]" : "bg-[var(--admin-color-surface-elevated)]"
          }`}
        >
          <h4 className="admin-heading text-sm font-semibold text-[var(--admin-color-foreground)]">{toLabel(fieldName)}</h4>
          <div className="space-y-3">
            {Object.entries(resolvedValue).map(([childKey, childValue]) =>
              renderField(
                childKey,
                childValue,
                [...resolvedFieldPath, childKey],
                depth + 1,
                resolvedValue
              )
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={fieldPath.join(".")} className="space-y-2">
        <label className="block text-sm font-medium text-[var(--admin-color-muted-foreground)]">{toLabel(fieldName)}</label>
        {renderScalarField(fieldName, resolvedValue, resolvedFieldPath)}
      </div>
    );
  };

  const collapsedTitle = titleOverride || (hasSavedIdentity ? displayTitle || String(item.id) : "");
  const expandedTitle = titleOverride || (hasSavedIdentity ? displayTitle || String(item.id) : "Editing draft");

  return (
    <div className="rounded-lg border border-[var(--admin-color-border)] bg-[var(--admin-color-surface)]">
      {!expanded ? (
        <div className="flex items-center justify-between p-3">
          <div className="min-w-0">
            {collapsedTitle ? (
              <div className="truncate text-sm font-medium text-[var(--admin-color-foreground)]">
                {collapsedTitle}
              </div>
            ) : (
              <div className="text-xs font-medium uppercase tracking-wide text-[var(--admin-color-warning)]">
                Draft item
              </div>
            )}
            {previewEntries.length > 0 && (
              <div className="mt-1 flex gap-2 text-xs text-[var(--admin-color-muted-foreground)]">
                {previewEntries.map(([key, value]) => (
                  <div key={key} className="truncate">
                    <span className="font-medium">{toLabel(key)}:</span>{" "}
                    <span className="opacity-90">{stringifyValue(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(true)}
              className="rounded px-3 py-2 text-sm text-[var(--admin-color-primary)] hover:bg-[var(--admin-color-accent)]"
            >
              Edit
            </button>
            {!hideDeleteAction && (
              <button
                onClick={onDelete}
                disabled={disabled}
                className="admin-button-danger inline-flex items-center gap-2 rounded px-3 py-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--admin-color-border)] pb-2">
            <h3 className="admin-heading text-sm font-semibold text-[var(--admin-color-foreground)]">
              {expandedTitle}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded(false)}
                className="rounded px-2 py-1 text-sm text-[var(--admin-color-muted-foreground)] hover:bg-[var(--admin-color-surface-muted)]"
              >
                Collapse
              </button>
              {!hideDeleteAction && (
                <button
                  onClick={onDelete}
                  disabled={disabled}
                  className="admin-button-danger inline-flex items-center gap-2 rounded px-3 py-2 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {fields
              .filter((field) => !filteredFieldSet || filteredFieldSet.has(field.name))
              .filter((field) => !hiddenKeys.has(field.name))
              .filter((field) => !isHiddenPath([field.name]))
              .filter((field) => {
                if (!enableLanguageEditing) return true;
                return !isLanguageVariantKey(field.name, languageCodes);
              })
              .map((field) =>
                renderField(field.name, item[field.name], [field.name], 0, item)
              )}
          </div>
        </div>
      )}
    </div>
  );
}
