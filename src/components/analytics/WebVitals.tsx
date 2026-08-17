"use client";

import { useReportWebVitals } from "next/web-vitals";

type WebVitalMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];
const CORE_WEB_VITALS = new Set(["LCP", "INP", "CLS"]);

function sendToGoatCounter(metric: WebVitalMetric, attempt = 0) {
    const goatCounter = (window as typeof window & {
        goatcounter?: { count: (event: { path: string; title: string; event: boolean }) => void };
    }).goatcounter;

    if (!goatCounter && attempt < 4) {
        window.setTimeout(() => sendToGoatCounter(metric, attempt + 1), 1000);
        return;
    }
    if (!goatCounter) return;

    const route = window.location.pathname === "/" ? "/accueil" : window.location.pathname;
    goatCounter.count({
        path: `/web-vitals${route}/${metric.name}/${metric.rating}`,
        title: `${metric.name} — ${metric.rating}`,
        event: true,
    });
}

export default function WebVitals() {
    useReportWebVitals(metric => {
        if (CORE_WEB_VITALS.has(metric.name)) sendToGoatCounter(metric);
    });
    return null;
}
