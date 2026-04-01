import { NextRequest, NextResponse } from "next/server";
import { getAllowedMediaHosts } from "@/lib/media-config";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing media url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid media url", { status: 400 });
  }

  const allowedHosts = getAllowedMediaHosts();
  if (!allowedHosts.has(parsed.host)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  const response = await fetch(parsed.toString(), { cache: "no-store" });

  if (!response.ok) {
    return new NextResponse("Unable to fetch media", { status: response.status });
  }

  const headers = new Headers();
  const contentType = response.headers.get("content-type");
  const cacheControl = response.headers.get("cache-control");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  headers.set("cache-control", cacheControl ?? "public, max-age=300");

  return new NextResponse(response.body, {
    status: 200,
    headers,
  });
}
