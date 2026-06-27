"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Heart, Shield, Clock, Phone, Users, MapPin, CheckCircle2, Circle,
  BookOpen, Building2, UserCheck, CalendarDays, ShieldCheck, Scale,
  PartyPopper, Info, ChevronDown, ChevronUp, Star, Coffee,
  Stethoscope, Utensils, Shirt, Brain, Wrench, GraduationCap,
  AlertTriangle, Flame, DoorOpen, HandMetal, Sparkles, BadgeCheck,
  FileText, Key, Car, BedDouble, Sunrise, Moon, Sun, ArrowUp,
  ClipboardList, HeartHandshake, TreePine, QrCode, Menu, X, Printer
} from "lucide-react";

/* ─── Types ─── */
interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

/* ─── Section definitions ─── */
const SECTIONS: Section[] = [
  { id: "bienvenue", label: "Bienvenue", icon: <Sparkles size={18} />, color: "#C80040" },
  { id: "etablissement", label: "L'Établissement", icon: <Building2 size={18} />, color: "#63967C" },
  { id: "equipe", label: "Notre Équipe", icon: <Users size={18} />, color: "#FFB000" },
  { id: "arrivee", label: "Votre Arrivée", icon: <BadgeCheck size={18} />, color: "#C80040" },
  { id: "quotidien", label: "Le Quotidien", icon: <Clock size={18} />, color: "#8B7355" },
  { id: "hygiene", label: "Hygiène & Sécurité", icon: <ShieldCheck size={18} />, color: "#63967C" },
  { id: "droits", label: "Droits & Devoirs", icon: <Scale size={18} />, color: "#C80040" },
  { id: "vie-sociale", label: "Vie Sociale", icon: <PartyPopper size={18} />, color: "#FFB000" },
  { id: "pratique", label: "Infos Pratiques", icon: <Info size={18} />, color: "#8B7355" },
  { id: "contacts", label: "Contacts", icon: <Phone size={18} />, color: "#63967C" },
];

/* ─── Checklist items ─── */
const CHECKLIST_ITEMS = [
  { id: "contrat", label: "Contrat signé et remis aux RH", icon: <FileText size={16} /> },
  { id: "badge", label: "Badge d'accès récupéré", icon: <Key size={16} /> },
  { id: "vestiaire", label: "Vestiaire attribué (casier + clé)", icon: <DoorOpen size={16} /> },
  { id: "tenue", label: "Tenue professionnelle récupérée", icon: <Shirt size={16} /> },
  { id: "visite", label: "Visite de l'établissement effectuée", icon: <MapPin size={16} /> },
  { id: "equipe", label: "Présentation à l'équipe", icon: <Users size={16} /> },
  { id: "protocoles", label: "Protocoles d'hygiène lus et signés", icon: <ShieldCheck size={16} /> },
  { id: "urgences", label: "Numéros d'urgence enregistrés", icon: <Phone size={16} /> },
  { id: "logiciel", label: "Accès logiciel de soins configuré", icon: <ClipboardList size={16} /> },
  { id: "planning", label: "Planning de la première semaine reçu", icon: <CalendarDays size={16} /> },
];

/* ─── Organigramme data ─── */
const ORGANIGRAMME = [
  { role: "Direction", name: "À compléter", icon: <GraduationCap size={20} />, color: "#C80040", description: "Pilotage stratégique et administratif" },
  { role: "Médecin Coordonnateur", name: "À compléter", icon: <Stethoscope size={20} />, color: "#63967C", description: "Coordination médicale et protocoles de soins" },
  { role: "IDEC", name: "À compléter", icon: <HeartHandshake size={20} />, color: "#FFB000", description: "Encadrement des équipes soignantes" },
  { role: "Cadre de Santé", name: "À compléter", icon: <UserCheck size={20} />, color: "#8B7355", description: "Organisation et qualité des soins" },
  { role: "Psychologue", name: "À compléter", icon: <Brain size={20} />, color: "#C80040", description: "Accompagnement psychologique" },
  { role: "Responsable Hôtelier", name: "À compléter", icon: <Utensils size={20} />, color: "#63967C", description: "Restauration, lingerie, entretien" },
  { role: "Agent Technique", name: "À compléter", icon: <Wrench size={20} />, color: "#8B7355", description: "Maintenance et sécurité technique" },
  { role: "Secrétariat / Accueil", name: "À compléter", icon: <BookOpen size={20} />, color: "#FFB000", description: "Accueil et gestion administrative" },
];

