import type { HandlerContext } from "@netlify/functions";

export function isAdminRequest(context: HandlerContext): boolean {
    const roles = context.clientContext?.user?.app_metadata?.roles;
    return Array.isArray(roles) && roles.includes("admin");
}

export function isAdminRequestV2(req: Request): boolean {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) return false;
    try {
        const payload = auth.split(".")[1];
        if (!payload) return false;
        const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
        const roles = decoded?.app_metadata?.roles;
        return Array.isArray(roles) && roles.includes("admin");
    } catch {
        return false;
    }
}

export const json = (statusCode: number, body: unknown) => ({
    statusCode,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
});

export const jsonV2 = (status: number, body: unknown) => 
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
