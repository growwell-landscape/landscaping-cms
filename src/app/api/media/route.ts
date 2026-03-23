import { access, readFile } from "fs/promises";
import { constants as fsConstants } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

import { logRouteEvent } from "@/lib/api-response";
import { createGitHubAPI } from "@/lib/github-api";

const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".ogg": "video/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

function isValidUploadPath(value: string): boolean {
  return value.startsWith("/uploads/") && !value.includes("..");
}

function getFileExtension(pathname: string): string {
  const lastDotIndex = pathname.lastIndexOf(".");
  if (lastDotIndex < 0) return "";
  return pathname.slice(lastDotIndex).toLowerCase();
}

function getContentType(pathname: string): string {
  return MIME_TYPE_BY_EXTENSION[getFileExtension(pathname)] || "application/octet-stream";
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
}

async function tryReadLocalUpload(uploadPath: string): Promise<ArrayBuffer | null> {
  const fullPath = join(process.cwd(), "public", uploadPath.replace(/^\/uploads\//, "uploads/"));

  try {
    await access(fullPath, fsConstants.F_OK);
    const fileBuffer = await readFile(fullPath);
    return toArrayBuffer(new Uint8Array(fileBuffer));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const mediaPath = request.nextUrl.searchParams.get("path") || "";

  if (!isValidUploadPath(mediaPath)) {
    return new NextResponse("Invalid media path", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const contentType = getContentType(mediaPath);
  const localMedia = await tryReadLocalUpload(mediaPath);

  if (localMedia) {
    return new NextResponse(localMedia, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": contentType,
      },
    });
  }

  try {
    const github = createGitHubAPI();
    const fileData = await github.getFile(`public${mediaPath}`);

    if (!fileData.content) {
      return new NextResponse("Media not found", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const mediaBuffer = Buffer.from(fileData.content, "base64");
    return new NextResponse(toArrayBuffer(new Uint8Array(mediaBuffer)), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    logRouteEvent(
      "media",
      error instanceof Error ? error.message : "Failed to load media preview"
    );
    return new NextResponse("Media not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
