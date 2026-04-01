const LOCAL_COMMERCE_API_BASE = "http://localhost:5001/api";

export function getCommerceApiBase(): string {
  const configuredBase =
    process.env.COMMERCE_API_URL ??
    process.env.NEXT_PUBLIC_API_URL;

  if (configuredBase?.trim()) {
    return configuredBase.trim().replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV !== "production") {
    return LOCAL_COMMERCE_API_BASE;
  }

  throw new Error(
    "Missing COMMERCE_API_URL for production. Set it to your public commerce backend URL, for example https://commerce.example.com/api.",
  );
}
