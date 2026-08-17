"use client";

import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { FileUp, LoaderCircle, Plus, Trash2, Image as ImageIcon, Type, Heading1, List, Search, Sparkles, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-api";
import gazetteData from "@/lib/data/gazette.json";
import GazetteRenderer from "@/components/gazette/GazetteRenderer";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { processGazetteImage } from "@/lib/image-processing";
import { sanitizeContent } from "@/lib/sanitize";
function encodeBlobBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result)); // Garder le data:image/... pour le bloc
        reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
        reader.readAsDataURL(blob);
    });
}

function encodeBlobBase64Raw(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
        reader.readAsDataURL(blob);
    });
}

type BlockType = "text" | "title" | "image" | "toc";

interface Block {
    id: string;
    type: BlockType;
    content: string;
    caption?: string;
    base64?: string; // used temporarily for upload
    backgroundColor?: string;
}

export default function GazetteManager() {
    const [mode, setMode] = useState<"list" | "editor" | "pdf" | "preview">("list");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    
    const [title, setTitle] = useState("");
    const [pageBackgroundColor, setPageBackgroundColor] = useState("#FDF7F0");
    const [blocks, setBlocks] = useState<Block[]>([]);
    
    // Image Search State
    const [imageSearchBlockId, setImageSearchBlockId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const imageSearchOpenerRef = useRef<HTMLElement | null>(null);

    // AI illustration state
    const [aiImageBlockId, setAiImageBlockId] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiImagePreview, setAiImagePreview] = useState("");
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [aiError, setAiError] = useState("");
    const aiImageOpenerRef = useRef<HTMLElement | null>(null);

    const closeImageSearch = () => {
        setImageSearchBlockId(null);
        setSearchResults([]);
        setSearchQuery("");
        setHasSearched(false);
        window.setTimeout(() => imageSearchOpenerRef.current?.focus(), 0);
    };

    const openImageSearch = (blockId: string) => {
        imageSearchOpenerRef.current = document.activeElement as HTMLElement | null;
        setImageSearchBlockId(blockId);
    };

    const closeAiImage = () => {
        if (isGeneratingAi) return;
        setAiImageBlockId(null);
        setAiPrompt("");
        setAiImagePreview("");
        setAiError("");
        window.setTimeout(() => aiImageOpenerRef.current?.focus(), 0);
    };

    const openAiImage = (blockId: string) => {
        aiImageOpenerRef.current = document.activeElement as HTMLElement | null;
        setAiImageBlockId(blockId);
        setAiPrompt("");
        setAiImagePreview("");
        setAiError("");
    };

    const handleAiImageDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeAiImage();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const handleImageSearchDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeImageSearch();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const initialGazettes = (gazetteData as any).gazettes || ((gazetteData as any).file ? [{ title: "Dernière parution", file: (gazetteData as any).file }] : []);
    const [gazettes, setGazettes] = useState<any[]>(initialGazettes);

    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: Date.now().toString(), type, content: "", backgroundColor: "#ffffff" }]);
    };

    const updateBlock = (id: string, field: string, value: string) => {
        setBlocks(prevBlocks => prevBlocks.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleImageUpload = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const optimized = await processGazetteImage(file);
            const encoded = await encodeBlobBase64(optimized);
            updateBlock(id, "content", encoded);
            updateBlock(id, "base64", encoded);
            setMessage(null);
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Cette image ne peut pas être ajoutée." });
        } finally {
            e.target.value = "";
        }
    };

    const fetchJsonp = (url: string) => {
        return new Promise<any>((resolve, reject) => {
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            (window as any)[callbackName] = (data: any) => {
                delete (window as any)[callbackName];
                document.body.removeChild(script);
                resolve(data);
            };
            const script = document.createElement('script');
            script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'format=json&jsoncallback=' + callbackName;
            script.onerror = () => {
                delete (window as any)[callbackName];
                document.body.removeChild(script);
                reject(new Error('JSONP failed'));
            };
            document.body.appendChild(script);
        });
    };

    const handleImageSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setHasSearched(true);
        setSearchResults([]);

        try {
            // Using Flickr Public API with JSONP to completely bypass CORS
            const url = `https://www.flickr.com/services/feeds/photos_public.gne?tags=${encodeURIComponent(searchQuery)}`;
            const data = await fetchJsonp(url);
            
            if (data.items && data.items.length > 0) {
                const results = data.items.map((p: any, idx: number) => {
                    // Flickr returns _m.jpg (240px thumbnail). We replace it with _c.jpg for 800px.
                    const bigUrl = p.media?.m ? p.media.m.replace('_m.jpg', '_c.jpg') : '';
                    return {
                        id: `flickr-${idx}`,
                        url: bigUrl || p.media?.m,
                        title: p.title || searchQuery
                    };
                }).filter((r: any) => r.url);
                setSearchResults(results.slice(0, 20)); // keep top 20 results
            } else {
                setSearchResults([]);
            }
        } catch (e) {
            console.error("Erreur Flickr:", e);
        }
        setIsSearching(false);
    };

    const selectImageResult = (url: string) => {
        if (imageSearchBlockId) {
            updateBlock(imageSearchBlockId, "content", url);
            updateBlock(imageSearchBlockId, "base64", ""); // clear base64 so backend treats it as URL
            closeImageSearch();
        }
    };

    const generateAiImage = async () => {
        if (aiPrompt.trim().length < 3 || isGeneratingAi) return;
        setIsGeneratingAi(true);
        setAiError("");
        setAiImagePreview("");

        try {
            const result = await adminFetch<{ imageBase64: string; label: string }>("/.netlify/functions/ai-image", {
                method: "POST",
                body: JSON.stringify({ prompt: aiPrompt.trim() }),
            });
            setAiImagePreview(result.imageBase64);
        } catch (error) {
            setAiError(error instanceof Error ? error.message : "La génération a échoué.");
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const selectAiImage = () => {
        if (!aiImageBlockId || !aiImagePreview) return;
        const block = blocks.find(item => item.id === aiImageBlockId);
        updateBlock(aiImageBlockId, "content", aiImagePreview);
        updateBlock(aiImageBlockId, "base64", aiImagePreview);
        if (!block?.caption?.trim()) {
            updateBlock(aiImageBlockId, "caption", "Illustration générée par IA");
        }
        closeAiImage();
    };



    const publishGeneratedGazette = async () => {
        if (!title.trim()) {
            setMessage({ type: "error", text: "Veuillez donner un titre à la gazette." });
            setMode("editor");
            return;
        }
        if (blocks.length === 0) {
            setMessage({ type: "error", text: "La gazette est vide." });
            setMode("editor");
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            await adminFetch("/.netlify/functions/admin-gazette-generate", {
                method: "POST",
                body: JSON.stringify({ title, content: blocks, pageBackgroundColor }),
            });
            // Update local state naively
            setGazettes([{ title, type: "generated", date: new Date().toISOString() }, ...gazettes]);
            setMode("list");
            setBlocks([]);
            setTitle("");
            setMessage({ type: "success", text: "Gazette générée avec succès ! Elle sera visible d'ici 2 à 3 minutes." });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Création impossible (êtes-vous sur 'netlify dev' ?)" });
        } finally {
            setUploading(false);
        }
    };

    const selectPdfFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (file.type !== "application/pdf") {
            setMessage({ type: "error", text: "Veuillez sélectionner un fichier PDF." });
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: "error", text: "Le fichier ne doit pas dépasser 10 Mo." });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const fileBase64 = await encodeBlobBase64Raw(file);
            const result = await adminFetch<{ path: string }>("/.netlify/functions/admin-gazette", {
                method: "POST",
                body: JSON.stringify({ fileName: file.name, fileBase64, title: title || "Nouvelle gazette" }),
            });
            setGazettes([{ title: title || "Nouvelle gazette", file: result.path, type: "pdf", date: new Date().toISOString() }, ...gazettes]);
            setTitle("");
            setPageBackgroundColor("#FDF7F0");
            setMode("list");
            setMessage({ type: "success", text: "Gazette PDF publiée avec succès." });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Envoi impossible (êtes-vous sur 'netlify dev' ?)" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <section className="space-y-8">
            <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 md:p-8">
                {message && <div role={message.type === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-xl p-4 border mb-6 ${message.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}>{message.text}</div>}

                {mode === "list" && (
                    <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="font-serif text-3xl text-charcoal-900">Le Petit Echo du Coeur</h2>
                                <p className="text-charcoal-600 mt-1">Gérez le journal de l'établissement</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setMode("pdf")} className="px-5 py-3 rounded-full font-semibold border border-cream-300 bg-white text-charcoal-700 hover:bg-cream-50 transition-colors">
                                    Uploader un PDF (Ancien)
                                </button>
                                <button onClick={() => setMode("editor")} className="px-5 py-3 rounded-full font-semibold bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors flex items-center gap-2">
                                    <Plus size={20} /> Créer une Gazette
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-charcoal-900 mb-4">Gazettes actuellement en ligne</h3>
                            {gazettes.length > 0 ? (
                                <div className="space-y-3">
                                    {gazettes.map((g, i) => (
                                        <div key={i} className="bg-cream-50 rounded-2xl p-4 border border-cream-200 flex items-center justify-between gap-4">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-charcoal-900 font-medium flex items-center gap-2">
                                                    <span dangerouslySetInnerHTML={{ __html: sanitizeContent(g.title || "") }} className="inline-block rich-text-content-inline" /> 
                                                    {g.type === "generated" && <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">Générée</span>}
                                                    {(!g.type || g.type === "pdf") && <span className="text-xs bg-cream-200 text-charcoal-600 px-2 py-0.5 rounded-full">PDF</span>}
                                                </span>
                                                {g.date && <span className="text-charcoal-500 text-sm mt-1">{new Date(g.date).toLocaleDateString("fr-FR")}</span>}
                                            </div>
                                            <a href="/echo-du-coeur" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm bg-white border border-cream-300 rounded-full hover:bg-cream-100 text-charcoal-700 font-semibold flex-shrink-0">Consulter</a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-charcoal-500 italic">Aucune gazette en ligne.</p>
                            )}
                        </div>
                    </>
                )}

                {mode === "pdf" && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <button onClick={() => setMode("list")} className="text-sm font-medium text-charcoal-500 hover:text-charcoal-800 mb-4 inline-block">← Retour</button>
                        <div>
                            <h2 className="font-serif text-2xl text-charcoal-900">Publier un PDF</h2>
                            <p className="text-charcoal-600 mt-1">Utilisez cette option si vous avez déjà créé la gazette sur Word/Publisher.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Titre (ex: Février 2026)"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                disabled={uploading}
                                className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                            />
                            <label className={`w-full cursor-pointer flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors ${uploading ? 'border-cream-300 bg-cream-50 text-charcoal-400' : 'border-terracotta-300 bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700'}`}>
                                {uploading ? <LoaderCircle size={32} className="animate-spin mb-3" /> : <FileUp size={32} className="mb-3" />}
                                <span className="font-semibold text-lg">{uploading ? "Publication en cours…" : "Sélectionner le PDF"}</span>
                                <span className="text-sm mt-1 opacity-80">10 Mo maximum</span>
                                <input disabled={uploading} type="file" accept="application/pdf" onChange={selectPdfFile} className="sr-only" />
                            </label>
                        </div>
                    </div>
                )}

                {mode === "editor" && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setMode("list")} className="text-sm font-medium text-charcoal-500 hover:text-charcoal-800">← Retour</button>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        if (confirm("Voulez-vous vraiment tout effacer ?")) {
                                            setBlocks([]);
                                            setTitle("");
                                            setPageBackgroundColor("#FDF7F0");
                                        }
                                    }} 
                                    className="px-4 py-2.5 rounded-full font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                >
                                    Tout effacer
                                </button>
                                <button onClick={() => setMode("preview")} className="px-5 py-2.5 rounded-full font-semibold border border-cream-300 bg-white text-charcoal-700 hover:bg-cream-50 transition-colors">
                                    Aperçu final
                                </button>
                                <button onClick={publishGeneratedGazette} disabled={uploading} className="px-5 py-2.5 rounded-full font-semibold bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors flex items-center gap-2">
                                    {uploading ? <LoaderCircle size={18} className="animate-spin" /> : <FileUp size={18} />}
                                    {uploading ? "Publication..." : "Publier la gazette"}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start">
                            <div className="flex-grow flex flex-col gap-2">
                                <span className="text-sm font-bold uppercase tracking-wider text-charcoal-500 pl-2">Nom de la Gazette</span>
                                <RichTextEditor
                                    value={title}
                                    onChange={setTitle}
                                    placeholder="Titre de la gazette (ex: Le Petit Écho du Cœur - Mars 2026)"
                                />
                            </div>
                            <div className="flex flex-col gap-1 shrink-0 bg-white p-3 border border-cream-200 rounded-xl">
                                <span className="text-sm font-medium text-charcoal-700">Couleur de fond du journal :</span>
                                <input 
                                    type="color" 
                                    value={pageBackgroundColor} 
                                    onChange={(e) => setPageBackgroundColor(e.target.value)}
                                    className="w-full h-8 cursor-pointer rounded border-0 p-0"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {blocks.map((block, index) => (
                                <div key={block.id} className="relative group bg-white border border-cream-200 rounded-2xl p-4 shadow-sm hover:border-terracotta-300 transition-colors flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-terracotta-600 border-b border-cream-100 pb-2 mb-1">
                                        {block.type === "title" && <Heading1 size={18} />}
                                        {block.type === "text" && <Type size={18} />}
                                        {block.type === "image" && <ImageIcon size={18} />}
                                        {block.type === "toc" && <List size={18} />}
                                        <span className="text-sm font-bold uppercase tracking-wider">
                                            {block.type === "title" ? "Gros Titre" : block.type === "text" ? "Paragraphe" : block.type === "image" ? "Photo" : "Sommaire Automatique"}
                                        </span>
                                    </div>
                                    
                                    <div className="absolute -right-3 -top-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                        <button onClick={() => removeBlock(block.id)} className="w-full h-full flex items-center justify-center" title="Supprimer">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className="absolute -left-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 flex flex-col bg-white border border-cream-200 rounded-xl overflow-hidden p-1 gap-1">
                                        <div className="flex flex-col items-center gap-1 p-1">
                                            <span className="text-[10px] uppercase font-bold text-charcoal-400">Fond</span>
                                            <input 
                                                type="color" 
                                                value={block.backgroundColor || "#ffffff"} 
                                                onChange={(e) => updateBlock(block.id, "backgroundColor", e.target.value)}
                                                className="w-6 h-6 cursor-pointer rounded border-0 p-0"
                                                title="Couleur de fond du bloc"
                                            />
                                        </div>
                                    </div>

                                    {block.type === "toc" && (
                                        <div className="p-4 bg-cream-50 rounded-xl flex items-center gap-4 text-charcoal-600">
                                            <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center shrink-0">
                                                <List size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm">Ce bloc listera automatiquement tous les Gros Titres de votre gazette.</p>
                                            </div>
                                        </div>
                                    )}

                                    {block.type === "title" && (
                                        <RichTextEditor
                                            value={block.content}
                                            onChange={val => updateBlock(block.id, "content", val)}
                                            placeholder="Gros Titre..."
                                        />
                                    )}

                                    {block.type === "text" && (
                                        <RichTextEditor
                                            value={block.content}
                                            onChange={val => updateBlock(block.id, "content", val)}
                                            placeholder="Rédigez votre paragraphe ici (utilisez la barre d'outils pour la mise en forme)..."
                                        />
                                    )}

                                    {block.type === "image" && (
                                        <div className="space-y-3">
                                            {block.content ? (
                                                <div className="relative rounded-xl overflow-hidden bg-cream-100 aspect-video flex items-center justify-center">
                                                    <img src={block.content} alt="Aperçu" className="max-w-full max-h-[300px] object-contain" />
                                                    <button onClick={() => updateBlock(block.id, "content", "")} className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-charcoal-700 rounded-full backdrop-blur shadow-sm transition-colors" title="Changer d'image">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-2 border-dashed border-cream-300 rounded-xl bg-cream-50">
                                                    <div className="flex-1 flex flex-col items-center justify-center px-4 md:border-r border-cream-300">
                                                        <label className="cursor-pointer flex flex-col items-center hover:text-terracotta-600 transition-colors text-charcoal-500">
                                                            <ImageIcon size={32} className="mb-2" />
                                                            <span className="font-medium text-center">Ajouter une photo<br/><span className="text-sm font-normal">(Votre ordi)</span></span>
                                                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleImageUpload(block.id, e)} className="sr-only" />
                                                        </label>
                                                    </div>
                                                    
                                                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                                                        <button 
                                                            type="button"
                                                            onClick={() => openImageSearch(block.id)}
                                                            className="flex flex-col items-center hover:text-terracotta-600 transition-colors text-charcoal-500"
                                                        >
                                                            <Search size={32} className="mb-2" />
                                                            <span className="font-medium text-center">Chercher image<br/><span className="text-sm font-normal">(Banque photo libre)</span></span>
                                                        </button>
                                                    </div>

                                                    <div className="flex-1 flex flex-col items-center justify-center px-4 md:border-l border-cream-300">
                                                        <button
                                                            type="button"
                                                            onClick={() => openAiImage(block.id)}
                                                            className="flex flex-col items-center hover:text-terracotta-600 transition-colors text-charcoal-500"
                                                        >
                                                            <Sparkles size={32} className="mb-2" />
                                                            <span className="font-medium text-center">Générer une image<br/><span className="text-sm font-normal">(Intelligence artificielle)</span></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="flex gap-4 items-start pt-2">
                                                <select
                                                    value={(block as any).layout || "center"}
                                                    onChange={e => updateBlock(block.id, "layout", e.target.value)}
                                                    className="px-3 py-2 border border-cream-300 rounded-xl bg-cream-50 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                                                >
                                                    <option value="center">Image grande (Légende dessous)</option>
                                                    <option value="left">Image à gauche (Texte à droite)</option>
                                                    <option value="right">Image à droite (Texte à gauche)</option>
                                                </select>
                                            </div>

                                            {((block as any).layout === "left" || (block as any).layout === "right") ? (
                                                <RichTextEditor
                                                    value={block.caption || ""}
                                                    onChange={val => updateBlock(block.id, "caption", val)}
                                                    placeholder="Rédigez le texte qui apparaîtra à côté de l'image..."
                                                />
                                            ) : (
                                                <textarea
                                                    placeholder="Légende de l'image (optionnel)"
                                                    value={block.caption || ""}
                                                    onChange={e => updateBlock(block.id, "caption", e.target.value)}
                                                    rows={1}
                                                    className="w-full border-none bg-transparent focus:ring-0 px-0 resize-y text-sm text-charcoal-600 italic"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-center flex-wrap gap-3 pt-6">
                                <button onClick={() => addBlock("toc")} className="px-4 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-700 hover:bg-cream-100 flex items-center gap-2 font-medium text-sm">
                                    <List size={16} /> Sommaire
                                </button>
                                <button onClick={() => addBlock("title")} className="px-4 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-700 hover:bg-cream-100 flex items-center gap-2 font-medium text-sm">
                                    <Heading1 size={16} /> Titre
                                </button>
                                <button onClick={() => addBlock("text")} className="px-4 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-700 hover:bg-cream-100 flex items-center gap-2 font-medium text-sm">
                                    <Type size={16} /> Paragraphe
                                </button>
                                <button onClick={() => addBlock("image")} className="px-4 py-2 rounded-xl border border-cream-300 bg-white text-charcoal-700 hover:bg-cream-100 flex items-center gap-2 font-medium text-sm">
                                    <ImageIcon size={16} /> Photo
                                </button>
                            </div>
                        </div>

                        {/* Image Search Modal Modal/Overlay */}
                        {imageSearchBlockId && (
                            <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                                <div role="dialog" aria-modal="true" aria-labelledby="image-search-title" onKeyDown={handleImageSearchDialogKeyDown} className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                                    <div className="p-4 border-b border-cream-200 flex items-center justify-between bg-cream-50">
                                        <h3 id="image-search-title" className="font-serif text-xl text-charcoal-900 font-bold flex items-center gap-2">
                                            <Search size={20} className="text-terracotta-500" />
                                            Recherche d'illustrations libres de droits
                                        </h3>
                                        <button aria-label="Fermer la recherche d’illustrations" onClick={closeImageSearch} className="p-2 hover:bg-cream-200 rounded-full text-charcoal-500 transition-colors">
                                            <X aria-hidden="true" size={20} />
                                        </button>
                                    </div>
                                    <div className="p-6 overflow-y-auto flex-grow bg-white">
                                        <div className="flex gap-2 mb-6">
                                            <input 
                                                type="text" 
                                                aria-label="Rechercher une illustration"
                                                placeholder="Que cherchez-vous ? (ex: Sapin de Noël enneigé, Gâteau d'anniversaire...)" 
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleImageSearch()}
                                                className="flex-grow px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 text-charcoal-900"
                                                autoFocus
                                            />
                                            <button 
                                                onClick={handleImageSearch} 
                                                disabled={isSearching || !searchQuery.trim()}
                                                className="px-6 py-3 bg-terracotta-600 text-white font-semibold rounded-xl hover:bg-terracotta-700 transition-colors flex items-center justify-center min-w-[140px]"
                                            >
                                                {isSearching ? <LoaderCircle size={20} className="animate-spin" /> : "Chercher"}
                                            </button>
                                        </div>

                                        {!isSearching && searchResults.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {searchResults.map((res) => (
                                                    <button 
                                                        key={res.id} 
                                                        onClick={() => selectImageResult(res.url)}
                                                        className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-cream-100 border-2 border-transparent hover:border-terracotta-500 transition-all focus:outline-none focus:ring-4 focus:ring-terracotta-200 shadow-sm"
                                                        title={res.title}
                                                    >
                                                        <img src={res.url} alt={res.title || "Illustration"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                                                            <span className="text-white text-xs font-medium text-center px-2 py-1 bg-charcoal-900/50 rounded-full backdrop-blur-sm shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">Choisir image</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {!isSearching && searchResults.length === 0 && hasSearched && (
                                            <div className="py-12 text-center text-charcoal-500 flex flex-col items-center">
                                                <ImageIcon size={48} className="mb-4 text-cream-300" />
                                                <p className="text-lg">Aucun résultat trouvé pour "{searchQuery}".</p>
                                                <p className="text-sm mt-1">Essayez d'autres mots-clés simples.</p>
                                            </div>
                                        )}
                                        
                                        {!isSearching && searchResults.length === 0 && !hasSearched && (
                                            <div className="py-12 text-center text-charcoal-400 flex flex-col items-center">
                                                <Search size={48} className="mb-4 text-cream-200" />
                                                <p className="font-medium text-charcoal-600">Recherchez de belles photos libres de droits</p>
                                                <p className="text-sm mt-1">Tapez des mots simples : "Chat", "Automne", "Anniversaire"...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {aiImageBlockId && (
                            <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                                <div
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="ai-image-title"
                                    aria-describedby="ai-image-help"
                                    aria-busy={isGeneratingAi}
                                    onKeyDown={handleAiImageDialogKeyDown}
                                    className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                                >
                                    <div className="p-4 border-b border-cream-200 flex items-center justify-between bg-cream-50">
                                        <h3 id="ai-image-title" className="font-serif text-xl text-charcoal-900 font-bold flex items-center gap-2">
                                            <Sparkles size={20} className="text-terracotta-500" />
                                            Créer une illustration avec l'IA
                                        </h3>
                                        <button
                                            type="button"
                                            aria-label="Fermer la génération d’image"
                                            onClick={closeAiImage}
                                            disabled={isGeneratingAi}
                                            className="p-2 hover:bg-cream-200 rounded-full text-charcoal-500 transition-colors disabled:opacity-40"
                                        >
                                            <X aria-hidden="true" size={20} />
                                        </button>
                                    </div>

                                    <div className="p-6 overflow-y-auto flex-grow min-h-0 space-y-5">
                                        <p id="ai-image-help" className="text-charcoal-600">
                                            Décrivez simplement l'illustration souhaitée. N'indiquez aucun nom de résident ni aucune information personnelle.
                                        </p>

                                        <form
                                            onSubmit={(event) => {
                                                event.preventDefault();
                                                generateAiImage();
                                            }}
                                            className="space-y-3"
                                        >
                                            <label htmlFor="ai-image-prompt" className="block font-semibold text-charcoal-800">
                                                Description de l'image
                                            </label>
                                            <textarea
                                                id="ai-image-prompt"
                                                value={aiPrompt}
                                                onChange={(event) => setAiPrompt(event.target.value)}
                                                placeholder="Exemple : un bouquet de fleurs de printemps sur une table, ambiance chaleureuse"
                                                minLength={3}
                                                maxLength={500}
                                                rows={3}
                                                disabled={isGeneratingAi}
                                                autoFocus
                                                className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 text-charcoal-900 resize-y disabled:bg-cream-50"
                                            />
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <span className="text-sm text-charcoal-500">{aiPrompt.length}/500 caractères · une image par génération</span>
                                                <button
                                                    type="submit"
                                                    disabled={isGeneratingAi || aiPrompt.trim().length < 3}
                                                    className="px-6 py-3 bg-terracotta-600 text-white font-semibold rounded-xl hover:bg-terracotta-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isGeneratingAi ? <LoaderCircle size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                                    {isGeneratingAi ? "Création en cours…" : aiImagePreview ? "Générer une autre image" : "Générer l'image"}
                                                </button>
                                            </div>
                                        </form>

                                        {aiError && (
                                            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                                                {aiError}
                                            </div>
                                        )}

                                        {isGeneratingAi && (
                                            <div role="status" className="rounded-xl bg-cream-50 p-8 text-center text-charcoal-600">
                                                <LoaderCircle size={36} className="animate-spin mx-auto mb-3 text-terracotta-600" />
                                                Cloudflare prépare votre illustration. Cela peut prendre quelques secondes.
                                            </div>
                                        )}

                                        {!isGeneratingAi && aiImagePreview && (
                                            <div className="space-y-4">
                                                <div className="rounded-xl overflow-hidden bg-cream-100 flex justify-center">
                                                    <img src={aiImagePreview} alt="Aperçu de l’illustration générée" className="max-h-[360px] w-auto object-contain" />
                                                </div>
                                                <p className="text-sm text-charcoal-600 text-center">Mention ajoutée automatiquement : « Illustration générée par IA »</p>
                                            </div>
                                        )}
                                    </div>

                                    {!isGeneratingAi && aiImagePreview && (
                                        <div className="flex-shrink-0 border-t border-cream-200 bg-white p-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 shadow-[0_-8px_24px_rgba(30,30,30,0.08)]">
                                            <button
                                                type="button"
                                                onClick={() => setAiImagePreview("")}
                                                className="px-6 py-3 border border-charcoal-300 bg-white text-charcoal-800 font-semibold rounded-xl hover:bg-cream-50 transition-colors"
                                            >
                                                Ne pas garder
                                            </button>
                                            <button
                                                type="button"
                                                onClick={selectAiImage}
                                                className="px-6 py-3 min-w-[250px] bg-terracotta-600 !text-white border border-terracotta-600 font-semibold rounded-xl hover:bg-terracotta-700 transition-colors shadow-sm"
                                            >
                                                Garder et importer dans l'éditeur
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {mode === "preview" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
                            <button onClick={() => setMode("editor")} className="text-sm font-medium text-charcoal-500 hover:text-charcoal-800">← Retour à l'édition</button>
                            <button onClick={publishGeneratedGazette} disabled={uploading} className="px-5 py-2.5 rounded-full font-semibold bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors flex items-center gap-2">
                                {uploading ? <LoaderCircle size={18} className="animate-spin" /> : <FileUp size={18} />}
                                {uploading ? "Publication..." : "Publier la gazette"}
                            </button>
                        </div>
                        <div className="bg-cream-50 rounded-2xl p-4 md:p-8 overflow-x-auto">
                            <GazetteRenderer 
                                title={title || "Titre de la gazette"} 
                                date={new Date().toISOString()} 
                                blocks={blocks.map(b => ({...b, url: b.content})) as any} 
                                backgroundColor={pageBackgroundColor}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
