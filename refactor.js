const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/app/vie-sociale/VieSocialeClient.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove imports
content = content.replace(/import AuthSelectionModal from \"@\/components\/auth\/AuthSelectionModal\";\r?\n/, '');
content = content.replace(/import SignupModal from \"@\/components\/auth\/SignupModal\";\r?\n/, '');
content = content.replace(/import RegistrationSuccessModal from \"@\/components\/auth\/RegistrationSuccessModal\";\r?\n/, '');
content = content.replace(/import \{ isAuthenticated, isAdmin, logout, onAuthChange, openLoginWidget, isPendingValidation \} from \"@\/lib\/netlifyAuth\";/, 'import { isAuthenticated, isAdmin, logout, onAuthChange } from \"@/lib/netlifyAuth\";');

// 2. Remove states
content = content.replace(/    const \[showAuthChoice, setShowAuthChoice\] = useState\(false\);\r?\n/, '');
content = content.replace(/    const \[showSignup, setShowSignup\] = useState\(false\);\r?\n/, '');
content = content.replace(/    const \[showSuccessModal, setShowSuccessModal\] = useState\(false\);\r?\n/, '');
content = content.replace(/    const \[isPending, setIsPending\] = useState\(false\);\r?\n/, '');

// 3. Remove Modals
content = content.replace(/            <AuthSelectionModal[\s\S]*?\/>\r?\n\r?\n/, '');
content = content.replace(/            <SignupModal[\s\S]*?\/>\r?\n/, '');
content = content.replace(/            <RegistrationSuccessModal[\s\S]*?\/>\r?\n/, '');

// 4. Update the main rendering block
const newBlock = `                        <div className=\"relative\">
                            {/* Navigation des Onglets */}
                            <div className=\"flex flex-col md:flex-row items-center justify-between gap-6 mb-8 mt-2\">
                                <div className=\"bg-white p-1.5 rounded-full shadow-sm border border-cream-200 inline-flex gap-4\">
                                    <motion.button
                                        onClick={() => setActiveTab(\"news\")}
                                        animate={activeTab === \"news\" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: \"easeInOut\"
                                        }}
                                        className={\`px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 cursor-pointer \${activeTab === \"news\"
                                            ? \"text-white shadow-md relative z-10\"
                                            : \"!text-charcoal-800 hover:bg-cream-50\"
                                            }\`}
                                        style={activeTab === \"news\" ? { background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' } : {}}
                                    >
                                        Blog
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveTab(\"gallery\")}
                                        animate={activeTab === \"gallery\" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: \"easeInOut\"
                                        }}
                                        className={\`px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 cursor-pointer \${activeTab === \"gallery\"
                                            ? \"text-white shadow-md relative z-10\"
                                            : \"!text-charcoal-800 hover:bg-cream-50\"
                                            }\`}
                                        style={activeTab === \"gallery\" ? { background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' } : {}}
                                    >
                                        Galerie Photos 📷
                                    </motion.button>
                                </div>

                                <div className=\"flex items-center gap-3\">
                                    {gazetteData?.file && (
                                        <a
                                            href={gazetteData.file}
                                            target=\"_blank\"
                                            rel=\"noopener noreferrer\"
                                            className=\"flex items-center gap-2 px-4 py-2.5 !text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm\"
                                            style={{ background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' }}
                                            title=\"Lire le Petit Echo du Coeur\"
                                        >
                                            <svg className=\"w-5 h-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                                                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253\" />
                                            </svg>
                                            Le Petit Echo du Coeur 📰
                                        </a>
                                    )}
                                    {adminMode && (
                                        <>
                                            <Link
                                                href=\"/admin-users\"
                                                className=\"flex items-center gap-2 px-3 py-2 bg-charcoal-800 !text-white font-medium rounded-full hover:bg-charcoal-700 transition-colors text-sm\"
                                                title=\"Gérer les utilisateurs\"
                                            >
                                                <svg className=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                                                    <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z\" />
                                                </svg>
                                                Utilisateurs
                                            </Link>
                                            <a
                                                href=\"/admin/#/collections/gazette\"
                                                target=\"_blank\"
                                                rel=\"noopener noreferrer\"
                                                className=\"flex items-center gap-2 px-3 py-2 bg-charcoal-800 !text-white font-medium rounded-full hover:bg-charcoal-700 transition-colors text-sm\"
                                                title=\"Modifier le Petit echo du coeur\"
                                            >
                                                <svg className=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                                                    <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12\" />
                                                </svg>
                                                Up Echo du coeur
                                            </a>
                                            <a
                                                href=\"/admin/\"
                                                target=\"_blank\"
                                                rel=\"noopener noreferrer\"
                                                className=\"flex items-center gap-2 px-3 py-2 bg-violet-600 !text-white font-medium rounded-full hover:bg-violet-700 transition-colors text-sm\"
                                                title=\"Gérer le contenu du site (CMS)\"
                                            >
                                                <svg className=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                                                    <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\" />
                                                    <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />
                                                </svg>
                                                CMS
                                            </a>
                                            <button
                                                onClick={handleNotify}
                                                className=\"flex items-center gap-2 px-3 py-2 !text-white font-medium rounded-full transition-colors text-sm cursor-pointer\"
                                                style={{ background: 'linear-gradient(135deg, #C80040 0%, #E91E63 50%, #F54D75 100%)' }}
                                                title=\"Envoyer un email aux familles\"
                                            >
                                                <svg className=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                                                    <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9\" />
                                                </svg>
                                                Notifier
                                            </button>
                                        </>
                                    )}

                                    {authenticated && (
                                        <button
                                            onClick={handleLogout}
                                            className=\"text-sm text-charcoal-500 hover:text-charcoal-800 underline underline-offset-4 cursor-pointer\"
                                        >
                                            Déconnexion
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contenu */}
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === \"news\" ? (
                                    <BlogGrid articles={initialArticles} isAdminUser={adminMode} />
                                ) : (
                                    <PrivateGallery />
                                )}
                            </motion.div>
                        </div>`;

content = content.replace(/<div className=\"relative\">[\s\S]*?<\/div>\r?\n                    \)\}/, newBlock);

fs.writeFileSync(file, content);
