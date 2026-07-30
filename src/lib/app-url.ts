import { headers } from "next/headers";

type HeaderLike = Headers | null | undefined;

function normalizeBaseUrl(value: string) {
  if (!value) return "http://localhost:3000";

  if (/^https?:\/\//i.test(value)) {
    return value.replace(/\/$/, "");
  }

  return `https://${value.replace(/^\//, "")}`.replace(/\/$/, "");
}

export async function getBaseUrl(path = "/", requestHeaders?: HeaderLike) {
  const envBaseUrl =
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL;

  if (envBaseUrl) {
    return new URL(path, normalizeBaseUrl(envBaseUrl)).toString();
  }

  const resolvedHeaders = requestHeaders ?? (await headers());
  const forwardedHost = resolvedHeaders.get("x-forwarded-host") || resolvedHeaders.get("host");
  const forwardedProto = resolvedHeaders.get("x-forwarded-proto") || "http";

  if (forwardedHost) {
    return new URL(path, `${forwardedProto}://${forwardedHost}`).toString();
  }

  const fallbackBaseUrl =
    process.env.NODE_ENV === "production" ? "https://localhost:3000" : "http://localhost:3000";

  return new URL(path, fallbackBaseUrl).toString();
}

export function normalizeRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  if (!value.startsWith("/")) {
    return fallback;
  }

  if (value.startsWith("//")) {
    return fallback;
  }

  return value;
}
