export function logFunctionError(scope: string, error: unknown, requestId?: string): void {
    const safeError = error instanceof Error
        ? { name: error.name, message: error.message }
        : { name: "UnknownError", message: String(error) };

    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        scope,
        requestId: requestId || "unknown",
        error: safeError,
    }));
}

