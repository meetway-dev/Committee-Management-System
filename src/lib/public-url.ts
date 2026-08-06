// Client-safe base URL for public shareable links (invites, etc.).
// No server-only imports here so it can be used from client components.
export const PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://bachatzone.vercel.app";

function normalizePublicBaseUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value.replace(/\/$/, "");
  }
  return `https://${value.replace(/^\//, "")}`.replace(/\/$/, "");
}

export function getPublicUrl(path = "/") {
  return new URL(path, normalizePublicBaseUrl(PUBLIC_APP_URL)).toString();
}
