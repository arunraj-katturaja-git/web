import { NextRequest } from "next/server";
import { getCommerceApiBase } from "@/lib/backend";

function buildHeaders(request: NextRequest, hasBody: boolean): HeadersInit {
  return {
    Accept: "application/json",
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(request.headers.get("authorization")
      ? { Authorization: request.headers.get("authorization")! }
      : {}),
    ...(request.headers.get("x-guest-token")
      ? { "X-Guest-Token": request.headers.get("x-guest-token")! }
      : {}),
  };
}

export async function POST(request: NextRequest) {
  const target = new URL("payment/verify", `${getCommerceApiBase()}/`);
  const body = await request.text();

  const response = await fetch(target, {
    method: "POST",
    headers: buildHeaders(request, Boolean(body)),
    body,
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
