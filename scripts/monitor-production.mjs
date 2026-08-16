const siteUrl = (process.env.SITE_URL || "https://ehpadcrecy.netlify.app").replace(/\/$/, "");
const timeoutMs = 15_000;

const checks = [
    { path: "/", status: 200, marker: "EHPAD" },
    { path: "/contact", status: 200, marker: "contact-v5" },
    { path: "/admissions", status: 200, marker: "ViaTrajectoire" },
    { path: "/administration", status: 200, marker: "Administration" },
    { path: "/familles", status: 200, marker: "Postier" },
    { path: "/.netlify/functions/health", status: 200, marker: '"status":"ok"' },
    { path: "/.netlify/functions/famille-send-message", status: 405 },
    { path: "/.netlify/functions/admin-messages", status: 403 },
];

async function check({ path, status, marker }) {
    const response = await fetch(`${siteUrl}${path}`, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { "User-Agent": "ehpad-crecy-production-monitor/1.0" },
    });
    const body = await response.text();

    if (response.status !== status) {
        throw new Error(`${path} répond ${response.status} au lieu de ${status}`);
    }
    if (marker && !body.includes(marker)) {
        throw new Error(`${path} ne contient plus le repère attendu`);
    }

    process.stdout.write(`OK ${path} (${response.status})\n`);
}

const results = await Promise.allSettled(checks.map(check));
const failures = results.filter(result => result.status === "rejected");

if (failures.length > 0) {
    for (const failure of failures) console.error(`ECHEC ${failure.reason?.message || failure.reason}`);
    process.exitCode = 1;
} else {
    process.stdout.write(`Supervision réussie : ${checks.length} contrôles sur ${siteUrl}\n`);
}
