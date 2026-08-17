import React from "react";
import Image from "@/components/ui/OptimizedImage";
import { sanitizeContent } from "@/lib/sanitize";

interface GazetteBlock {
    id: string;
    type: "text" | "title" | "image" | "toc";
    content: string;
    url?: string;
    caption?: string;
    backgroundColor?: string;
}

interface GazetteRendererProps {
    title: string;
    date: string;
    blocks: GazetteBlock[];
    backgroundColor?: string;
}

export default function GazetteRenderer({ title, date, blocks, backgroundColor }: GazetteRendererProps) {
    const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="w-full max-w-[800px] mx-auto shadow-xl min-h-[1056px] relative text-charcoal-700 print:shadow-none print:w-full print:max-w-none print:p-0" style={{ backgroundColor: backgroundColor || '#FDF7F0' }}>
            {/* En-tête de la gazette */}
            <header className="bg-cream-100 border-b border-cream-200 p-8 text-center print:bg-white print:border-b-4 print:border-charcoal-900 print:mb-8">
                <div className="uppercase tracking-[0.2em] text-sm text-terracotta-600 font-bold mb-4 print:text-charcoal-600">
                    Journal de l'EHPAD de Crécy
                </div>
                <h1 
                    className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal-900 font-black mb-4 uppercase rich-text-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeContent(title) }}
                />
                <div className="inline-block border-t border-b border-charcoal-900 py-1 px-8">
                    <span className="italic text-charcoal-600 capitalize">Parution de {formattedDate}</span>
                </div>
            </header>

            {/* Corps du journal (style maçonnerie ou colonnes selon le print) */}
            <div className="p-8 md:p-12 print:p-0">
                <div className="prose prose-lg prose-charcoal max-w-none print:columns-2 print:gap-8 print:text-sm">
                    {blocks.map((block) => {
                        if (block.type === "toc") {
                            const titles = blocks.filter(b => b.type === "title");
                            if (titles.length === 0) return null;
                            
                            return (
                                <div 
                                    key={block.id} 
                                    className="my-10 p-6 md:p-8 border border-cream-200 rounded-2xl print:bg-white print:border-2 print:border-charcoal-900 print:rounded-none"
                                    style={{ backgroundColor: block.backgroundColor && block.backgroundColor !== '#ffffff' ? block.backgroundColor : '#FFFCF9' }}
                                >
                                    <h3 className="font-serif text-2xl text-charcoal-900 mb-6 uppercase tracking-wider text-center print:text-black">
                                        Au Sommaire
                                    </h3>
                                    <ul className="space-y-4 max-w-lg mx-auto">
                                        {titles.map((t, idx) => (
                                            <li key={t.id} className="flex items-baseline gap-4 text-charcoal-800 font-medium print:text-black">
                                                <span className="text-terracotta-500 font-bold shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                                                <span className="flex-grow border-b border-dotted border-charcoal-300 mr-2 relative top-[-4px]"></span>
                                                <span dangerouslySetInnerHTML={{ __html: sanitizeContent(t.content) }} className="rich-text-content inline-block" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        }

                        if (block.type === "title") {
                            return (
                                <h2 
                                    key={block.id} 
                                    className={`font-serif text-2xl md:text-3xl text-terracotta-700 mt-10 mb-4 print:text-charcoal-900 print:mt-6 print:break-after-avoid rich-text-content ${block.backgroundColor && block.backgroundColor !== '#ffffff' ? 'p-4 rounded-xl' : ''}`}
                                    style={block.backgroundColor && block.backgroundColor !== '#ffffff' ? { backgroundColor: block.backgroundColor } : undefined}
                                    dangerouslySetInnerHTML={{ __html: sanitizeContent(block.content) }}
                                />
                            );
                        }

                        if (block.type === "text") {
                            return (
                                <div 
                                    key={block.id} 
                                    className="mb-6 text-charcoal-700 print:text-black rich-text-content rounded-xl p-1"
                                    style={block.backgroundColor && block.backgroundColor !== '#ffffff' ? { backgroundColor: block.backgroundColor, padding: '1.5rem' } : undefined}
                                    dangerouslySetInnerHTML={{ __html: sanitizeContent(block.content) }}
                                />
                            );
                        }

                        if (block.type === "image" && block.url) {
                            const layout = (block as any).layout || "center";
                            
                            if (layout === "left" || layout === "right") {
                                return (
                                    <div key={block.id} className={`my-8 print:my-6 print:break-inside-avoid flex flex-col md:flex-row gap-6 items-start ${layout === "right" ? "md:flex-row-reverse" : ""}`}>
                                        <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-xl overflow-hidden shadow-md print:shadow-none print:rounded-none shrink-0">
                                            <Image
                                                src={block.url}
                                                alt="Illustration de la gazette"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2 text-charcoal-700 print:text-black rich-text-content">
                                            {block.caption ? (
                                                <div dangerouslySetInnerHTML={{ __html: sanitizeContent(block.caption) }} />
                                            ) : (
                                                <p className="italic text-charcoal-400">Ajoutez du texte à côté de l'image...</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            // Center layout (default)
                            return (
                                <figure 
                                    key={block.id} 
                                    className="my-8 print:my-6 print:break-inside-avoid"
                                >
                                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md print:shadow-none print:rounded-none">
                                        <Image
                                            src={block.url}
                                            alt={block.caption || "Illustration de la gazette"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {block.caption && (
                                        <figcaption className="text-center text-sm text-charcoal-500 italic mt-3 print:text-black">
                                            {block.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            );
                        }

                        return null;
                    })}
                </div>
            </div>
            
            {/* Pied de page pour l'impression */}
            <footer className="hidden print:block fixed bottom-0 left-0 right-0 text-center text-xs text-charcoal-500 border-t border-cream-200 pt-2 bg-white">
                Le Petit Écho du Cœur - {title} - Imprimé le {new Date().toLocaleDateString("fr-FR")}
            </footer>

            {/* Bouton d'impression (masqué à l'impression) */}
            <div className="bg-cream-50 p-6 border-t border-cream-200 flex justify-center print:hidden">
                <button 
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-terracotta-600 text-white rounded-full font-bold hover:bg-terracotta-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Imprimer la gazette
                </button>
            </div>
        </div>
    );
}
