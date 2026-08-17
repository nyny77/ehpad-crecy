
// Force rebuild 2
import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";

const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    // Vérifier les variables
    const requiredEnvVars = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS", "ADMIN_EMAIL"];
    const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

    if (missingEnvVars.length > 0) {
        return json(503, { error: "Configuration de messagerie incomplète" });
    }

    // Configurer le transporteur
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        // Tenter d'envoyer un mail de test
        await transporter.sendMail({
            from: `"Test Bot" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "[TEST] Vérification email EHPAD",
            text: "Si vous recevez ceci, c'est que la configuration est PARFAITE ! 🎉",
        });

        return json(200, { message: "Email envoyé avec succès ! Vérifiez votre boîte mail." });
    } catch (error: any) {
        logFunctionError("test-email", error, context.awsRequestId);
        return json(500, { error: "Échec de l’envoi du message de test" });
    }
};

export { handler };
