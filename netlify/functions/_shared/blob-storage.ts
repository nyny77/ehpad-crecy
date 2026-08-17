import { getStore } from "@netlify/blobs";

// Fallback in-memory store for local development without Netlify CLI
class MockStore {
    private data = new Map<string, any>();
    
    async get(key: string, options?: any) {
        if (options?.type === "json") return this.data.get(key) || null;
        return this.data.get(key) ? new Blob([this.data.get(key)]) : null;
    }
    
    async setJSON(key: string, value: any) { this.data.set(key, value); }
    async set(key: string, value: any) { this.data.set(key, value); }
    async delete(key: string) { this.data.delete(key); }
    async list() {
        return { blobs: Array.from(this.data.keys()).map(k => ({ key: k })) };
    }
}

const mockMessages = new MockStore();
const mockResidents = new MockStore();
// Pré-remplir un résident pour les tests locaux si besoin
mockResidents.setJSON("test-resident", { id: "test-resident", name: "Résident Test", secretCode: "NYNY-7680" });
const mockImages = new MockStore();

function safeGetStore(name: string, mock: MockStore) {
    try {
        // En local sans `netlify dev`, ça throw une erreur
        return getStore(name);
    } catch (e) {
        console.warn(`[Local Dev] Utilisation du mock in-memory pour le store: ${name}`);
        return mock as any;
    }
}

export const getMessagesStore = () => safeGetStore("messages", mockMessages);
export const getResidentsStore = () => safeGetStore("residents", mockResidents);
export const getImagesStore = () => safeGetStore("message-images", mockImages);
