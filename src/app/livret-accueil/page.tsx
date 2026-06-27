"use client";

export default function LivretAccueilPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-100 via-cream-50 to-white dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 overflow-hidden">
      {/* Blobs décoratifs */}
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#C80040" }} />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#63967C" }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#FFB000" }} />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Icône animée */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            {/* Cercle pulsant */}
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-25"
              style={{ background: "linear-gradient(135deg, #C80040, #F54D75)" }}
            />
            <span
              className="relative flex items-center justify-center w-24 h-24 rounded-full text-white text-4xl shadow-warm"
              style={{ background: "linear-gradient(135deg, #C80040, #F54D75)" }}
            >
              🔧
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-500 text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
          Livret d&apos;Accueil Professionnel
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal-900 dark:text-cream-50 leading-tight mb-4">
          Page en{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #C80040, #F54D75)" }}>
            construction
          </span>
        </h1>

        <p className="text-lg text-charcoal-500 dark:text-charcoal-300 max-w-lg mx-auto mb-4 leading-relaxed">
          Le livret d&apos;accueil numérique de l&apos;EHPAD de Crécy est en cours de préparation.
          Il sera bientôt disponible pour tous les nouveaux agents. 🌿
        </p>

        <p className="text-sm text-charcoal-400 dark:text-charcoal-500 italic mb-10">
          &ldquo;L&apos;art de bien vivre, entouré et en toute sérénité.&rdquo;
        </p>

        {/* Bouton PDF — conservé */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105 bg-forest-500 hover:bg-forest-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Version PDF
          </button>
        </div>
      </div>
    </main>
  );
}