/* ─── Animation variants ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ─── Reusable Card ─── */
function GlassCard({
  children,
  className = "",
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl bg-white/70 dark:bg-charcoal-800/60 backdrop-blur-lg border border-white/40 dark:border-charcoal-700/40 shadow-card overflow-hidden ${className}`}
    >
      {accent && (
        <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: accent }} />
      )}
      {children}
    </div>
  );
}

/* ─── Main Component ─── */
export default function LivretAccueil() {
  const [activeSection, setActiveSection] = useState("bienvenue");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Load checklist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ehpad-crecy-checklist");
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save checklist
  const toggleCheck = useCallback((id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem("ehpad-crecy-checklist", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Back to top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsSidenavOpen(false);
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = Math.round((checkedCount / CHECKLIST_ITEMS.length) * 100);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <>
      {/* ─── Progress Bar ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #C80040 0%, #F54D75 40%, #FFB000 70%, #63967C 100%)",
        }}
      />

      {/* ─── Mobile Sidenav Toggle ─── */}
      <button
        onClick={() => setIsSidenavOpen(!isSidenavOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 rounded-full shadow-warm flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #C80040, #F54D75)" }}
        aria-label="Navigation du livret"
      >
        {isSidenavOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* ─── Desktop Sidenav ─── */}
      <nav className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5">
        <div className="bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-card border border-white/50 dark:border-charcoal-700/40">
          {SECTIONS.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="group relative flex items-center gap-3 w-full text-left rounded-xl px-3 py-2.5 transition-all duration-300"
                style={isActive ? { background: `${s.color}15` } : {}}
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={isActive ? { background: s.color, color: "#fff" } : { color: s.color }}
                >
                  {s.icon}
                </span>
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive ? "opacity-100 max-w-40" : "opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:max-w-40"
                  }`}
                  style={isActive ? { color: s.color } : {}}
                >
                  {s.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                    style={{ background: s.color }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── Mobile Sidenav ─── */}
      <AnimatePresence>
        {isSidenavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidenavOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-72 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-xl shadow-2xl p-6 pt-20 lg:hidden overflow-y-auto"
            >
              <h3 className="text-sm font-bold text-charcoal-400 uppercase tracking-wider mb-4">Sommaire</h3>
              <div className="flex flex-col gap-1">
                {SECTIONS.map((s) => {
                  const isActive = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left"
                      style={isActive ? { background: `${s.color}15` } : {}}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={isActive ? { background: s.color, color: "#fff" } : { color: s.color }}
                      >
                        {s.icon}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={isActive ? { color: s.color } : {}}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ─── Print-only Header (visible only when printing) ─── */}
      <div className="hidden print:block print-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "3px solid #C80040", paddingBottom: "12px", marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#C80040", margin: 0 }}>EHPAD de Crécy</h1>
            <p style={{ fontSize: "11px", color: "#666", margin: "2px 0 0" }}>Livret d&apos;Accueil Professionnel — 18, rue de la Chapelle, 77580 Crécy-la-Chapelle</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "10px", color: "#999" }}>
            <p style={{ margin: 0 }}>📞 01 64 63 82 62</p>
            <p style={{ margin: 0 }}>✉️ accueil@ehpad-crecy.fr</p>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div ref={containerRef} className="min-h-screen">

        {/* ═══════════════════════════════════════════
            SECTION 1 : BIENVENUE
        ═══════════════════════════════════════════ */}
        <section
          id="bienvenue"
          ref={setSectionRef("bienvenue")}
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden scroll-mt-24"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-white dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900" />
            {/* Decorative blobs */}
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "#C80040" }} />
            <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "#63967C" }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#FFB000" }} />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-500 text-sm font-semibold mb-8">
              <BookOpen size={16} />
              Livret d&apos;Accueil Professionnel
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-charcoal-900 dark:text-cream-50 leading-tight mb-6"
            >
              Bienvenue à l&apos;
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #C80040, #F54D75)" }}>
                EHPAD de Crécy
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-charcoal-500 dark:text-charcoal-300 max-w-2xl mx-auto mb-4 leading-relaxed">
              Nous sommes ravis de vous accueillir au sein de notre équipe. Ce livret vous accompagnera dans vos premiers pas et tout au long de votre parcours ici.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-base text-charcoal-400 dark:text-charcoal-400 italic max-w-xl mx-auto mb-10">
              &ldquo;L&apos;art de bien vivre, entouré et en toute sérénité.&rdquo;
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <button
                onClick={() => scrollToSection("arrivee")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-warm hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #C80040, #F54D75)" }}
              >
                <CheckCircle2 size={20} />
                Checklist Premier Jour
              </button>
              <button
                onClick={() => scrollToSection("etablissement")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/80 dark:bg-charcoal-700/80 text-charcoal-700 dark:text-cream-100 font-semibold shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/50 dark:border-charcoal-600/50"
              >
                Découvrir le livret
                <ChevronDown size={20} />
              </button>
              <button
                onClick={() => window.print()}
                className="print:hidden inline-flex items-center gap-2 px-8 py-4 rounded-full bg-forest-500 hover:bg-forest-600 text-white font-semibold shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Printer size={20} />
                Version PDF
              </button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-16 flex flex-col items-center text-charcoal-300 dark:text-charcoal-500"
            >
              <span className="text-xs font-medium tracking-widest uppercase mb-2">Défiler</span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 2 : L'ÉTABLISSEMENT
        ═══════════════════════════════════════════ */}
        <section
          id="etablissement"
          ref={setSectionRef("etablissement")}
          className="py-20 md:py-28 px-6 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<Building2 />} title="Notre Établissement" color="#63967C" subtitle="Un lieu de vie au cœur de Crécy-la-Chapelle" />

              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#63967C" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-3 flex items-center gap-2">
                      <TreePine size={20} className="text-forest-500" />
                      Qui sommes-nous ?
                    </h3>
                    <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed mb-4">
                      L&apos;EHPAD de Crécy est un <strong>établissement public</strong> de 63 lits, niché au cœur de la charmante ville de Crécy-la-Chapelle en Seine-et-Marne (77).
                    </p>
                    <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                      Notre mission : offrir à chaque résident un accompagnement personnalisé dans un cadre chaleureux et bienveillant, tout en préservant leur autonomie et leur dignité.
                    </p>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#FFB000" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4 flex items-center gap-2">
                      <Heart size={20} className="text-terracotta-500" />
                      Nos Valeurs
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: <Heart size={16} />, label: "Bienveillance", desc: "Un accompagnement humain et respectueux" },
                        { icon: <Star size={16} />, label: "Professionnalisme", desc: "Excellence et formation continue" },
                        { icon: <Users size={16} />, label: "Esprit d'équipe", desc: "Solidarité et entraide au quotidien" },
                        { icon: <Shield size={16} />, label: "Respect", desc: "De la dignité et de l'autonomie de chacun" },
                      ].map((v, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-500 flex items-center justify-center mt-0.5">{v.icon}</span>
                          <div>
                            <span className="font-semibold text-charcoal-800 dark:text-cream-100 text-sm">{v.label}</span>
                            <p className="text-xs text-charcoal-500 dark:text-charcoal-400">{v.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Key figures */}
              <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { value: "63", label: "Lits", icon: <BedDouble size={22} /> },
                  { value: "77580", label: "Crécy-la-Chapelle", icon: <MapPin size={22} /> },
                  { value: "Public", label: "Statut", icon: <Building2 size={22} /> },
                  { value: "24/7", label: "Présence soignante", icon: <Stethoscope size={22} /> },
                ].map((fig, i) => (
                  <GlassCard key={i} className="p-5 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-900/20 text-forest-500 mb-2">
                      {fig.icon}
                    </span>
                    <div className="text-2xl font-bold text-charcoal-800 dark:text-cream-100">{fig.value}</div>
                    <div className="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">{fig.label}</div>
                  </GlassCard>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 3 : NOTRE ÉQUIPE
        ═══════════════════════════════════════════ */}
        <section
          id="equipe"
          ref={setSectionRef("equipe")}
          className="py-20 md:py-28 px-6 bg-cream-100/50 dark:bg-charcoal-800/30 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<Users />} title="Notre Équipe" color="#FFB000" subtitle="Les personnes qui vous accompagnent" />

              <motion.div variants={fadeInUp} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ORGANIGRAMME.map((person, i) => (
                  <motion.div key={i} variants={scaleIn}>
                    <GlassCard className="p-5 text-center hover:shadow-lg transition-shadow duration-300 group h-full">
                      <span
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-3 group-hover:scale-110 transition-transform duration-300"
                        style={{ background: person.color }}
                      >
                        {person.icon}
                      </span>
                      <h4 className="font-bold text-sm text-charcoal-800 dark:text-cream-100">{person.role}</h4>
                      <p className="text-xs text-terracotta-500 font-semibold mt-1">{person.name}</p>
                      <p className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-2 leading-relaxed">{person.description}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <GlassCard accent="#FFB000" className="p-6 mt-8">
                  <p className="text-charcoal-600 dark:text-charcoal-300 text-center leading-relaxed">
                    <strong>Vous faites désormais partie de cette équipe !</strong> N&apos;hésitez jamais à solliciter vos collègues — l&apos;entraide est notre force. Chaque rôle est essentiel au bien-être de nos résidents. 💪
                  </p>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 4 : VOTRE ARRIVÉE (CHECKLIST)
        ═══════════════════════════════════════════ */}
        <section
          id="arrivee"
          ref={setSectionRef("arrivee")}
          className="py-20 md:py-28 px-6 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<BadgeCheck />} title="Votre Arrivée" color="#C80040" subtitle="Checklist interactive de votre premier jour" />

              {/* Progress */}
              <motion.div variants={fadeInUp}>
                <GlassCard accent="#C80040" className="p-6 mt-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-charcoal-700 dark:text-cream-200">
                      Progression : {checkedCount}/{CHECKLIST_ITEMS.length}
                    </span>
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-full text-white"
                      style={{
                        background: progress === 100 ? "#63967C" : progress > 50 ? "#FFB000" : "#C80040",
                      }}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-cream-200 dark:bg-charcoal-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: progress === 100
                          ? "linear-gradient(90deg, #63967C, #82B098)"
                          : "linear-gradient(90deg, #C80040, #F54D75)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  {progress === 100 && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-forest-600 dark:text-forest-400 font-semibold mt-3 flex items-center justify-center gap-2"
                    >
                      <PartyPopper size={18} /> Félicitations, tout est en ordre ! 🎉
                    </motion.p>
                  )}
                </GlassCard>
              </motion.div>

              {/* Checklist items */}
              <motion.div variants={fadeInUp} className="mt-6 space-y-3">
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left rounded-xl p-4 flex items-center gap-4 transition-all duration-300 border ${
                        isChecked
                          ? "bg-forest-50/80 dark:bg-forest-900/20 border-forest-200 dark:border-forest-800/40"
                          : "bg-white/60 dark:bg-charcoal-800/40 border-white/40 dark:border-charcoal-700/40 hover:bg-white/80 dark:hover:bg-charcoal-800/60"
                      }`}
                    >
                      <span className={`flex-shrink-0 transition-all duration-300 ${isChecked ? "text-forest-500" : "text-charcoal-300 dark:text-charcoal-500"}`}>
                        {isChecked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </span>
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isChecked ? "bg-forest-100 dark:bg-forest-900/30 text-forest-600" : "bg-cream-100 dark:bg-charcoal-700 text-charcoal-400"}`}>
                        {item.icon}
                      </span>
                      <span className={`font-medium text-sm transition-all duration-300 ${isChecked ? "text-forest-700 dark:text-forest-300 line-through" : "text-charcoal-700 dark:text-cream-200"}`}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 5 : LE QUOTIDIEN
        ═══════════════════════════════════════════ */}
        <section
          id="quotidien"
          ref={setSectionRef("quotidien")}
          className="py-20 md:py-28 px-6 bg-cream-100/50 dark:bg-charcoal-800/30 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<Clock />} title="Le Quotidien" color="#8B7355" subtitle="Rythme de la journée et fonctionnement" />

              <div className="mt-10 space-y-6">
                {/* Timeline */}
                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#8B7355" className="p-6">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-6 flex items-center gap-2">
                      <CalendarDays size={20} className="text-wood-500" />
                      Rythme de la Journée Type
                    </h3>
                    <div className="space-y-4">
                      {[
                        { time: "6h30 – 7h00", label: "Relève / Transmissions", icon: <Sunrise size={16} />, color: "#FFB000" },
                        { time: "7h00 – 9h30", label: "Levers, toilettes, petits-déjeuners", icon: <Coffee size={16} />, color: "#8B7355" },
                        { time: "9h30 – 11h30", label: "Soins, activités du matin", icon: <Stethoscope size={16} />, color: "#63967C" },
                        { time: "12h00 – 13h00", label: "Service du déjeuner", icon: <Utensils size={16} />, color: "#C80040" },
                        { time: "13h00 – 13h30", label: "Transmissions midi", icon: <ClipboardList size={16} />, color: "#FFB000" },
                        { time: "14h00 – 16h30", label: "Animations, visites, soins", icon: <PartyPopper size={16} />, color: "#63967C" },
                        { time: "16h30 – 17h00", label: "Goûter", icon: <Coffee size={16} />, color: "#8B7355" },
                        { time: "18h00 – 19h00", label: "Service du dîner", icon: <Utensils size={16} />, color: "#C80040" },
                        { time: "19h30 – 20h30", label: "Couchers, transmissions soir", icon: <Moon size={16} />, color: "#40404A" },
                        { time: "21h00 – 6h30", label: "Surveillance de nuit, rondes", icon: <Shield size={16} />, color: "#40404A" },
                      ].map((slot, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <span className="flex-shrink-0 w-24 text-xs font-mono font-bold text-charcoal-500 dark:text-charcoal-400 text-right">
                            {slot.time}
                          </span>
                          <span className="flex-shrink-0 w-3 h-3 rounded-full border-2 group-hover:scale-125 transition-transform" style={{ borderColor: slot.color, background: `${slot.color}30` }} />
                          <span className="flex items-center gap-2 text-sm text-charcoal-700 dark:text-cream-200 font-medium">
                            <span style={{ color: slot.color }}>{slot.icon}</span>
                            {slot.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <GlassCard accent="#63967C" className="p-6 h-full">
                      <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-3 flex items-center gap-2">
                        <ClipboardList size={20} className="text-forest-500" />
                        Les Transmissions
                      </h3>
                      <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed mb-3">
                        Les transmissions sont un <strong>moment clé</strong> de la journée. Elles garantissent la continuité des soins et la sécurité des résidents.
                      </p>
                      <ul className="space-y-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-forest-500 mt-0.5 flex-shrink-0" /> Transmissions orales à chaque relève</li>
                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-forest-500 mt-0.5 flex-shrink-0" /> Transmissions écrites sur le logiciel de soins</li>
                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-forest-500 mt-0.5 flex-shrink-0" /> Signaler tout événement inhabituel</li>
                      </ul>
                    </GlassCard>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <GlassCard accent="#FFB000" className="p-6 h-full">
                      <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-3 flex items-center gap-2">
                        <Sun size={20} className="text-golden-500" />
                        Horaires de Travail
                      </h3>
                      <p className="text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed mb-3">
                        Les horaires varient selon votre poste et service. Votre planning vous sera communiqué par votre responsable.
                      </p>
                      <div className="space-y-2">
                        {[
                          { label: "Équipe du matin", time: "6h30 – 14h00", icon: <Sunrise size={14} /> },
                          { label: "Équipe du soir", time: "13h30 – 21h00", icon: <Sun size={14} /> },
                          { label: "Équipe de nuit", time: "21h00 – 6h30", icon: <Moon size={14} /> },
                          { label: "Coupure", time: "Selon planning", icon: <Clock size={14} /> },
                        ].map((h, i) => (
                          <div key={i} className="flex items-center justify-between bg-cream-50/60 dark:bg-charcoal-700/40 rounded-lg px-3 py-2">
                            <span className="flex items-center gap-2 text-sm font-medium text-charcoal-700 dark:text-cream-200">
                              <span className="text-golden-500">{h.icon}</span>
                              {h.label}
                            </span>
                            <span className="text-xs font-mono font-bold text-charcoal-500 dark:text-charcoal-400">{h.time}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 6 : HYGIÈNE & SÉCURITÉ
        ═══════════════════════════════════════════ */}
        <section
          id="hygiene"
          ref={setSectionRef("hygiene")}
          className="py-20 md:py-28 px-6 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<ShieldCheck />} title="Hygiène & Sécurité" color="#63967C" subtitle="Protocoles essentiels pour la protection de tous" />

              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#63967C" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4 flex items-center gap-2">
                      <HandMetal size={20} className="text-forest-500" />
                      Hygiène des Mains
                    </h3>
                    <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-4 leading-relaxed">
                      Le <strong>lavage des mains</strong> est le geste n°1 de prévention des infections. Il doit être effectué :
                    </p>
                    <ul className="space-y-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                      {[
                        "Avant et après chaque soin",
                        "Avant et après le repas",
                        "Après passage aux toilettes",
                        "Après contact avec un environnement souillé",
                        "En utilisant la solution hydro-alcoolique (SHA)",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-forest-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#C80040" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4 flex items-center gap-2">
                      <Flame size={20} className="text-terracotta-500" />
                      Sécurité Incendie
                    </h3>
                    <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-4 leading-relaxed">
                      Connaître les consignes de sécurité incendie est <strong>obligatoire</strong> :
                    </p>
                    <ul className="space-y-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                      {[
                        "Repérer les issues de secours et extincteurs",
                        "Connaître le point de rassemblement",
                        "Ne jamais bloquer les portes coupe-feu",
                        "Alerter immédiatement en cas de détection de fumée",
                        "Participer aux exercices d'évacuation",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle size={14} className="text-terracotta-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#FFB000" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4 flex items-center gap-2">
                      <Shirt size={20} className="text-golden-600" />
                      Tenue Professionnelle
                    </h3>
                    <ul className="space-y-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                      {[
                        "Port de la tenue professionnelle obligatoire",
                        "Chaussures fermées et antidérapantes",
                        "Cheveux attachés pour le personnel soignant",
                        "Pas de bijoux aux mains et poignets (soin)",
                        "Badge d'identification visible en permanence",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-golden-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#8B7355" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-wood-500" />
                      Précautions Standard
                    </h3>
                    <ul className="space-y-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                      {[
                        "Port de gants pour tout contact avec du sang ou liquides biologiques",
                        "Respect du tri des déchets (DASRI / ordures ménagères)",
                        "Signalement de tout accident d'exposition au sang (AES)",
                        "Vaccination à jour selon recommandations",
                        "Respect des protocoles d'isolement si nécessaire",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Shield size={14} className="text-wood-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 7 : DROITS & DEVOIRS
        ═══════════════════════════════════════════ */}
        <section
          id="droits"
          ref={setSectionRef("droits")}
          className="py-20 md:py-28 px-6 bg-cream-100/50 dark:bg-charcoal-800/30 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<Scale />} title="Droits & Devoirs" color="#C80040" subtitle="Ce que l'établissement attend de vous — et vous apporte" />

              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#C80040" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4">📜 Vos Devoirs</h3>
                    <ul className="space-y-3 text-sm text-charcoal-600 dark:text-charcoal-300">
                      {[
                        { title: "Secret professionnel", desc: "Toute information concernant les résidents est strictement confidentielle." },
                        { title: "Devoir de réserve", desc: "Ne pas partager d'informations sur les réseaux sociaux ou en dehors de l'établissement." },
                        { title: "Ponctualité", desc: "Respecter vos horaires pour la continuité des soins." },
                        { title: "Respect du résident", desc: "Frapper avant d'entrer, vouvoyer sauf accord contraire, respecter l'intimité." },
                        { title: "Signalement", desc: "Obligation de signaler toute situation de maltraitance ou de danger." },
                      ].map((d, i) => (
                        <li key={i}>
                          <span className="font-semibold text-charcoal-800 dark:text-cream-100">{d.title}</span>
                          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">{d.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#63967C" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4">🤝 Vos Droits</h3>
                    <ul className="space-y-3 text-sm text-charcoal-600 dark:text-charcoal-300">
                      {[
                        { title: "Formation continue", desc: "Accès aux formations internes et externes pour développer vos compétences." },
                        { title: "Conditions de travail", desc: "Un environnement de travail sécurisé et des équipements adaptés." },
                        { title: "Expression", desc: "Liberté de participer aux réunions d'équipe et de proposer des améliorations." },
                        { title: "Accompagnement", desc: "Un tutorat pendant votre période d'intégration." },
                        { title: "Bien-être", desc: "Accès à la salle de pause, au réfectoire du personnel et aux avantages sociaux." },
                      ].map((d, i) => (
                        <li key={i}>
                          <span className="font-semibold text-charcoal-800 dark:text-cream-100">{d.title}</span>
                          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5">{d.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 8 : VIE SOCIALE
        ═══════════════════════════════════════════ */}
        <section
          id="vie-sociale"
          ref={setSectionRef("vie-sociale")}
          className="py-20 md:py-28 px-6 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<PartyPopper />} title="Vie Sociale & Animations" color="#FFB000" subtitle="Le cœur vivant de notre établissement" />

              <div className="mt-10 grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Activités Quotidiennes",
                    items: ["Ateliers mémoire", "Activités manuelles", "Jeux de société", "Lecture & échanges", "Gymnastique douce"],
                    icon: <Star size={20} />,
                    color: "#FFB000",
                  },
                  {
                    title: "Événements & Fêtes",
                    items: ["Anniversaires des résidents", "Fêtes saisonnières", "Spectacles et concerts", "Sorties et excursions", "Marchés de Noël"],
                    icon: <PartyPopper size={20} />,
                    color: "#C80040",
                  },
                  {
                    title: "Partenariats",
                    items: ["Bénévoles réguliers", "Associations locales", "Écoles et crèches", "Intervenants extérieurs", "Familles impliquées"],
                    icon: <HeartHandshake size={20} />,
                    color: "#63967C",
                  },
                ].map((cat, i) => (
                  <motion.div key={i} variants={scaleIn}>
                    <GlassCard accent={cat.color} className="p-6 h-full">
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white mb-3"
                        style={{ background: cat.color }}
                      >
                        {cat.icon}
                      </span>
                      <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-3">{cat.title}</h3>
                      <ul className="space-y-2">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp}>
                <GlassCard className="p-6 mt-8 text-center">
                  <p className="text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                    <strong>Chaque agent peut contribuer à la vie sociale !</strong> Proposez vos idées d&apos;activités, partagez vos talents — c&apos;est ensemble que nous créons un lieu de vie chaleureux. 🎨🎶
                  </p>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 9 : INFOS PRATIQUES
        ═══════════════════════════════════════════ */}
        <section
          id="pratique"
          ref={setSectionRef("pratique")}
          className="py-20 md:py-28 px-6 bg-cream-100/50 dark:bg-charcoal-800/30 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<Info />} title="Infos Pratiques" color="#8B7355" subtitle="Tout ce qu'il faut savoir au quotidien" />

              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Parking", desc: "Parking gratuit réservé au personnel à l'arrière du bâtiment. Badge nécessaire.", icon: <Car size={20} />, color: "#8B7355" },
                  { title: "Repas du personnel", desc: "Possibilité de déjeuner au réfectoire. Tarif préférentiel sur inscription.", icon: <Utensils size={20} />, color: "#C80040" },
                  { title: "Vestiaires", desc: "Casier individuel avec clé. La tenue doit rester dans l'établissement.", icon: <DoorOpen size={20} />, color: "#63967C" },
                  { title: "Salle de pause", desc: "Accès libre avec micro-ondes, réfrigérateur et machine à café.", icon: <Coffee size={20} />, color: "#FFB000" },
                  { title: "Arrêts maladie", desc: "Prévenir votre responsable + le secrétariat avant le début de votre poste.", icon: <Stethoscope size={20} />, color: "#C80040" },
                  { title: "Accès & Horaires", desc: "Accueil administratif : Lun-Ven 9h-12h30 / 13h30-17h (fermé jeudi).", icon: <Clock size={20} />, color: "#8B7355" },
                ].map((info, i) => (
                  <motion.div key={i} variants={scaleIn}>
                    <GlassCard className="p-5 h-full hover:shadow-lg transition-shadow duration-300 group">
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white mb-3 group-hover:scale-110 transition-transform duration-300"
                        style={{ background: info.color }}
                      >
                        {info.icon}
                      </span>
                      <h4 className="font-bold text-sm text-charcoal-800 dark:text-cream-100 mb-1">{info.title}</h4>
                      <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">{info.desc}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 10 : CONTACTS
        ═══════════════════════════════════════════ */}
        <section
          id="contacts"
          ref={setSectionRef("contacts")}
          className="py-20 md:py-28 px-6 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto lg:ml-32 xl:mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <SectionHeader icon={<Phone />} title="Contacts & Numéros Utiles" color="#63967C" subtitle="Les numéros indispensables à enregistrer" />

              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#63967C" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4">🏥 Contacts Internes</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Standard / Accueil", number: "01 64 63 82 62" },
                        { label: "Direction", number: "À compléter" },
                        { label: "IDEC", number: "À compléter" },
                        { label: "Secrétariat", number: "À compléter" },
                        { label: "Cuisine", number: "À compléter" },
                        { label: "Maintenance", number: "À compléter" },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between bg-cream-50/60 dark:bg-charcoal-700/40 rounded-lg px-4 py-2.5">
                          <span className="text-sm font-medium text-charcoal-700 dark:text-cream-200">{c.label}</span>
                          <span className="text-sm font-mono font-bold text-forest-600 dark:text-forest-400">{c.number}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <GlassCard accent="#C80040" className="p-6 h-full">
                    <h3 className="text-lg font-bold text-charcoal-800 dark:text-cream-100 mb-4">🚨 Numéros d&apos;Urgence</h3>
                    <div className="space-y-3">
                      {[
                        { label: "SAMU", number: "15", color: "#C80040" },
                        { label: "Pompiers", number: "18", color: "#C80040" },
                        { label: "Police / Gendarmerie", number: "17", color: "#C80040" },
                        { label: "Numéro d'urgence européen", number: "112", color: "#C80040" },
                        { label: "Centre anti-poison", number: "01 40 05 48 48", color: "#FFB000" },
                        { label: "Pharmacie de garde", number: "3237", color: "#63967C" },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between bg-cream-50/60 dark:bg-charcoal-700/40 rounded-lg px-4 py-2.5">
                          <span className="text-sm font-medium text-charcoal-700 dark:text-cream-200">{c.label}</span>
                          <a
                            href={`tel:${c.number.replace(/\s/g, "")}`}
                            className="text-sm font-mono font-bold hover:underline transition-colors"
                            style={{ color: c.color }}
                          >
                            {c.number}
                          </a>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Email */}
              <motion.div variants={fadeInUp}>
                <GlassCard className="p-6 mt-8 text-center">
                  <p className="text-charcoal-600 dark:text-charcoal-300">
                    📧 Email général : <a href="mailto:accueil@ehpad-crecy.fr" className="font-bold text-terracotta-500 hover:underline">accueil@ehpad-crecy.fr</a>
                  </p>
                  <p className="text-charcoal-600 dark:text-charcoal-300 mt-1">
                    📍 Adresse : <strong>18, rue de la Chapelle — 77580 Crécy-la-Chapelle</strong>
                  </p>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FOOTER / QR Code
        ═══════════════════════════════════════════ */}
        <section className="py-16 px-6 bg-gradient-to-br from-charcoal-800 to-charcoal-900 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <QrCode size={40} className="mx-auto mb-4 text-terracotta-400" />
                <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
                  Gardez ce livret à portée de main
                </h2>
                <p className="text-charcoal-300 mb-6 leading-relaxed max-w-lg mx-auto">
                  Scannez le QR code remis à votre arrivée pour retrouver ce livret à tout moment sur votre téléphone. Pas besoin d&apos;imprimer — pensez écolo ! 🌿
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
                  <Sparkles size={16} className="text-golden-400" />
                  Mis à jour en temps réel — toujours la dernière version
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ─── Back to Top ─── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-white/90 dark:bg-charcoal-800/90 shadow-card backdrop-blur-sm flex items-center justify-center text-charcoal-600 dark:text-cream-200 hover:scale-110 transition-transform border border-white/40 dark:border-charcoal-700/40"
            aria-label="Retour en haut"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  icon,
  title,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  subtitle: string;
}) {
  return (
    <motion.div variants={fadeInUp} className="mb-2">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ background: color }}
        >
          {icon}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-50">
          {title}
        </h2>
      </div>
      <p className="text-charcoal-500 dark:text-charcoal-400 ml-13">{subtitle}</p>
    </motion.div>
  );
}
