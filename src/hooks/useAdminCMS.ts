/**
 * Hook for managing admin CMS state and operations
 */

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type {
  DataItem,
  DynamicField,
  APIResponse,
  ImageUploadPayload,
  ImageDeletePayload,
  JSONUpdatePayload,
} from "@/types/cms";
import { extractFieldsFromItems, detectFieldType, generateId } from "@/lib/cms-utils";

/**
 * Hook for admin CMS operations
 * @returns Admin hook with state and methods
 */
export function useAdminCMS() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load JSON data from GitHub
   * @param filePath - File path to load
   * @param password - Admin password
   */
  const loadData = useCallback(
    async (filePath: string, password: string) => {
      if (!filePath || !password) {
        toast.error("Please select a file and enter password");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/get-json?filePath=${filePath}`);
        const data = (await response.json()) as APIResponse;

        if (!data.success) {
          toast.error(data.error || "Failed to load data");
          return;
        }

        const loadedItems = (data.data as Record<string, unknown>)
          .content as DataItem[];
        setItems(loadedItems);

        // Extract fields from loaded items
        const extractedFields = extractFieldsFromItems(loadedItems);
        const detectedFields: DynamicField[] = extractedFields.map((field) => {
          const sampleValue = loadedItems[0]?.[field];
          return {
            name: field,
            type: detectFieldType(sampleValue) as
              | "string"
              | "number"
              | "boolean"
              | "array"
              | "image",
            label: field.charAt(0).toUpperCase() + field.slice(1),
          };
        });

        setFields(detectedFields);
        setSelectedFile(filePath);
        toast.success("Data loaded successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load data";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Save data to GitHub
   * @param filePath - File path to save
   * @param password - Admin password
   */
  const saveData = useCallback(
    async (filePath: string, password: string) => {
      if (!filePath || !password) {
        toast.error("Please select a file and enter password");
        return;
      }

      if (items.length === 0) {
        toast.error("No items to save");
        return;
      }

      setIsLoading(true);
      try {
        const payload: JSONUpdatePayload = {
          filePath,
          content: JSON.stringify(items, null, 2),
          password,
        };

        const response = await fetch("/api/update-json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as APIResponse;

        if (!data.success) {
          toast.error(data.error || "Failed to save data");
          return;
        }

        toast.success("Data saved successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save data";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [items]
  );

  /**
   * Update item field value
   * @param itemId - Item ID
   * @param fieldName - Field name
   * @param value - New value
   */
  const updateItemField = useCallback(
    (itemId: number, fieldName: string, value: unknown) => {
      setItems((prevItems: DataItem[]) =>
        prevItems.map((item: DataItem) =>
          item.id === itemId ? { ...item, [fieldName]: value } : item
        )
      );
    },
    []
  );

  /**
   * Add new item
   */
  const addItem = useCallback(() => {
    const newItem: DataItem = { id: generateId() };

    // Initialize with empty values for each field
    fields.forEach((field: DynamicField) => {
      newItem[field.name] =
        field.type === "boolean"
          ? false
          : field.type === "array"
            ? []
            : field.type === "number"
              ? 0
              : "";
    });

    setItems((prevItems: DataItem[]) => [newItem, ...prevItems]);
    toast.success("New item added");
  }, [fields]);

  /**
   * Delete item
   * @param itemId - Item ID to delete
   * @param password - Admin password
   */
  const deleteItem = useCallback(
    async (itemId: number, password: string) => {
      const item = items.find((i: DataItem) => i.id === itemId);
      if (!item) return;

      // Delete associated image if exists
      const imageField = fields.find((f: DynamicField) => f.type === "image");
      if (imageField) {
        const imagePath = item[imageField.name] as string;
        if (imagePath && imagePath.startsWith("/uploads/")) {
          try {
            const payload: ImageDeletePayload = {
              filePath: `public${imagePath}`,
              password,
            };

            await fetch("/api/delete-image", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } catch (error) {
            console.error("Failed to delete image:", error);
          }
        }
      }

      setItems((prevItems: DataItem[]) => prevItems.filter((i: DataItem) => i.id !== itemId));
      toast.success("Item deleted");
    },
    [items, fields]
  );

  /**
   * Upload image for item
   * @param itemId - Item ID
   * @param file - Image file
   * @param password - Admin password
   */
  const uploadImage = useCallback(
    async (itemId: number, file: File, password: string) => {
      if (!file) {
        toast.error("Please select an image");
        return;
      }

      setIsLoading(true);
      try {
        // TODO: Compress image and convert to base64
        // For now, just upload raw file
        const reader = new FileReader();

        reader.onload = async () => {
          const base64Content = reader.result?.toString().split(",")[1] || "";

          const payload: ImageUploadPayload = {
            fileName: `img-${Date.now()}.${file.type.split("/")[1]}`,
            base64Content,
            password,
          };

          const response = await fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = (await response.json()) as APIResponse;

          if (!data.success) {
            toast.error(data.error || "Failed to upload image");
            return;
          }

          const imagePath = (data.data as Record<string, unknown>)
            .path as string;
          const imageField = fields.find((f: DynamicField) => f.type === "image");

          if (imageField) {
            updateItemField(itemId, imageField.name, imagePath);
            toast.success("Image uploaded successfully");
          }
        };

        reader.readAsDataURL(file);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload image";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fields, updateItemField]
  );

  /**
   * Add new field to all items
   * @param fieldName - Field name
   * @param fieldType - Field type
   */
  const addField = useCallback(
    (fieldName: string, fieldType: string) => {
      if (!fieldName) {
        toast.error("Field name is required");
        return;
      }

      // Check if field already exists
      if (fields.some((f: DynamicField) => f.name === fieldName)) {
        toast.error("Field already exists");
        return;
      }

      const newField: DynamicField = {
        name: fieldName,
        type: fieldType as
          | "string"
          | "number"
          | "boolean"
          | "array"
          | "image",
        label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
      };

      setFields((prevFields: DynamicField[]) => [...prevFields, newField]);

      // Add field to all items with default value
      const defaultValue =
        fieldType === "boolean"
          ? false
          : fieldType === "array"
            ? []
            : fieldType === "number"
              ? 0
              : "";

      setItems((prevItems: DataItem[]) =>
        prevItems.map((item: DataItem) => ({
          ...item,
          [fieldName]: defaultValue,
        }))
      );

      toast.success("Field added");
    },
    [fields]
  );

  /**
   * Remove field from all items
   * @param fieldName - Field name to remove
   */
  const removeField = useCallback((fieldName: string) => {
    setFields((prevFields: DynamicField[]) =>
      prevFields.filter((f: DynamicField) => f.name !== fieldName)
    );

    setItems((prevItems: DataItem[]) =>
      prevItems.map((item: DataItem) => {
        const newItem = { ...item };
        delete newItem[fieldName];
        return newItem;
      })
    );

    toast.success("Field removed");
  }, []);

  return {
    items,
    fields,
    selectedFile,
    isLoading,
    loadData,
    saveData,
    updateItemField,
    addItem,
    deleteItem,
    uploadImage,
    addField,
    removeField,
    setItems,
    setFields,
  };
}
