"use client";

import React from "react";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/layout/Section";
import { motion } from "framer-motion";

export default function HistoirePage() {
    return (
        <main className="min-h-screen bg-cream-50">
            <PageHeader
                title="Histoire de Crécy-la-Chapelle"
                subtitle="Découvrez la Venise Briarde, votre future ville"
                image="/images/hero/histoire-hero.jpg"
            />

            <Section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Introduction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="prose prose-lg prose-stone mx-auto text-center"
                    >
                        <p className="lead text-xl md:text-2xl text-charcoal-700 italic">
                            "Vous allez bientôt poser vos valises à Crécy-la-Chapelle pour entamer une nouvelle étape de votre vie..."
                        </p>
                        <p className="text-charcoal-600">
                            Nous avons préparé ce petit reportage pour vous emmener faire un premier tour de ce lieu charmant qui vous attend. Oubliez le tumulte des grandes villes, ici, vous arrivez dans un havre de paix, chargé d'histoire et bercé par l'eau. Laissez-vous guider dans les rues de celle que l'on surnomme "La Venise de la Brie".
                        </p>
                    </motion.div>

                    {/* 1. L'Eau */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-white transform rotate-2"
                        >
                            <Image
                                src="/images/history/canal.jpg"
                                alt="Les canaux de Crécy-la-Chapelle"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-serif text-terracotta-600 mb-6">1. L'Eau : L'Âme de Crécy</h2>
                            <p className="text-charcoal-600 mb-4">
                                La première chose qui vous frappera à Crécy, c'est la présence apaisante de l'eau. La ville n'est pas seulement traversée par une rivière, le Grand Morin, elle est littéralement tissée par elle.
                            </p>
                            <p className="text-charcoal-600">
                                Au fil des siècles, les habitants ont creusé de petits canaux, appelés ici des "brassets", pour faire tourner les moulins et protéger la ville. Aujourd'hui, ces canaux offrent un spectacle permanent et tranquille. C'est une ville où il fait bon écouter le clapotis de l'eau et regarder passer les canards.
                            </p>
                            <blockquote className="mt-6 border-l-4 border-forest-300 pl-4 italic text-forest-700">
                                Les "brassets", ces petits canaux qui donnent à Crécy son surnom de "Venise Briarde".
                            </blockquote>
                        </motion.div>
                    </div>

                    {/* 2. Les Pierres */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-white transform -rotate-2"
                        >
                            <Image
                                src="/images/history/tour.jpg"
                                alt="Tour médiévale de Crécy"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <h2 className="text-3xl font-serif text-terracotta-600 mb-6">2. Des Pierres qui Racontent une Histoire</h2>
                            <p className="text-charcoal-600 mb-4">
                                Crécy-la-Chapelle n'est pas une ville récente. C'est un bourg médiéval qui a beaucoup d'histoires à raconter. Vous le sentirez en voyant les vieilles pierres qui donnent tant de cachet au centre-ville.
                            </p>
                            <p className="text-charcoal-600">
                                Autrefois, la ville était entourée de remparts pour se protéger. Il en reste aujourd'hui de magnifiques vestiges, comme des tours de guet en pierre que l'on découvre au détour d'une rue. Ces murs épais sont les gardiens silencieux du passé de votre nouvelle ville.
                            </p>
                            <blockquote className="mt-6 border-l-4 border-wood-300 pl-4 italic text-wood-700">
                                Les anciennes tours de guet veillent encore sur la ville, témoins de son passé médiéval.
                            </blockquote>
                        </motion.div>
                    </div>

                    {/* 3. La Collégiale */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-white transform rotate-1"
                        >
                            <Image
                                src="/images/history/collegiale.png"
                                alt="La Collégiale Notre-Dame"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-serif text-terracotta-600 mb-6">3. La Collégiale Notre-Dame</h2>
                            <p className="text-charcoal-600 mb-4">
                                Vous ne pourrez pas la manquer. Elle veille sur la ville depuis des siècles. La Collégiale Notre-Dame de l'Assomption est le joyau de Crécy.
                            </p>
                            <p className="text-charcoal-600">
                                C'est une église magnifique, de style gothique, construite au 13ème siècle (la même époque que Saint-Louis !). Elle est lumineuse, élégante et inspire la sérénité. C'est un repère visuel important dans le paysage, et un lieu de grand calme pour ceux qui cherchent le recueillement.
                            </p>
                            <blockquote className="mt-6 border-l-4 border-golden-300 pl-4 italic text-golden-700">
                                La magnifique Collégiale Notre-Dame, un chef-d'œuvre de l'art gothique qui veille sur Crécy depuis le 13ème siècle.
                            </blockquote>
                        </motion.div>
                    </div>

                    {/* 4. Cœur de Ville */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-white transform -rotate-1"
                        >
                            <Image
                                src="/images/history/marche.jpg"
                                alt="Le marché de Crécy"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <h2 className="text-3xl font-serif text-terracotta-600 mb-6">4. Un Cœur de Ville Vivant et Paisible</h2>
                            <p className="text-charcoal-600 mb-4">
                                Crécy est une ville d'histoire, mais c'est aussi une ville bien vivante ! Le centre-ville est à taille humaine, chaleureux et accueillant.
                            </p>
                            <p className="text-charcoal-600">
                                Vous y trouverez cette ambiance de "bourgade" où les gens prennent le temps de se saluer. Il y a des commerces de proximité, des boulangeries qui sentent bon le pain frais, des pharmacies, et un marché traditionnel. C'est un cadre de vie rassurant où tout le nécessaire est à portée de main, dans une atmosphère qui reste toujours paisible, loin de l'agitation.
                            </p>
                            <blockquote className="mt-6 border-l-4 border-terracotta-300 pl-4 italic text-terracotta-700">
                                Le cœur de ville, avec ses commerces et son ambiance de village convivial.
                            </blockquote>
                        </motion.div>
                    </div>

                    {/* Mot de la Fin */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-soft text-center max-w-3xl mx-auto border border-cream-200">
                        <h3 className="text-2xl font-serif text-terracotta-600 mb-4">Le Mot de la Fin</h3>
                        <p className="text-charcoal-600 mb-6">
                            Chers futurs résidents,
                            <br /><br />
                            Crécy-la-Chapelle est une ville qui prend soin de ses habitants, un écrin de verdure et d'eau où l'histoire se mêle à la douceur de vivre. Nous espérons que ce petit aperçu vous a plu et que vous vous sentirez vite chez vous dans cette belle "Venise Briarde".
                            <br /><br />
                            <strong>Nous avons hâte de vous accueillir.</strong>
                        </p>
                        <a href="/contact" className="btn-primary">
                            Venir visiter
                        </a>
                    </div>

                    {/* Liens Utiles */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-6 text-center"
                    >
                        <a
                            href="https://www.crecylachapelle.eu/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-terracotta-200 transition-colors">
                                <svg className="w-6 h-6 text-terracotta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h4 className="font-serif font-bold text-lg text-charcoal-800 mb-2">Mairie</h4>
                            <p className="text-sm text-charcoal-600">Site officiel de la ville</p>
                        </a>

                        <a
                            href="https://www.crecylachapelle.eu/tourisme-loisirs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-forest-200 transition-colors">
                                <svg className="w-6 h-6 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="font-serif font-bold text-lg text-charcoal-800 mb-2">Tourisme</h4>
                            <p className="text-sm text-charcoal-600">Découvrir la région</p>
                        </a>

                        <a
                            href="https://www.transilien.com/fr/gare/crecy-la-chapelle-8711616"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200 hover:shadow-md transition-all group"
                        >
                            <div className="w-12 h-12 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-wood-200 transition-colors">
                                <svg className="w-6 h-6 text-wood-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            <h4 className="font-serif font-bold text-lg text-charcoal-800 mb-2">Accès & Transports</h4>
                            <p className="text-sm text-charcoal-600">Gare SNCF / Bus</p>
                        </a>
                    </motion.div>
                </div>
            </Section>
        </main >
    );
}
