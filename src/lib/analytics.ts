/**
 * Utility for safe, privacy-friendly event tracking via GoatCounter.
 * Does not use any cookies or personal data. Fails silently if GoatCounter is not loaded.
 */
export function trackEvent(name: string, title?: string): void {
  if (typeof window === "undefined") return;

  try {
    const gc = (window as typeof window & {
      goatcounter?: { count: (event: { path: string; title: string; event: boolean }) => void };
    }).goatcounter;

    if (gc && typeof gc.count === "function") {
      gc.count({
        path: `/events/${name}`,
        title: title || name,
        event: true,
      });
    }
  } catch {
    // Non-blocking, fails gracefully
  }
}
