import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
    // 1. Security Check: Only Admin
    const { user, identity } = context.clientContext || {};

    if (!user || !user.app_metadata?.roles?.includes("admin")) {
        return { statusCode: 403, body: "Forbidden: Admin access required" };
    }

    if (!identity || !identity.token) {
        return { statusCode: 500, body: "Identity context missing" };
    }

    // 2. Fetch Users from Netlify Identity API
    // We use the token provided in the context which has admin privileges (service token) 
    // OR we use the user's token if it has admin scope. 
    // Actually, context.clientContext.identity.token is a short-lived admin token for the function 
    // to interact with the Identity API.

    try {
        const response = await fetch(`${identity.url}/admin/users`, {
            headers: {
                Authorization: `Bearer ${identity.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
