import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, LogOut } from 'lucide-react';

interface PendingValidationScreenProps {
    onLogout: () => void;
    userName?: string;
}

export default function PendingValidationScreen({ onLogout, userName }: PendingValidationScreenProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-100"
            >
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Lock className="w-8 h-8 text-amber-400" />
                    <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                        <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                </div>

                <h2 className="font-serif text-2xl text-gray-900 mb-3">
                    Bonjour {userName?.split(' ')[0]},
                </h2>

                <h3 className="text-lg font-medium text-amber-700 mb-4">
                    Votre compte est en attente de validation
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Merci de votre inscription. Pour des raisons de sécurité et de confidentialité,
                    l'accès à l'espace "Vie Sociale" est soumis à une validation manuelle par l'équipe technique.
                    <br /><br />
                    <span className="bg-amber-50 px-3 py-1 rounded-lg text-amber-800 text-sm font-medium">
                        Vous recevrez un email dès que votre accès sera activé.
                    </span>
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Vérifier mon statut
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full py-3 px-4 text-gray-500 font-medium hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
