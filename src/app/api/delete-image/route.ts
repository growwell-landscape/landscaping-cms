/**
 * DELETE /api/delete-image
 * Deletes image from GitHub repository
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile, unlink } from "fs/promises";
import { join } from "path";
import { createErrorResponse, createGitHubErrorResponse, logRouteEvent } from "@/lib/api-response";
import { createGitHubAPI } from "@/lib/github-api";
import { CMS_FILES } from "@/lib/cms-utils";
import { validateAdminPassword } from "@/lib/runtime-env";
import type { APIResponse, ImageDeletePayload } from "@/types/cms";

function normalizeImagePath(filePath: string): string | null {
  const sanitizedInput = filePath.trim().replace(/\\/g, "/");
  if (!sanitizedInput || sanitizedInput.includes("..")) return null;

  let normalized = sanitizedInput.startsWith("/")
    ? sanitizedInput.slice(1)
    : sanitizedInput;

  if (normalized.startsWith("uploads/")) {
    normalized = `public/${normalized}`;
  }

  if (!normalized.startsWith("public/uploads/")) {
    return null;
  }

  return normalized;
}

function toPublicUploadPath(normalizedFilePath: string): string {
  return `/${normalizedFilePath.replace(/^public\//, "")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function countUploadPathReferences(value: unknown, targetPath: string): number {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry === targetPath).length;
  }

  if (Array.isArray(value)) {
    return value.reduce<number>((total, entry) => {
      return total + countUploadPathReferences(entry, targetPath);
    }, 0);
  }

  if (isRecord(value)) {
    return Object.values(value).reduce<number>((total, entry) => {
      return total + countUploadPathReferences(entry, targetPath);
    }, 0);
  }

  return 0;
}

async function loadCMSFileData(filePath: string): Promise<unknown> {
  if (process.env.NODE_ENV === "development") {
    const fullPath = join(process.cwd(), filePath);
    const fileContent = await readFile(fullPath, "utf-8");
    return JSON.parse(fileContent);
  }

  const github = createGitHubAPI();
  const fileData = await github.getFile(filePath);
  const decoded = Buffer.from(fileData.content || "", "base64").toString("utf-8");
  return JSON.parse(decoded);
}

async function countUploadReferencesAcrossCMS(publicPath: string): Promise<number | null> {
  try {
    let totalReferences = 0;
    for (const cmsFilePath of Object.values(CMS_FILES)) {
      const content = await loadCMSFileData(cmsFilePath);
      totalReferences += countUploadPathReferences(content, publicPath);
    }
    return totalReferences;
  } catch (error) {
    logRouteEvent(
      "delete-image",
      error instanceof Error ? error.message : "Failed to inspect upload references"
    );
    return null;
  }
}

/**
 * Handle DELETE request to delete image from GitHub
 * @param request - Next.js request object
 * @returns JSON response with deletion status
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let payload: ImageDeletePayload;
    try {
      payload = (await request.json()) as ImageDeletePayload;
    } catch {
      return createErrorResponse(400, "Invalid request body");
    }

    // Validate required fields
    if (!payload.filePath || !payload.password) {
      return createErrorResponse(400, "Missing required fields: filePath, password");
    }

    // Validate password
    if (!validateAdminPassword(payload.password)) {
      return createErrorResponse(401, "Invalid password");
    }

    const normalizedPath = normalizeImagePath(payload.filePath);
    if (!normalizedPath) {
      return createErrorResponse(400, "Invalid image path");
    }
    const publicPath = toPublicUploadPath(normalizedPath);
    const referenceCount = await countUploadReferencesAcrossCMS(publicPath);

    if (referenceCount === null) {
      const safeSkipResponse: APIResponse = {
        success: true,
        data: {
          path: publicPath,
          deleted: false,
          skipped: true,
          reason: "Unable to verify references safely",
        },
        message: "Image deletion skipped because references could not be verified",
      };
      return NextResponse.json(safeSkipResponse);
    }

    if (referenceCount > 0) {
      const skippedResponse: APIResponse = {
        success: true,
        data: {
          path: publicPath,
          deleted: false,
          skipped: true,
          references: referenceCount,
        },
        message: "Image deletion skipped because path is still referenced",
      };
      return NextResponse.json(skippedResponse);
    }

    if (process.env.NODE_ENV === "development") {
      const fullPath = join(process.cwd(), normalizedPath);
      try {
        await unlink(fullPath);
      } catch (error) {
        const code = (error as NodeJS.ErrnoException | undefined)?.code;
        if (code !== "ENOENT") {
          throw error;
        }
      }

      const successResponse: APIResponse = {
        success: true,
        data: {
          path: publicPath,
          deleted: true,
        },
        message: "Image deleted successfully (local development)",
      };

      return NextResponse.json(successResponse);
    }

    // Initialize GitHub API
    const github = createGitHubAPI();

    // Get file to retrieve SHA
    let fileData;
    try {
      fileData = await github.getFile(normalizedPath);
    } catch {
      return createErrorResponse(404, `File not found: ${normalizedPath}`);
    }

    // Delete file
    await github.deleteFile(
      normalizedPath,
      fileData.sha,
      `Delete image: ${normalizedPath}`
    );

    const successResponse: APIResponse = {
      success: true,
      data: {
        path: publicPath,
        deleted: true,
      },
      message: "Image deleted successfully",
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    return createGitHubErrorResponse(
      "delete-image",
      error,
      "Internal server error"
    );
  }
}
