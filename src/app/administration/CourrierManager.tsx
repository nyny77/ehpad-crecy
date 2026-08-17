import { useState, useEffect } from "react";
import { Mail, CheckCircle2, Trash2, LoaderCircle, Printer, Image as ImageIcon } from "lucide-react";
import type { FamilyMessage } from "../../../netlify/functions/famille-send-message";
import type { Resident } from "../../../netlify/functions/admin-residents";
import { adminFetch } from "@/lib/admin-api";

const POSTCARD_THEMES = [
    { name: "Aurore", primary: "#D64C63", secondary: "#F4B860", accent: "#4F8A75", paper: "#FFF8F1", ink: "#26333D" },
    { name: "Riviera", primary: "#19647E", secondary: "#F4D35E", accent: "#EE6C4D", paper: "#F5FBFA", ink: "#17324D" },
    { name: "Jardin", primary: "#557A46", secondary: "#E8B86D", accent: "#A44A5B", paper: "#FAF8EF", ink: "#28372B" },
    { name: "Lavande", primary: "#765D9A", secondary: "#E9A6A6", accent: "#D7903C", paper: "#FBF8FF", ink: "#332C45" },
    { name: "Océan", primary: "#176B87", secondary: "#64CCC5", accent: "#FF9B50", paper: "#F4FBFC", ink: "#193A4A" },
    { name: "Coquelicot", primary: "#B83A3A", secondary: "#F2C14E", accent: "#3D7A6A", paper: "#FFF9F4", ink: "#3A2929" },
] as const;

const POSTCARD_MOTIFS = ["orbits", "confetti", "arches", "sunrise"] as const;
let previousPostcardTheme = -1;

function nextPostcardDesign() {
    const randomValues = new Uint32Array(5);
    window.crypto.getRandomValues(randomValues);
    const offset = 1 + (randomValues[0] % (POSTCARD_THEMES.length - 1));
    const themeIndex = previousPostcardTheme < 0
        ? randomValues[0] % POSTCARD_THEMES.length
        : (previousPostcardTheme + offset) % POSTCARD_THEMES.length;
    previousPostcardTheme = themeIndex;

    return {
        theme: POSTCARD_THEMES[themeIndex],
        motif: POSTCARD_MOTIFS[randomValues[1] % POSTCARD_MOTIFS.length],
        layout: ["balanced", "message-wide", "address-wide"][randomValues[2] % 3],
        tilt: (randomValues[3] % 9) - 4,
        shapeShift: randomValues[4] % 18,
    };
}

