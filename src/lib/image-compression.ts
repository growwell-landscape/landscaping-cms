/**
 * Image compression and processing utilities
 * Handles image compression before upload to GitHub
 */

import imageCompression from "browser-image-compression";
import type { CompressionOptions, CompressionResult } from "@/types/cms";

/**
 * Default compression options
 */
export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

/**
 * Maximum allowed file size before compression (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Validate image file
 * @param file - File to validate
 * @throws Error if file is invalid
 */
export function validateImageFile(file: File): void {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum allowed size of 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );
  }
}

/**
 * Compress image file
 * @param file - Image file to compress
 * @param options - Compression options
 * @returns Compression result with original and compressed sizes
 * @throws Error if compression fails
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = DEFAULT_COMPRESSION_OPTIONS
): Promise<CompressionResult> {
  try {
    // Validate file before compression
    validateImageFile(file);

    const originalSize = file.size;

    // Compress image
    const compressedFile = await imageCompression(file, options);

    // Calculate compression ratio
    const compressedSize = compressedFile.size;
    const ratio = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(2);

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      ratio: parseFloat(ratio),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Image compression failed: ${error.message}`);
    }
    throw new Error("Image compression failed");
  }
}

/**
 * Convert file to base64 string
 * @param file - File to convert
 * @returns Base64 encoded string
 * @throws Error if conversion fails
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    reader.onerror = () => {
      reject(new Error("FileReader error"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Generate unique filename for image
 * @param originalFileName - Original file name
 * @returns Unique filename with timestamp
 */
export function generateUniqueFileName(originalFileName: string): string {
  const timestamp = Date.now();
  const extension = originalFileName.split(".").pop() || "jpg";
  return `img-${timestamp}.${extension}`;
}

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get image dimensions
 * @param file - Image file
 * @returns Width and height of image
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("FileReader error"));
    };

    reader.readAsDataURL(file);
  });
}
