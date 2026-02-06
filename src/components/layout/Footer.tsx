import Link from "next/link";
import { EHPAD_INFO, NAV_LINKS } from "@/lib/constants";
import WaveSeparator from "@/components/ui/WaveSeparator";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-charcoal-900 text-cream-100 relative pt-20" style={{ backgroundColor: '#111827', zIndex: 50 }}>
            <div style={{ color: '#111827' }}>
                <WaveSeparator position="top" className="text-current" showBorder={false} />
            </div>
            {/* Section principale */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Colonne 1 : À propos */}
                    <div className="lg:col-span-2">
                        <h3 className="font-serif text-2xl font-semibold text-white mb-4">
                            {EHPAD_INFO.name}
                        </h3>
                        <p className="text-cream-300 mb-6 max-w-md leading-relaxed">
                            {EHPAD_INFO.slogan}
                        </p>
                        <p className="text-cream-400 text-sm">
                            Établissement public d&apos;hébergement pour personnes âgées dépendantes
                            situé en Seine-et-Marne, au cœur de la charmante ville de {EHPAD_INFO.address.city}.
                        </p>
                    </div>

                    {/* Colonne 2 : Liens rapides */}
                    <div>
                        <h4 className="font-serif text-lg font-semibold text-white mb-4">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-cream-300 hover:text-terracotta-400 transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-terracotta-500 rounded-full" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3 : Contact */}
                    <div>
                        <h4 className="font-serif text-lg font-semibold text-white mb-4">
                            Nous contacter
                        </h4>
                        <ul className="space-y-4 text-cream-300">
                            <li className="flex items-start gap-3">
                                <svg
                                    className="w-5 h-5 text-terracotta-400 mt-1 flex-shrink-0"
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
                                <span>
                                    {EHPAD_INFO.address.street}
                                    <br />
                                    {EHPAD_INFO.address.postalCode} {EHPAD_INFO.address.city}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 text-terracotta-400 flex-shrink-0"
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
                                    className="hover:text-terracotta-400 transition-colors"
                                >
                                    {EHPAD_INFO.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 text-terracotta-400 flex-shrink-0"
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
                                <div className="flex flex-col">
                                    <span>{EHPAD_INFO.officeHours.main}</span>
                                    <span className="text-terracotta-400 font-medium">{EHPAD_INFO.officeHours.thursday}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Barre inférieure */}
            <div className="border-t border-charcoal-700">
                <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-cream-400 text-sm">
                        © {currentYear} {EHPAD_INFO.fullName}. Tous droits réservés.
                    </p>
                    <p className="text-cream-500 text-xs">
                        Site conçu par <span className="text-cream-300">TODARO Anthony</span>
                    </p>
                    <div className="flex items-center gap-6 text-sm text-cream-400">
                        <Link href="/mentions-legales" className="hover:text-terracotta-400 transition-colors">
                            Mentions légales
                        </Link>
                        <Link href="/politique-confidentialite" className="hover:text-terracotta-400 transition-colors">
                            Confidentialité
                        </Link>
                        <Link href="/accessibilite" className="hover:text-terracotta-400 transition-colors">
                            Accessibilité
                        </Link>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
                            Établissement public
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