function escapePostcardText(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export default function CourrierManager() {
    const [messages, setMessages] = useState<FamilyMessage[]>([]);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Nettoyage discret : uniquement les courriers distribués depuis plus de 30 jours.
            await adminFetch("/.netlify/functions/admin-messages", {
                method: "POST",
                body: JSON.stringify({ action: "purgeExpired" })
            });

            const [dataMsg, dataRes] = await Promise.all([
                adminFetch<{ messages: FamilyMessage[] }>("/.netlify/functions/admin-messages"),
                adminFetch<{ residents: Resident[] }>("/.netlify/functions/admin-residents")
            ]);
            
            // Sort messages: newest first
            const sortedMessages = (dataMsg.messages || []).sort((a: FamilyMessage, b: FamilyMessage) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            
            setMessages(sortedMessages);
            setResidents(dataRes.residents || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getResidentName = (id: string) => {
        return residents.find(r => r.id === id)?.name || "Résident inconnu";
    };

    const getResidentRoom = (id: string) => {
        const room = residents.find(r => r.id === id)?.room;
        return room ? `(Ch. ${room})` : "";
    };

    const handleMarkDistributed = async (id: string) => {
        try {
            const data = await adminFetch<{ message: FamilyMessage }>("/.netlify/functions/admin-messages", {
                method: "POST",
                body: JSON.stringify({ action: "markDistributed", id })
            });
            setMessages(messages.map(m => m.id === id ? data.message : m));
        } catch (err: any) {
            alert(err.message || "Erreur réseau");
        }
    };

    const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce message définitivement ?")) return;
        try {
            await adminFetch("/.netlify/functions/admin-messages", {
                method: "POST",
                body: JSON.stringify({ action: "delete", id })
            });
            setMessages(messages.filter(m => m.id !== id));
            setSelectedMessages(prev => prev.filter(mId => mId !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedMessages.length === 0) return;
        if (!confirm(`Voulez-vous vraiment supprimer définitivement ces ${selectedMessages.length} messages ?`)) return;
        
        try {
            await adminFetch("/.netlify/functions/admin-messages", {
                method: "POST",
                body: JSON.stringify({ action: "bulkDelete", ids: selectedMessages })
            });
            setMessages(messages.filter(m => !selectedMessages.includes(m.id)));
            setSelectedMessages([]);
        } catch (err) {
            alert("Erreur lors de la suppression groupée");
        }
    };
    const handlePrint = (message: FamilyMessage) => {
        const residentName = getResidentName(message.residentId);
        const residentRoom = getResidentRoom(message.residentId);
        const design = nextPostcardDesign();
        const safeResidentName = escapePostcardText(residentName);
        const safeResidentRoom = escapePostcardText(residentRoom || "EHPAD de Crécy-la-Chapelle");
        const safeMessage = escapePostcardText(message.text);
        const safeSenderName = escapePostcardText(message.senderName);
        const safePhotoUrl = message.photoUrl ? escapePostcardText(message.photoUrl) : "";
        const formattedDate = new Date(message.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        
        // Create a hidden iframe, write HTML, and print it
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        
        const contentWindow = iframe.contentWindow;
        if (!contentWindow) return;
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Carte postale pour ${safeResidentName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
                <style>
                    @page {
                        size: A4;
                        margin: 0; /* No margins, full page */
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                        font-family: sans-serif;
                        width: 210mm;
                        height: 297mm; /* A4 */
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                    }
                    .photo-half {
                        width: 100% !important;
                        height: 148.5mm !important; /* Exactly half A4 */
                        display: block !important;
                        border-bottom: 1px dashed #ccc !important;
                        overflow: hidden !important;
                        background: #fff !important;
                    }
                    .photo-half img {
                        display: block !important;
                        width: 100% !important;
                        height: 100% !important;
                        max-width: none !important;
                        max-height: none !important;
                        object-fit: contain !important; /* Fit entirely without cropping */
                        object-position: center !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .no-photo {
                        text-align: center;
                        color: #B4533A;
                        font-family: 'Playfair Display', serif;
                    }
                    .no-photo h2 { font-size: 36px; margin-bottom: 10px; }
                    .no-photo p { font-size: 20px; color: #666; font-style: italic; }

                    /* Bottom half: Postcard */
                    .text-half {
                        width: 210mm;
                        height: 148.5mm;
                        box-sizing: border-box;
                        padding: 15mm;
                        background: #fff;
                        position: relative;
                        display: flex;
                        gap: 10mm;
                    }
                    
                    /* Postcard vertical divider */
                    .divider {
                        width: 1px;
                        background: #ccc;
                        height: 100%;
                        flex-shrink: 0;
                    }

                    /* Message side (Left) */
                    .message-side {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    .message-content {
                        font-family: 'Caveat', cursive;
                        font-size: 26px;
                        line-height: 1.4;
                        color: #1a1a1a;
                        flex-grow: 1;
                        white-space: pre-wrap;
                    }
                    .message-signature {
                        font-family: 'Caveat', cursive;
                        font-size: 28px;
                        font-weight: 700;
                        text-align: right;
                        color: #B4533A;
                        margin-top: 20px;
                    }

                    /* Address side (Right) */
                    .address-side {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        position: relative;
                    }
                    
                    /* Stamp */
                    .stamp {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 25mm;
                        height: 30mm;
                        border: 2px dashed #B4533A;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #B4533A;
                        font-size: 10px;
                        text-transform: uppercase;
                        text-align: center;
                        opacity: 0.7;
                    }

                    /* Address lines */
                    .address-lines {
                        margin-top: 45mm; /* Below stamp */
                        display: flex;
                        flex-direction: column;
                        gap: 12mm;
                    }
                    .line {
                        border-bottom: 1px solid #999;
                        position: relative;
                    }
                    .line-content {
                        position: absolute;
                        bottom: 2px;
                        left: 0;
                        font-family: 'Playfair Display', serif;
                        font-size: 22px;
                        font-weight: 600;
                        color: #333;
                    }
                    .line-subtitle {
                        position: absolute;
                        bottom: 2px;
                        right: 0;
                        font-family: sans-serif;
                        font-size: 12px;
                        color: #888;
                        text-transform: uppercase;
                    }
                    
                    /* Postmark */
                    .postmark {
                        position: absolute;
                        top: 10mm;
                        right: 15mm;
                        width: 40mm;
                        height: 40mm;
                        border: 2px solid rgba(180, 83, 58, 0.4);
                        border-radius: 50%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        transform: rotate(-15deg);
                        color: rgba(180, 83, 58, 0.6);
                        font-family: sans-serif;
                        font-weight: bold;
                        font-size: 11px;
                        text-transform: uppercase;
                        z-index: 10;
                        pointer-events: none;
                    }
                    .postmark span {
                        font-size: 14px;
                        margin-top: 4px;
                    }
                    
                    /* Modern 2026 postcard — generated palette, motif and proportions */
                    body {
                        --primary: ${design.theme.primary};
                        --secondary: ${design.theme.secondary};
                        --accent: ${design.theme.accent};
                        --paper: ${design.theme.paper};
                        --ink: ${design.theme.ink};
                        --tilt: ${design.tilt}deg;
                        --shape-shift: ${design.shapeShift}mm;
                        font-family: 'DM Sans', sans-serif;
                        color: var(--ink);
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .photo-half {
                        position: relative;
                        isolation: isolate;
                        border: 0 !important;
                        background: var(--ink) !important;
                    }
                    .photo-half .photo-backdrop,
                    .photo-half .photo-main {
                        position: absolute;
                        inset: 0;
                        width: 100% !important;
                        height: 100% !important;
                    }
                    .photo-half .photo-backdrop {
                        z-index: -2;
                        object-fit: cover !important;
                        filter: blur(18px) saturate(1.15);
                        opacity: 0.72;
                        transform: scale(1.08);
                    }
                    .photo-half .photo-main {
                        z-index: -1;
                        object-fit: contain !important;
                        filter: drop-shadow(0 6px 18px rgba(0,0,0,.22));
                    }
                    .photo-shade {
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(180deg, rgba(17,24,39,.05) 55%, rgba(17,24,39,.72) 100%);
                    }
                    .photo-label {
                        position: absolute;
                        right: 10mm;
                        bottom: 8mm;
                        display: flex;
                        align-items: center;
                        gap: 3mm;
                        padding: 3mm 5mm;
                        border: 1px solid rgba(255,255,255,.35);
                        border-radius: 999px;
                        color: white;
                        background: rgba(17,24,39,.42);
                        backdrop-filter: blur(10px);
                        font-size: 11px;
                        font-weight: 600;
                        letter-spacing: .08em;
                        text-transform: uppercase;
                    }
                    .photo-label img {
                        position: static !important;
                        width: 8mm !important;
                        height: 8mm !important;
                        object-fit: contain !important;
                        filter: none !important;
                    }
                    .no-photo {
                        position: absolute;
                        inset: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        background: linear-gradient(135deg, var(--primary), var(--accent));
                    }
                    .no-photo h2 { margin: 0; font-size: 34px; }
                    .no-photo p { margin: 3mm 0 0; color: rgba(255,255,255,.85); }

                    .text-half {
                        position: relative;
                        isolation: isolate;
                        display: block;
                        overflow: hidden;
                        padding: 10mm 11mm 11mm;
                        color: var(--ink);
                        background-color: var(--paper);
                    }
                    .text-half[data-motif="orbits"] {
                        background-image: radial-gradient(circle at 8% 88%, transparent 0 17mm, color-mix(in srgb, var(--primary) 28%, transparent) 17.4mm 18mm, transparent 18.4mm), radial-gradient(circle at 95% 12%, color-mix(in srgb, var(--secondary) 28%, transparent) 0 23mm, transparent 23.4mm);
                    }
                    .text-half[data-motif="confetti"] {
                        background-image: radial-gradient(circle, color-mix(in srgb, var(--primary) 22%, transparent) 1.1mm, transparent 1.2mm), radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent) 1mm, transparent 1.1mm);
                        background-position: 0 0, 7mm 7mm;
                        background-size: 18mm 18mm;
                    }
                    .text-half[data-motif="arches"] {
                        background-image: repeating-radial-gradient(ellipse at 100% 100%, transparent 0 12mm, color-mix(in srgb, var(--primary) 15%, transparent) 12.5mm 13mm, transparent 13.5mm 22mm);
                    }
                    .text-half[data-motif="sunrise"] {
                        background-image: linear-gradient(155deg, transparent 0 68%, color-mix(in srgb, var(--secondary) 22%, transparent) 68.2% 69%, transparent 69.2%), radial-gradient(circle at 90% 95%, color-mix(in srgb, var(--primary) 22%, transparent) 0 25mm, transparent 25.5mm);
                    }
                    .shape {
                        position: absolute;
                        z-index: -1;
                        border-radius: 999px;
                        pointer-events: none;
                    }
                    .shape-one {
                        top: calc(-18mm + var(--shape-shift));
                        left: -16mm;
                        width: 55mm;
                        height: 55mm;
                        background: color-mix(in srgb, var(--secondary) 28%, transparent);
                    }
                    .shape-two {
                        right: -18mm;
                        bottom: calc(-22mm + var(--shape-shift));
                        width: 62mm;
                        height: 62mm;
                        border: 7mm solid color-mix(in srgb, var(--accent) 20%, transparent);
                    }
                    .postcard-heading {
                        height: 14mm;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 5mm;
                    }
                    .eyebrow {
                        display: flex;
                        align-items: center;
                        gap: 3mm;
                        color: var(--primary);
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: .12em;
                        text-transform: uppercase;
                    }
                    .eyebrow::before {
                        content: '';
                        width: 10mm;
                        height: 2px;
                        border-radius: 99px;
                        background: var(--primary);
                    }
                    .date-pill {
                        padding: 2.2mm 4mm;
                        border-radius: 999px;
                        background: color-mix(in srgb, var(--primary) 11%, white);
                        color: var(--primary);
                        font-size: 10px;
                        font-weight: 700;
                    }
                    .postcard-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 7mm;
                        height: 109mm;
                    }
                    .postcard-grid.message-wide { grid-template-columns: 1.12fr .88fr; }
                    .postcard-grid.address-wide { grid-template-columns: .9fr 1.1fr; }
                    .message-card,
                    .address-card {
                        position: relative;
                        box-sizing: border-box;
                        overflow: hidden;
                        border: 1px solid rgba(255,255,255,.75);
                        border-radius: 7mm;
                        background: rgba(255,255,255,.82);
                        box-shadow: 0 5mm 12mm rgba(38,51,61,.10);
                    }
                    .message-card {
                        display: flex;
                        flex-direction: column;
                        padding: 8mm 8mm 6mm;
                        transform: rotate(calc(var(--tilt) * .18));
                    }
                    .quote-mark {
                        height: 12mm;
                        color: var(--secondary);
                        font-family: 'Playfair Display', serif;
                        font-size: 54px;
                        font-weight: 600;
                        line-height: .75;
                    }
                    .message-content {
                        display: flex;
                        align-items: center;
                        flex: 1;
                        font-family: 'Caveat', cursive;
                        font-size: 25px;
                        font-weight: 600;
                        line-height: 1.25;
                        color: var(--ink);
                    }
                    .message-signature {
                        align-self: flex-end;
                        margin-top: 3mm;
                        padding: 2mm 4mm;
                        border-radius: 999px;
                        color: white;
                        background: var(--primary);
                        font-size: 21px;
                        line-height: 1;
                        transform: rotate(var(--tilt));
                    }
                    .address-card {
                        padding: 7mm;
                    }
                    .address-top {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        min-height: 31mm;
                    }
                    .brand-mark {
                        display: flex;
                        align-items: center;
                        gap: 3mm;
                        max-width: 44mm;
                        color: var(--ink);
                        font-size: 10px;
                        font-weight: 700;
                        line-height: 1.25;
                    }
                    .brand-mark img {
                        width: 12mm;
                        height: 12mm;
                        object-fit: contain;
                    }
                    .stamp-modern {
                        position: relative;
                        width: 24mm;
                        height: 29mm;
                        display: grid;
                        place-items: center;
                        border: 1.5px dashed var(--primary);
                        border-radius: 4mm;
                        color: var(--primary);
                        background: color-mix(in srgb, var(--primary) 7%, white);
                        font-size: 8px;
                        font-weight: 700;
                        letter-spacing: .1em;
                        text-transform: uppercase;
                    }
                    .stamp-modern::before {
                        content: '♥';
                        display: block;
                        color: var(--primary);
                        font-size: 17px;
                    }
                    .postmark-modern {
                        position: absolute;
                        top: 12mm;
                        right: 19mm;
                        width: 31mm;
                        height: 31mm;
                        display: grid;
                        place-items: center;
                        border: 1.5px solid color-mix(in srgb, var(--primary) 55%, transparent);
                        border-radius: 50%;
                        color: color-mix(in srgb, var(--primary) 72%, transparent);
                        font-size: 7px;
                        font-weight: 700;
                        line-height: 1.15;
                        text-align: center;
                        text-transform: uppercase;
                        transform: rotate(-13deg);
                    }
                    .recipient-label {
                        margin: 3mm 0 1.5mm;
                        color: var(--primary);
                        font-size: 9px;
                        font-weight: 700;
                        letter-spacing: .14em;
                        text-transform: uppercase;
                    }
                    .recipient-name {
                        margin: 0 0 4mm;
                        font-family: 'Playfair Display', serif;
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 1.1;
                    }
                    .address-details {
                        display: grid;
                        gap: 2.5mm;
                    }
                    .address-row {
                        padding-bottom: 2mm;
                        border-bottom: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
                    }
                    .address-row small {
                        display: block;
                        margin-bottom: .8mm;
                        color: color-mix(in srgb, var(--ink) 58%, transparent);
                        font-size: 7px;
                        font-weight: 700;
                        letter-spacing: .1em;
                        text-transform: uppercase;
                    }
                    .address-row strong {
                        font-family: 'Playfair Display', serif;
                        font-size: 14px;
                        font-weight: 600;
                    }
                    .design-name {
                        position: absolute;
                        right: 7mm;
                        bottom: 4mm;
                        color: color-mix(in srgb, var(--ink) 38%, transparent);
                        font-size: 6px;
                        font-weight: 700;
                        letter-spacing: .12em;
                        text-transform: uppercase;
                    }

                    @media print {
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <div class="photo-half">
                    ${message.photoUrl ? `
                        <img class="photo-backdrop" src="${safePhotoUrl}" alt="" aria-hidden="true" />
                        <img class="photo-main" src="${safePhotoUrl}" alt="Photo envoyée par la famille" />
                        <div class="photo-shade"></div>
                        <div class="photo-label">
                            <img src="/images/logo.png" alt="" />
                            Une pensée de ${safeSenderName}
                        </div>
                    ` : `
                        <div class="no-photo">
                            <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <h2>Une pensée pour vous</h2>
                            <p>Le Postier numérique de l’EHPAD de Crécy</p>
                        </div>
                    `}
                </div>
                
                <div class="text-half" data-motif="${design.motif}">
                    <div class="shape shape-one"></div>
                    <div class="shape shape-two"></div>
                    <div class="postcard-heading">
                        <div class="eyebrow">Une carte rien que pour vous</div>
                        <div class="date-pill">${formattedDate}</div>
                    </div>
                    <div class="postcard-grid ${design.layout}">
                        <section class="message-card">
                            <div class="quote-mark">“</div>
                            <div class="message-content">${safeMessage}</div>
                            <div class="message-signature">${safeSenderName}</div>
                        </section>
                        <section class="address-card">
                            <div class="address-top">
                                <div class="brand-mark">
                                    <img src="/images/logo.png" alt="Logo de l’EHPAD de Crécy" />
                                    <span>EHPAD public<br />de Crécy-la-Chapelle</span>
                                </div>
                                <div class="stamp-modern">Timbre</div>
                            </div>
                            <div class="postmark-modern">
                                EHPAD Crécy<br />${new Date(message.date).toLocaleDateString("fr-FR")}
                            </div>
                            <div class="recipient-label">Pour</div>
                            <h1 class="recipient-name">${safeResidentName}</h1>
                            <div class="address-details">
                                <div class="address-row">
                                    <small>${residentRoom ? "Chambre" : "Établissement"}</small>
                                    <strong>${safeResidentRoom}</strong>
                                </div>
                                <div class="address-row">
                                    <small>Adresse</small>
                                    <strong>18, rue de la Chapelle</strong>
                                </div>
                                <div class="address-row">
                                    <small>Ville</small>
                                    <strong>77580 Crécy-la-Chapelle</strong>
                                </div>
                            </div>
                            <div class="design-name">Collection ${design.theme.name} · 2026</div>
                        </section>
                    </div>
                </div>
                
                <script>
                    const imagePromises = Array.from(document.images).map(function(image) {
                        if (image.complete) return Promise.resolve();
                        return new Promise(function(resolve) {
                            image.addEventListener('load', resolve, { once: true });
                            image.addEventListener('error', resolve, { once: true });
                        });
                    });
                    Promise.all([document.fonts.ready].concat(imagePromises)).then(function() {
                        setTimeout(function() { window.print(); }, 350);
                    });
                </script>
            </body>
            </html>
        `;

        contentWindow.document.open();
        contentWindow.document.write(html);
        contentWindow.document.close();
        
        const removePrintFrame = () => {
            if (iframe.isConnected) iframe.remove();
        };
        contentWindow.addEventListener("afterprint", removePrintFrame, { once: true });
        // Filet de sécurité si le navigateur ne déclenche pas afterprint.
        setTimeout(() => {
            removePrintFrame();
        }, 60_000);
    };

    const unreadCount = messages.filter(m => m.status === "nouveau").length;

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-cream-200 overflow-hidden">
            <div className="bg-charcoal-50 p-6 md:p-8 border-b border-cream-200">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-charcoal-800 shadow-sm relative">
                        <Mail size={32} />
                        {unreadCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-terracotta-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
                                {unreadCount}
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left flex-grow">
                        <h2 className="font-serif text-2xl text-charcoal-900">Courrier des Familles</h2>
                        <p className="text-charcoal-600">Imprimez et distribuez les messages reçus pour les résidents.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8">
                {error && <div role="alert" className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

                {loading ? (
                    <div role="status" className="py-12 flex justify-center"><LoaderCircle aria-hidden="true" className="animate-spin text-terracotta-500" size={32} /><span className="sr-only">Chargement du courrier…</span></div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-charcoal-500">
                        <Mail size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun message reçu pour le moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Bulk Actions Header */}
                        <div className="flex items-center justify-between bg-cream-50 p-3 rounded-xl border border-cream-200">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-charcoal-700">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-cream-300 text-terracotta-600 focus:ring-terracotta-500"
                                    checked={selectedMessages.length === messages.length && messages.length > 0}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedMessages(messages.map(m => m.id));
                                        } else {
                                            setSelectedMessages([]);
                                        }
                                    }}
                                />
                                Tout sélectionner
                            </label>
                            
                            {selectedMessages.length > 0 && (
                                <button 
                                    onClick={handleDeleteSelected}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <Trash2 size={16} /> Supprimer la sélection ({selectedMessages.length})
                                </button>
                            )}
                        </div>

                        {messages.map(msg => {
                            const isNew = msg.status === "nouveau";
                            const isSelected = selectedMessages.includes(msg.id);
                            
                            return (
                                <div key={msg.id} className={`border rounded-2xl p-5 md:p-6 transition-colors relative ${isNew ? 'border-terracotta-200 bg-terracotta-50/30' : 'border-cream-200 bg-white opacity-70'} ${isSelected ? 'ring-2 ring-terracotta-500' : ''}`}>
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <input 
                                            type="checkbox" 
                                            aria-label={`Sélectionner le message pour ${getResidentName(msg.residentId)}`}
                                            className="w-5 h-5 rounded border-cream-300 text-terracotta-600 focus:ring-terracotta-500 cursor-pointer"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedMessages(prev => [...prev, msg.id]);
                                                } else {
                                                    setSelectedMessages(prev => prev.filter(id => id !== msg.id));
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 pr-8">
                                        
                                        {/* Image thumbnail if any */}
                                        <div className="md:w-1/4 flex-shrink-0">
                                            {msg.photoUrl ? (
                                                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-cream-100 shadow-sm relative">
                                                    <img
                                                        src={msg.photoUrl} 
                                                        alt={`Photo jointe au message de ${msg.senderName}`}
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            if (!target.src.includes('raw.githubusercontent.com')) {
                                                                target.src = `https://raw.githubusercontent.com/nyny77/ehpad-crecy/main/public${msg.photoUrl}`;
                                                            } else {
                                                                // If even GitHub raw fails, show a fallback icon
                                                                target.style.display = 'none';
                                                                target.parentElement!.innerHTML = '<div class="absolute inset-0 flex flex-col items-center justify-center text-cream-400 bg-cream-50"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="text-xs font-medium text-center px-2">Image en cours<br/>de traitement</span></div>';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ) : isNew ? (
                                                <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-cream-200 flex flex-col items-center justify-center text-cream-400 bg-white">
                                                    <ImageIcon size={32} className="mb-2" />
                                                    <span className="text-xs font-medium">Pas de photo</span>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-serif text-lg font-bold text-charcoal-900">
                                                            Pour {getResidentName(msg.residentId)} {getResidentRoom(msg.residentId)}
                                                        </h3>
                                                        {isNew && <span className="px-2 py-0.5 bg-terracotta-100 text-terracotta-700 text-xs font-bold rounded-full">Nouveau</span>}
                                                    </div>
                                                    <p className="text-sm text-charcoal-500">
                                                        Reçu le {new Date(msg.date).toLocaleDateString("fr-FR")} à {new Date(msg.date).toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                    <p className="text-sm font-medium text-terracotta-700 mt-1">
                                                        De la part de : {msg.senderName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-white border border-cream-200 rounded-xl p-4 text-charcoal-800 whitespace-pre-wrap mb-6 flex-grow shadow-sm text-sm">
                                                {msg.text}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                                                <div className="flex gap-2">
                                                    {isNew ? (
                                                        <>
                                                            <button 
                                                                onClick={() => handlePrint(msg)}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-800 text-white text-sm font-semibold rounded-lg hover:bg-charcoal-900 transition-colors"
                                                            >
                                                                <Printer size={16} /> Imprimer
                                                            </button>
                                                            <button 
                                                                onClick={() => handleMarkDistributed(msg.id)}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                                            >
                                                                <CheckCircle2 size={16} /> Marquer Distribué
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium px-2 py-1 bg-green-50 rounded-md">
                                                            <CheckCircle2 size={16} /> Déjà distribué (Image supprimée)
                                                        </span>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => handleDelete(msg.id)}
                                                    aria-label={`Supprimer le message de ${msg.senderName}`}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
