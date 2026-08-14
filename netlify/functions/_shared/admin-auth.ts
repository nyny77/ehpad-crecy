import type { HandlerContext } from "@netlify/functions";

export function isAdminRequest(context: HandlerContext): boolean {
    const roles = context.clientContext?.user?.app_metadata?.roles;
    return Array.isArray(roles) && roles.includes("admin");
}

export const json = (statusCode: number, body: unknown) => ({
    statusCode,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
});
