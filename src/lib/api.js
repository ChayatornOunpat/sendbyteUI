const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

// Keep URLs stable by stripping trailing slash from the configured base URL.
export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export function apiUrl(path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

export function publicReceiveUrl(code) {
    const receivePath = `/receive/${code}`;
    if (API_BASE_URL) {
        return `${API_BASE_URL}${receivePath}`;
    }
    if (typeof window !== "undefined") {
        return `${window.location.origin}${receivePath}`;
    }
    return receivePath;
}
