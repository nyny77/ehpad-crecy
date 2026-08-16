"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FileEdit, ImagePlus, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { adminFetch } from "@/lib/admin-api";
import { encodeBlobBase64, processImage, validateSourceImage } from "@/lib/image-processing";

type Category = BlogPost["category"];

interface ArticleForm {
    id?: string;
    title: string;
    date: string;
    category: Category;
    image: string;
    excerpt: string;
    content: string;
    draft: boolean;
}

const emptyForm = (): ArticleForm => ({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    category: "activite",
    image: "",
    excerpt: "",
    content: "",
    draft: false,
});

const categories: { value: Category; label: string }[] = [
    { value: "activite", label: "Activité" },
    { value: "evenement", label: "Événement" },
    { value: "sortie", label: "Sortie" },
    { value: "fete", label: "Fête" },
    { value: "autre", label: "Autre" },
];

export default function BlogManager({ initialArticles }: { initialArticles: BlogPost[] }) {
    const [articles, setArticles] = useState(initialArticles);
    const [form, setForm] = useState<ArticleForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const editing = Boolean(form.id);

    const orderedArticles = useMemo(() => [...articles].sort((a, b) => b.date.localeCompare(a.date)), [articles]);
    const patch = (changes: Partial<ArticleForm>) => setForm((current) => ({ ...current, ...changes }));

    const editArticle = (article: BlogPost) => {
        setForm({
            id: article.id,
            title: article.title,
            date: article.date.slice(0, 10),
            category: article.category,
            image: article.image || "",
            excerpt: article.excerpt,
            content: article.content,
            draft: article.draft === true,
        });
        setMessage(null);
        window.scrollTo({ top: 100, behavior: "smooth" });
    };

    const uploadBlogImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        setUploadingImage(true);
        setMessage(null);
        try {
            validateSourceImage(file);
            const processed = await processImage(file);
            const imageBase64 = await encodeBlobBase64(processed.image);
            const uploaded = await adminFetch<{ path: string }>("/.netlify/functions/admin-blog-image", {
                method: "POST",
                body: JSON.stringify({ fileName: file.name, imageBase64 }),
            });
            patch({ image: uploaded.path });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Envoi de l’image impossible" });
        } finally {
            setUploadingImage(false);
        }
    };

    const saveArticle = async (event: FormEvent) => {
        event.preventDefault();
        if (!form.title.trim() || !form.content.trim()) return;
        setSaving(true);
        setMessage(null);
        try {
            const excerpt = form.excerpt.trim() || form.content.replace(/[#*_>`\[\]]/g, "").slice(0, 180);
            const result = await adminFetch<{ id: string }>("/.netlify/functions/admin-blog", {
                method: "POST",
                body: JSON.stringify({ action: "save", article: { ...form, excerpt, image: form.image || null } }),
            });
            const saved: BlogPost = {
                id: result.id,
                title: form.title.trim(),
                date: new Date(form.date).toISOString(),
                category: form.category,
                image: form.image || null,
                excerpt,
                content: form.content.trim(),
                draft: form.draft,
            };
            setArticles((current) => [saved, ...current.filter((article) => article.id !== saved.id)]);
            setForm(emptyForm());
            setMessage({ type: "success", text: form.draft ? "Brouillon enregistré. Le déploiement Netlify va démarrer." : "Article publié. Il apparaîtra après le déploiement Netlify." });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Publication impossible" });
        } finally {
            setSaving(false);
        }
    };

    const deleteArticle = async (article: BlogPost) => {
        if (!window.confirm(`Supprimer définitivement « ${article.title} » ?`)) return;
        try {
            await adminFetch("/.netlify/functions/admin-blog", {
                method: "POST",
                body: JSON.stringify({ action: "delete", id: article.id }),
            });
            setArticles((current) => current.filter((item) => item.id !== article.id));
            if (form.id === article.id) setForm(emptyForm());
            setMessage({ type: "success", text: "Article supprimé. La mise à jour sera visible après le déploiement Netlify." });
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Suppression impossible" });
        }
    };

    return (
        <section className="grid xl:grid-cols-[minmax(0,1.5fr)_minmax(400px,1fr)] gap-8 items-start">
            <form onSubmit={saveArticle} className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 md:p-8 space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-serif text-3xl text-charcoal-900">{editing ? "Modifier l’article" : "Nouvel article"}</h2>
                        <p className="text-charcoal-500 mt-1">La publication déclenche automatiquement Netlify.</p>
                    </div>
                    {editing && <button type="button" onClick={() => setForm(emptyForm())} className="text-sm px-4 py-2 rounded-full bg-cream-100 text-charcoal-700">Nouveau</button>}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800 text-sm">
                    <span className="text-xl">ℹ️</span>
                    <p><strong>Délai de mise à jour :</strong> L'ajout, la modification ou la suppression d'un article prend environ 2 à 3 minutes pour être visible publiquement sur le site, le temps que le serveur génère les pages.</p>
                </div>

                {message && <div role={message.type === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-xl p-3 border ${message.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"}`}>{message.text}</div>}

                <label className="block text-sm font-semibold text-charcoal-700">Titre *
                    <input required value={form.title} onChange={(e) => patch({ title: e.target.value })} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-cream-300" placeholder="Titre de l’article" />
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block text-sm font-semibold text-charcoal-700">Date *
                        <input required type="date" value={form.date} onChange={(e) => patch({ date: e.target.value })} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-cream-300" />
                    </label>
                    <label className="block text-sm font-semibold text-charcoal-700">Catégorie
                        <select value={form.category} onChange={(e) => patch({ category: e.target.value as Category })} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-cream-300 bg-white">
                            {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                        </select>
                    </label>
                </div>

                <div>
                    <span className="block text-sm font-semibold text-charcoal-700 mb-1.5">Image principale</span>
                    {form.image && <img src={form.image} alt="Aperçu de l’article" className="w-full h-52 object-cover rounded-2xl mb-3 bg-cream-100" />}
                    <div className="flex flex-wrap gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-cream-100 text-charcoal-700 font-semibold">
                            {uploadingImage ? <LoaderCircle className="animate-spin" size={18} /> : <ImagePlus size={18} />}
                            {uploadingImage ? "Envoi…" : "Choisir une image"}
                            <input disabled={uploadingImage} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadBlogImage} className="sr-only" />
                        </label>
                        {form.image && <button type="button" onClick={() => patch({ image: "" })} className="px-4 py-2.5 rounded-full text-red-700 bg-red-50">Retirer</button>}
                    </div>
                </div>

                <label className="block text-sm font-semibold text-charcoal-700">Résumé
                    <textarea value={form.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} rows={3} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-cream-300 resize-y" placeholder="Facultatif : généré automatiquement si vide" />
                </label>
                <label className="block text-sm font-semibold text-charcoal-700">Contenu *
                    <textarea required value={form.content} onChange={(e) => patch({ content: e.target.value })} rows={12} className="mt-1.5 w-full px-4 py-3 rounded-xl border border-cream-300 resize-y font-mono text-sm" placeholder="Rédigez le contenu de l’article…" />
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl bg-cream-50 border border-cream-200 cursor-pointer">
                    <input type="checkbox" checked={form.draft} onChange={(e) => patch({ draft: e.target.checked })} className="w-5 h-5 accent-terracotta-600" />
                    <span><strong className="block text-charcoal-800">Enregistrer comme brouillon</strong><span className="text-sm text-charcoal-500">Le brouillon reste invisible sur le blog.</span></span>
                </label>
                <button disabled={saving || uploadingImage} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-terracotta-600 text-white font-bold disabled:opacity-60">
                    {saving ? <LoaderCircle size={20} className="animate-spin" /> : <Save size={20} />}
                    {saving ? "Enregistrement…" : form.draft ? "Enregistrer le brouillon" : editing ? "Mettre à jour" : "Publier l’article"}
                </button>
            </form>

            <aside className="bg-white rounded-3xl border border-cream-200 shadow-sm p-5 md:p-6 xl:sticky xl:top-28">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-serif text-2xl text-charcoal-900">Articles</h2>
                    <button onClick={() => setForm(emptyForm())} className="p-2 rounded-full bg-terracotta-50 text-terracotta-700" title="Nouvel article"><Plus size={19} /></button>
                </div>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
                    {orderedArticles.map((article) => (
                        <article key={article.id} className={`rounded-2xl border p-4 ${form.id === article.id ? "border-terracotta-400 bg-terracotta-50" : "border-cream-200"}`}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {article.draft && <span className="text-[10px] uppercase tracking-wider bg-charcoal-100 text-charcoal-600 rounded-full px-2 py-0.5 font-bold">Brouillon</span>}
                                    </div>
                                    <h3 className="font-semibold text-charcoal-900 line-clamp-2">{article.title}</h3>
                                    <p className="text-xs text-charcoal-500 mt-1">{new Date(article.date).toLocaleDateString("fr-FR")}</p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <button onClick={() => editArticle(article)} className="p-2 rounded-full bg-cream-100 text-charcoal-700" title="Modifier"><FileEdit size={17} /></button>
                                    <button onClick={() => deleteArticle(article)} className="p-2 rounded-full bg-red-50 text-red-700" title="Supprimer"><Trash2 size={17} /></button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </aside>
        </section>
    );
}
