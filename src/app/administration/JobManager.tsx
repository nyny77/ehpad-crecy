"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Plus, RefreshCw, Save } from "lucide-react";
import { adminFetch } from "@/lib/admin-api";
import { JOB_FACILITIES, type JobOffer, type JobsData, type JobStatus } from "@/lib/job-types";

const STATUS_LABELS: Record<JobStatus, string> = {
    pending: "À valider",
    published: "Publiée",
    hidden: "Masquée",
    ignored: "Ignorée",
};

const emptyOffer = (): JobOffer => ({
    id: "new",
    source: "manual",
    facilityId: "crecy",
    facilityName: JOB_FACILITIES[0].name,
    city: JOB_FACILITIES[0].city,
    title: "",
    contract: "À préciser",
    description: "",
    requirements: [],
    status: "pending",
    createdAt: "",
    updatedAt: "",
});

function OfferEditor({ offer, onSave, busy }: { offer: JobOffer; onSave: (offer: JobOffer) => Promise<void>; busy: boolean }) {
    const [draft, setDraft] = useState(offer);
    const [requirements, setRequirements] = useState(offer.requirements.map((item) => item.req).join("\n"));
    const patch = (values: Partial<JobOffer>) => setDraft((current) => ({ ...current, ...values }));
    return (
        <article className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-cream-100 px-3 py-1 font-bold text-charcoal-700">{offer.source === "fhf" ? "Importée de la FHF" : "Offre manuelle"}</span>
                <span className="rounded-full bg-terracotta-50 px-3 py-1 font-bold text-terracotta-700">{STATUS_LABELS[offer.status]}</span>
                {offer.source === "fhf" && offer.sourceActive === false && <span className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-900">Retirée du flux FHF</span>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-charcoal-700">Établissement
                    <select value={draft.facilityId} onChange={(event) => patch({ facilityId: event.target.value as JobOffer["facilityId"] })} className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 font-normal">
                        {JOB_FACILITIES.map((facility) => <option key={facility.id} value={facility.id}>{facility.name} — {facility.city}</option>)}
                    </select>
                </label>
                <label className="text-sm font-semibold text-charcoal-700">Statut
                    <select value={draft.status} onChange={(event) => patch({ status: event.target.value as JobStatus })} className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 font-normal">
                        {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>
                <label className="text-sm font-semibold text-charcoal-700 md:col-span-2">Intitulé du poste
                    <input required value={draft.title} onChange={(event) => patch({ title: event.target.value })} className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 font-normal" />
                </label>
                <label className="text-sm font-semibold text-charcoal-700">Contrat
                    <input value={draft.contract} onChange={(event) => patch({ contract: event.target.value })} className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 font-normal" />
                </label>
                <label className="text-sm font-semibold text-charcoal-700">Date limite
                    <input type="date" value={draft.deadline || ""} onChange={(event) => patch({ deadline: event.target.value || undefined })} className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2 font-normal" />
                </label>
                <label className="text-sm font-semibold text-charcoal-700 md:col-span-2">Description affichée
                    <textarea required rows={5} value={draft.description} onChange={(event) => patch({ description: event.target.value })} className="mt-1 w-full resize-y rounded-xl border border-cream-300 px-3 py-2 font-normal" />
                </label>
                <label className="text-sm font-semibold text-charcoal-700 md:col-span-2">Profil recherché — un élément par ligne
                    <textarea rows={3} value={requirements} onChange={(event) => setRequirements(event.target.value)} className="mt-1 w-full resize-y rounded-xl border border-cream-300 px-3 py-2 font-normal" />
                </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                <button disabled={busy || !draft.title.trim() || !draft.description.trim()} onClick={() => onSave({ ...draft, requirements: requirements.split("\n").map((req) => ({ req: req.trim() })).filter((item) => item.req) })} className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                    <Save size={17} /> {busy ? "Enregistrement…" : offer.id === "new" ? "Créer l’offre" : "Enregistrer"}
                </button>
                {offer.id !== "new" && draft.status !== "published" && <button disabled={busy} onClick={() => onSave({ ...draft, status: "published", requirements: requirements.split("\n").map((req) => ({ req: req.trim() })).filter((item) => item.req) })} className="rounded-xl border border-forest-300 px-4 py-2.5 text-sm font-bold text-forest-700 disabled:opacity-50">{busy ? "Publication…" : "Publier"}</button>}
            </div>
        </article>
    );
}

export default function JobManager({ initialData }: { initialData: JobsData }) {
    const [data, setData] = useState(initialData);
    const [filter, setFilter] = useState<JobStatus | "all">("pending");
    const [creating, setCreating] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const offers = useMemo(() => data.offers.filter((offer) => filter === "all" || offer.status === filter), [data.offers, filter]);

    const request = async (payload: Record<string, unknown>) => {
        setBusy(true); setMessage("");
        try {
            const response = await adminFetch<{ data: JobsData }>("/.netlify/functions/admin-jobs", { method: "POST", body: JSON.stringify(payload) });
            setData(response.data); setMessage("Modification enregistrée. La mise à jour du site va être déployée.");
            return true;
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
            return false;
        } finally { setBusy(false); }
    };

    const save = async (offer: JobOffer) => {
        const success = await request({ action: offer.id === "new" ? "create" : "update", ...offer });
        if (success) setCreating(false);
    };

    return (
        <section aria-labelledby="jobs-admin-title" className="space-y-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-cream-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 id="jobs-admin-title" className="font-serif text-2xl font-bold text-charcoal-900">Offres d’emploi</h2>
                    <p className="text-sm text-charcoal-600">Les imports FHF restent invisibles jusqu’à votre validation.</p>
                    {data.lastFhfSyncAt && <p className="mt-1 text-xs text-charcoal-500">Dernière synchronisation : {new Date(data.lastFhfSyncAt).toLocaleString("fr-FR")}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                    <button disabled={busy} onClick={() => request({ action: "sync" })} className="inline-flex items-center gap-2 rounded-xl border border-forest-300 px-4 py-2.5 text-sm font-bold text-forest-700 disabled:opacity-50"><RefreshCw size={17} className={busy ? "animate-spin" : ""} /> Synchroniser la FHF</button>
                    <button onClick={() => setCreating((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-terracotta-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={17} /> Offre manuelle</button>
                </div>
            </div>
            {message && <p role="status" className="rounded-xl bg-cream-50 px-4 py-3 text-sm text-charcoal-700">{message}</p>}
            {message && <div role="status" className="fixed bottom-4 left-4 right-4 z-[100] rounded-xl border border-charcoal-200 bg-charcoal-900 px-5 py-4 text-sm font-semibold text-white shadow-2xl md:left-auto md:max-w-md">{message}</div>}
            {creating && <OfferEditor offer={emptyOffer()} onSave={save} busy={busy} />}
            <div className="flex flex-wrap gap-2" aria-label="Filtrer les offres">
                {(["pending", "published", "hidden", "ignored", "all"] as const).map((status) => <button key={status} aria-pressed={filter === status} onClick={() => setFilter(status)} className={`rounded-full px-4 py-2 text-sm font-bold ${filter === status ? "bg-charcoal-900 text-white" : "bg-white text-charcoal-700"}`}>{status === "all" ? "Toutes" : STATUS_LABELS[status]}</button>)}
            </div>
            {offers.length === 0 ? <div className="rounded-2xl border border-cream-200 bg-white p-8 text-center text-charcoal-500">Aucune offre dans cette catégorie.</div> : <div className="space-y-5">{offers.map((offer) => <OfferEditor key={`${offer.id}-${offer.updatedAt}`} offer={offer} onSave={save} busy={busy} />)}</div>}
        </section>
    );
}
