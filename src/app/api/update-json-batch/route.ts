/**
 * POST /api/update-json-batch
 * Updates multiple JSON files in one publish operation
 */

import { NextRequest, NextResponse } from "next/server";
import { mkdir, unlink, writeFile } from "fs/promises";
import { dirname, join } from "path";

import { createErrorResponse, createGitHubErrorResponse } from "@/lib/api-response";
import { CMS_FILES } from "@/lib/cms-utils";
import { createGitHubAPI } from "@/lib/github-api";
import { validateAdminPassword } from "@/lib/runtime-env";
import type { APIResponse, JSONBatchUpdatePayload } from "@/types/cms";

const ALLOWED_FILE_PATHS = new Set<string>(Object.values(CMS_FILES));
const MEDIA_PATH_PATTERN = /^public\/uploads\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|mp4|webm|ogg|mov)$/i;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let payload: JSONBatchUpdatePayload;
    try {
      payload = (await request.json()) as JSONBatchUpdatePayload;
    } catch {
      return createErrorResponse(400, "Invalid request body");
    }

    const fileUpdates = Array.isArray(payload.files) ? payload.files : [];
    const mediaUploads = Array.isArray(payload.mediaUploads)
      ? payload.mediaUploads
      : [];
    const mediaDeletes = Array.isArray(payload.mediaDeletes)
      ? payload.mediaDeletes
      : [];

    if (!payload.password) {
      return createErrorResponse(400, "Missing required field: password");
    }
    if (
      fileUpdates.length === 0 &&
      mediaUploads.length === 0 &&
      mediaDeletes.length === 0
    ) {
      return createErrorResponse(400, "Nothing to publish");
    }

    if (!validateAdminPassword(payload.password)) {
      return createErrorResponse(401, "Invalid password");
    }

    const normalizedUpdates = fileUpdates.map((file) => {
      if (!file.filePath || typeof file.content !== "string") {
        throw new Error("Each file must include filePath and content");
      }
      if (!ALLOWED_FILE_PATHS.has(file.filePath)) {
        throw new Error(`Invalid file path: ${file.filePath}`);
      }

      const parsedJSON = JSON.parse(file.content);
      return {
        filePath: file.filePath,
        content: JSON.stringify(parsedJSON, null, 2),
      };
    });
    const normalizedMediaUploads = mediaUploads.map((file) => {
      if (!file.filePath || typeof file.base64Content !== "string") {
        throw new Error("Each media upload must include filePath and base64Content");
      }
      if (!MEDIA_PATH_PATTERN.test(file.filePath)) {
        throw new Error(`Invalid media upload path: ${file.filePath}`);
      }
      return {
        filePath: file.filePath,
        base64Content: file.base64Content,
      };
    });
    const normalizedMediaDeletes = mediaDeletes.map((filePath) => {
      if (typeof filePath !== "string" || !MEDIA_PATH_PATTERN.test(filePath)) {
        throw new Error(`Invalid media delete path: ${String(filePath)}`);
      }
      return filePath;
    });

    if (process.env.NODE_ENV === "development") {
      for (const update of normalizedUpdates) {
        const fullPath = join(process.cwd(), update.filePath);
        await writeFile(fullPath, update.content, "utf-8");
      }
      for (const upload of normalizedMediaUploads) {
        const fullPath = join(process.cwd(), upload.filePath);
        await mkdir(dirname(fullPath), { recursive: true });
        await writeFile(fullPath, Buffer.from(upload.base64Content, "base64"));
      }
      for (const filePath of normalizedMediaDeletes) {
        const fullPath = join(process.cwd(), filePath);
        try {
          await unlink(fullPath);
        } catch (error) {
          const code = (error as NodeJS.ErrnoException | undefined)?.code;
          if (code !== "ENOENT") {
            throw error;
          }
        }
      }

      const successResponse: APIResponse = {
        success: true,
        data: {
          commitSha: "local-dev-batch",
          files: [
            ...normalizedUpdates.map((file) => file.filePath),
            ...normalizedMediaUploads.map((file) => file.filePath),
            ...normalizedMediaDeletes,
          ],
        },
        message: "Batch updated successfully (local development)",
      };
      return NextResponse.json(successResponse);
    }

    const github = createGitHubAPI();
    const batchUpdates = [
      ...normalizedUpdates.map((update) => ({
        filePath: update.filePath,
        content: update.content,
        contentEncoding: "utf-8" as const,
        action: "upsert" as const,
      })),
      ...normalizedMediaUploads.map((upload) => ({
        filePath: upload.filePath,
        content: upload.base64Content,
        contentEncoding: "base64" as const,
        action: "upsert" as const,
      })),
      ...normalizedMediaDeletes.map((filePath) => ({
        filePath,
        action: "delete" as const,
      })),
    ];
    const result = await github.putFilesBatch(
      batchUpdates,
      `CMS publish: ${normalizedUpdates.length} json, ${normalizedMediaUploads.length} uploads, ${normalizedMediaDeletes.length} deletions`
    );

    const successResponse: APIResponse = {
      success: true,
      data: result,
      message: "Batch updated successfully (GitHub)",
    };
    return NextResponse.json(successResponse);
  } catch (error) {
    return createGitHubErrorResponse(
      "update-json-batch",
      error,
      "Internal server error"
    );
  }
}
