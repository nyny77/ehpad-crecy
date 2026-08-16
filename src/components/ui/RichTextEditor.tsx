"use client";

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update if it's completely empty to avoid overwriting while typing, 
            // or if it's the initial load.
            if (!editorRef.current.innerHTML || value === "") {
                editorRef.current.innerHTML = value || "";
            }
        }
    }, [value]);

    const execCmd = (cmd: string, arg?: string) => {
        // Prevent default to keep focus on the editor
        document.execCommand(cmd, false, arg);
        editorRef.current?.focus();
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div className="border border-cream-300 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-cream-50 border-b border-cream-200 p-2 flex flex-wrap gap-2 items-center" role="toolbar" aria-label="Mise en forme du texte">
                <button type="button" onClick={(e) => { e.preventDefault(); execCmd('bold'); }} className="p-1.5 hover:bg-cream-200 rounded text-charcoal-700" aria-label="Mettre en gras"><Bold aria-hidden="true" size={16} /></button>
                <button type="button" onClick={(e) => { e.preventDefault(); execCmd('italic'); }} className="p-1.5 hover:bg-cream-200 rounded text-charcoal-700" aria-label="Mettre en italique"><Italic aria-hidden="true" size={16} /></button>
                <button type="button" onClick={(e) => { e.preventDefault(); execCmd('underline'); }} className="p-1.5 hover:bg-cream-200 rounded text-charcoal-700" aria-label="Souligner"><Underline aria-hidden="true" size={16} /></button>
                
                <div className="w-px h-5 bg-cream-300 mx-1"></div>

                <select aria-label="Police du texte" onChange={(e) => execCmd('fontName', e.target.value)} className="text-sm bg-transparent border border-cream-300 rounded px-2 py-1 focus:ring-0 text-charcoal-700">
                    <option value="">Police par défaut</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier New">Machine à écrire</option>
                </select>

                <select aria-label="Taille du texte" onChange={(e) => execCmd('fontSize', e.target.value)} className="text-sm bg-transparent border border-cream-300 rounded px-2 py-1 focus:ring-0 text-charcoal-700">
                    <option value="">Taille</option>
                    <option value="1">12px</option>
                    <option value="2">14px</option>
                    <option value="3">16px (Normal)</option>
                    <option value="4">18px</option>
                    <option value="5">24px</option>
                    <option value="6">32px</option>
                    <option value="7">48px</option>
                </select>

                <div className="flex items-center gap-1 ml-2">
                    <span className="text-xs text-charcoal-500">Texte:</span>
                    <input type="color" onChange={(e) => execCmd('foreColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" aria-label="Couleur du texte" />
                </div>
                
                <div className="flex items-center gap-1 ml-1">
                    <span className="text-xs text-charcoal-500">Surlignage:</span>
                    <input type="color" onChange={(e) => execCmd('backColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" aria-label="Couleur de surbrillance" />
                </div>
            </div>
            <div 
                ref={editorRef}
                contentEditable
                role="textbox"
                aria-multiline="true"
                aria-label={placeholder || "Contenu du texte"}
                onInput={handleInput}
                onBlur={handleInput}
                className="p-4 min-h-[120px] focus:outline-none text-charcoal-700 prose prose-lg prose-charcoal max-w-none"
                data-placeholder={placeholder}
            />
        </div>
    );
}
