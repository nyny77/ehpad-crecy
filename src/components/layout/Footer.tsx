import Link from "next/link";
import { EHPAD_INFO, NAV_LINKS } from "@/lib/constants";
import WaveSeparator from "@/components/ui/WaveSeparator";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-charcoal-900 text-cream-100 relative z-10 pt-20" style={{ backgroundColor: '#111827' }}>
            <div style={{ color: '#111827' }}>
                <WaveSeparator position="top" className="text-current" showBorder={false} />
            </div>

            {/* Section principale avec 3 colonnes larges et bien équilibrées */}
            <div className="container-custom py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Colonne 1 : À propos (4.5 cols) */}
                    <div className="md:col-span-5 lg:col-span-4 space-y-3">
                        <p className="font-sans text-xl font-bold text-white tracking-tight">
                            {EHPAD_INFO.name}
                        </p>
                        <p className="text-cream-200 text-sm font-medium">
                            {EHPAD_INFO.slogan}
                        </p>
                        <p className="text-cream-400 text-xs leading-relaxed max-w-sm">
                            Établissement public d&apos;hébergement pour personnes âgées dépendantes
                            situé en Seine-et-Marne, à {EHPAD_INFO.address.city}.
                        </p>
                    </div>

                    {/* Colonne 2 : Navigation (3.5 cols) */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <p className="font-sans text-base font-bold text-white mb-3">
                            Navigation
                        </p>
                        <ul className="space-y-2 text-sm">
                            {NAV_LINKS.flatMap(item => item.href ? [{ label: item.label, href: item.href }] : (item.subLinks || [])).slice(0, 8).map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-cream-300 hover:text-terracotta-400 transition-colors duration-200 inline-flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-terracotta-500 rounded-full shrink-0" />
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3 : Contact sans retours à la ligne inutiles (5 cols) */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <p className="font-sans text-base font-bold text-white mb-3">
                            Nous contacter
                        </p>
                        <ul className="space-y-3.5 text-sm text-cream-300">
                            {/* Adresse */}
                            <li className="flex items-start gap-2.5">
                                <svg
                                    className="w-4 h-4 text-terracotta-400 mt-0.5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span className="leading-snug">
                                    {EHPAD_INFO.address.street}, {EHPAD_INFO.address.postalCode} {EHPAD_INFO.address.city}
                                </span>
                            </li>

                            {/* Téléphone */}
                            <li className="flex items-center gap-2.5">
                                <svg
                                    className="w-4 h-4 text-terracotta-400 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <a
                                    href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`}
                                    className="font-semibold text-white hover:text-terracotta-400 transition-colors"
                                >
                                    {EHPAD_INFO.phone}
                                </a>
                            </li>

                            {/* Horaires */}
                            <li className="flex items-start gap-2.5">
                                <svg
                                    className="w-4 h-4 text-terracotta-400 mt-0.5 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="leading-snug">
                                    <p>{EHPAD_INFO.officeHours.main}</p>
                                    <p className="text-terracotta-400 font-medium mt-0.5">{EHPAD_INFO.officeHours.thursday}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Barre inférieure */}
            <div className="border-t border-charcoal-700/80 bg-black/20">
                <div className="container-custom py-4 flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-x-5 gap-y-2.5 text-xs">
                    <p className="text-cream-400 whitespace-nowrap shrink-0">
                        © {currentYear} {EHPAD_INFO.fullName}. Tous droits réservés.
                    </p>
                    <p className="text-cream-500 whitespace-nowrap shrink-0">
                        Site conçu par <span className="text-cream-300">TODARO Anthony</span>
                    </p>
                    <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-x-5 gap-y-2.5 text-cream-400">
                        <Link href="/mentions-legales" className="hover:text-terracotta-400 transition-colors whitespace-nowrap shrink-0">
                            Mentions légales
                        </Link>
                        <Link href="/politique-confidentialite" className="hover:text-terracotta-400 transition-colors whitespace-nowrap shrink-0">
                            Confidentialité
                        </Link>
                        <Link href="/accessibilite" className="hover:text-terracotta-400 transition-colors whitespace-nowrap shrink-0">
                            Accessibilité : totalement conforme — 100 %
                        </Link>
                        <span className="flex items-center gap-2 whitespace-nowrap shrink-0">
                            <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
                            Établissement public
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
