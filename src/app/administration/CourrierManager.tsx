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

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce message définitivement ?")) return;
        try {
            await adminFetch("/.netlify/functions/admin-messages", {
                method: "POST",
                body: JSON.stringify({ action: "delete", id })
            });
            setMessages(messages.filter(m => m.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
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
        
        const photoHtml = message.photoUrl 
            ? `<div style="text-align:center; margin-bottom: 2rem;">
                 <img src="${message.photoUrl}" style="max-width:100%; max-height:400px; border-radius:12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
               </div>`
            : "";
            
        const dateStr = new Date(message.date).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Message pour ${residentName}</title>
                <style>
                    body { font-family: 'Georgia', serif; color: #333; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #eee; }
                    .header h1 { margin: 0; color: #B4533A; font-size: 28px; }
                    .header p { margin: 5px 0 0 0; color: #666; font-family: sans-serif; }
                    .content { font-size: 20px; white-space: pre-wrap; padding: 20px; background: #faf9f6; border-radius: 12px; border: 1px solid #eae5d9; }
                    .footer { margin-top: 40px; text-align: right; font-style: italic; font-size: 22px; color: #B4533A; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Pour ${residentName} ${residentRoom}</h1>
                    <p>Reçu le ${dateStr}</p>
                </div>
                ${photoHtml}
                <div class="content">${message.text}</div>
                <div class="footer">De la part de : ${message.senderName}</div>
                <script>
                    window.onload = function() { window.print(); }
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
                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

                {loading ? (
                    <div className="py-12 flex justify-center"><LoaderCircle className="animate-spin text-terracotta-500" size={32} /></div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-charcoal-500">
                        <Mail size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucun message reçu pour le moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map(msg => {
                            const isNew = msg.status === "nouveau";
                            return (
                                <div key={msg.id} className={`border rounded-2xl p-5 md:p-6 transition-colors ${isNew ? 'border-terracotta-200 bg-terracotta-50/30' : 'border-cream-200 bg-white opacity-70'}`}>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        
                                        {/* Image thumbnail if any */}
                                        <div className="md:w-1/4 flex-shrink-0">
                                            {msg.photoUrl ? (
                                                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-cream-100 shadow-sm">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={msg.photoUrl} alt="Photo" className="w-full h-full object-cover" />
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
