import { motion, AnimatePresence } from "framer-motion";

interface RegistrationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegistrationSuccessModal({ isOpen, onClose }: RegistrationSuccessModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm z-50 transition-colors"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-cream-200"
                        >
                            {/* Header avec illustration/icon */}
                            <div className="bg-amber-50 p-8 text-center border-b border-amber-100 relative overflow-hidden">
                                {/* Confettis décoratifs */}
                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                                    <div className="absolute top-2 left-4 w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                                    <div className="absolute top-6 right-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="absolute bottom-4 left-10 w-3 h-3 bg-green-400 transform rotate-45 delay-200"></div>
                                </div>

                                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-amber-100 relative z-10">
                                    <span className="text-4xl">🎉</span>
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                                    Bienvenue à bord !
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-8 text-center">
                                <p className="text-charcoal-600 font-medium mb-6 text-lg">
                                    Votre demande est bien partie ! 🚀
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl text-left border-2 border-blue-100 hover:scale-105 transition-transform duration-200">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                                        <div>
                                            <h4 className="font-bold text-blue-900 text-sm">Hop, un petit clic !</h4>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Foncez vérifier vos emails et cliquez sur le lien magique.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl text-left border-2 border-amber-100 hover:scale-105 transition-transform duration-200 opacity-80">
                                        <div className="flex-shrink-0 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-sm">On s'occupe du reste</h4>
                                            <p className="text-sm text-amber-700 mt-1">
                                                L'équipe valide votre compte et vous prévient illico !
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg shadow-terracotta-500/20 hover:shadow-xl hover:shadow-terracotta-500/30 transform hover:-translate-y-1 transition-all duration-200 text-lg"
                                    style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' }}
                                >
                                    C'est parti ! 🎈
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
