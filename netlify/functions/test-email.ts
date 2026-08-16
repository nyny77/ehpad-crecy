
// Force rebuild 2
import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";
import { logFunctionError } from "./_shared/technical-log";

const handler: Handler = async (event, context) => {
    // Vérifier les variables
    const requiredEnvVars = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS", "ADMIN_EMAIL"];
    const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

    if (missingEnvVars.length > 0) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Configuration manquante",
                detail: `Variables manquantes : ${missingEnvVars.join(", ")}`
            }),
        };
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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email envoyé avec succès ! Vérifiez votre boîte mail." }),
        };
    } catch (error: any) {
        logFunctionError("test-email", error, context.awsRequestId);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Échec de l'envoi",
                message: error.message,
                code: error.code,
                response: error.response
            }),
        };
    }
};

export { handler };
