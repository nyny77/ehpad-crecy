import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    return {
      statusCode: 405,
      headers: { Allow: "GET, HEAD", "Cache-Control": "no-store" },
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
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: event.httpMethod === "HEAD" ? "" : body,
  };
};
