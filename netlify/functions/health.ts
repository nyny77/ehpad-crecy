import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };

  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    return {
      statusCode: 405,
      headers: { ...headers, Allow: "GET, HEAD" },
      body: "",
    };
  }

  const body = JSON.stringify({
    status: "ok",
    service: "ehpad-crecy",
    timestamp: new Date().toISOString(),
  });

  return {
    statusCode: 200,
    headers,
    body: event.httpMethod === "HEAD" ? "" : body,
  };
};
