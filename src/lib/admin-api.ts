import { getCurrentUser } from "@/lib/netlifyAuth";

export async function adminFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
    const token = getCurrentUser()?.token?.access_token;
    if (!token) throw new Error("La session administrateur a expiré. Reconnectez-vous.");

    const response = await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(init.body ? { "Content-Type": "application/json" } : {}),
            ...init.headers,
        },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error((data as { error?: string }).error || `Erreur HTTP ${response.status}`);
    }
    return data as T;
}

export async function adminFetchBlob(url: string, init: RequestInit = {}): Promise<Blob> {
    const token = getCurrentUser()?.token?.access_token;
    if (!token) throw new Error("La session administrateur a expiré.");

    const response = await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            ...init.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
    }
    return await response.blob();
}
