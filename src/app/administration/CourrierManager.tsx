import { useState, useEffect } from "react";
import { Mail, CheckCircle2, Trash2, LoaderCircle, Printer, Image as ImageIcon } from "lucide-react";
import type { FamilyMessage } from "../../../netlify/functions/famille-send-message";
import type { Resident } from "../../../netlify/functions/admin-residents";
import { adminFetch } from "@/lib/admin-api";

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
            await adminFetch("/.netlify/functions/admin-messages", {
                method: "POST",
                body: JSON.stringify({ action: "markDistributed", id })
            });
            setMessages(messages.map(m => m.id === id ? { ...m, status: "distribue", photoUrl: null } : m));
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
                <title>Carte Postale pour ${residentName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
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
                    
                    @media print {
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <div class="photo-half">
                    ${message.photoUrl ? `
                        <img src="${message.photoUrl}" alt="Photo de la famille" onerror="this.src='https://raw.githubusercontent.com/nyny77/ehpad-crecy/main/public${message.photoUrl}'"/>
                    ` : `
                        <div class="no-photo">
                            <h2>Le Postier Numérique</h2>
                            <p>EHPAD de Crécy-la-Chapelle</p>
                            <div style="margin-top: 20px;">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B4533A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </div>
                        </div>
                    `}
                </div>
                
                <div class="text-half">
                    <div class="message-side">
                        <div class="message-content">${message.text}</div>
                        <div class="message-signature">${message.senderName}</div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="address-side">
                        <img src="/images/logo.png" style="height: 45px; position: absolute; top: 0; left: 0; opacity: 0.9;" alt="Logo EHPAD" />
                        <div class="stamp">Timbre</div>
                        <div class="postmark">
                            EHPAD CRÉCY
                            <span>${new Date(message.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                        
                        <div class="address-lines">
                            <div class="line">
                                <span class="line-content">${residentName}</span>
                                <span class="line-subtitle">Résident</span>
                            </div>
                            <div class="line">
                                <span class="line-content">${residentRoom || "EHPAD de Crécy-la-Chapelle"}</span>
                                <span class="line-subtitle">${residentRoom ? 'Chambre' : 'Établissement'}</span>
                            </div>
                            <div class="line">
                                <span class="line-content">18, rue de la Chapelle</span>
                            </div>
                            <div class="line">
                                <span class="line-content">77580 Crécy-la-Chapelle</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <script>
                    document.fonts.ready.then(function() {
                        setTimeout(() => { window.print(); }, 500);
                    });
                </script>
            </body>
            </html>
        `;

        contentWindow.document.open();
        contentWindow.document.write(html);
        contentWindow.document.close();
        
        // Remove iframe after print dialog closes
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 5000);
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
