import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    onConfirm,
    onCancel,
    isDestructive = false
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm z-50 transition-colors"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="confirmation-modal-title"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-cream-50 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-cream-200"
                        >
                            <div className="p-6 text-center">
                                <h3 id="confirmation-modal-title" className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                                    {title}
                                </h3>
                                <p className="text-charcoal-600 mb-6">
                                    {message}
                                </p>

                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={onCancel}
                                        className="px-4 py-2 rounded-lg text-charcoal-600 font-medium hover:bg-cream-100 transition-colors"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className={`px-4 py-2 rounded-lg text-white font-bold shadow-md transition-transform active:scale-95 ${isDestructive
                                            ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                                            : "bg-terracotta-500 hover:bg-terracotta-600 shadow-terracotta-500/20"
                                            }`}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
