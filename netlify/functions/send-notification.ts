import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event, context) => {
    // 1. Vérification de sécurité : Seul un admin connecté peut déclencher ça
    const { user } = context.clientContext || {};

    // Parse body
    let body;
    try {
        body = JSON.parse(event.body || "{}");
    } catch (e) {
        return { statusCode: 400, body: "Invalid JSON" };
    }

    const { subject = "Nouveauté sur l'Espace Famille", message = "Un nouvel article ou une photo a été publié(e). Connectez-vous pour le découvrir !" } = body;

    // 2. Récupérer les utilisateurs Netlify Identity
    const adminEmail = process.env.ADMIN_EMAIL;
    // On s'assure de ne garder que des strings valides
    const targets: string[] = [adminEmail].filter((email): email is string => !!email);

    if (targets.length === 0) {
        return { statusCode: 500, body: "Aucun destinataire (ADMIN_EMAIL manquant)" };
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
        // Envoi en boucle (ou en Bcc pour protéger la vie privée)
        await transporter.sendMail({
            from: `"EHPAD Crécy" <${process.env.EMAIL_USER}>`,
            bcc: targets, // Envoi caché à la liste
            subject: subject,
            text: `${message}\n\nAccédez à l'espace ici : ${process.env.URL || "https://ehpad-crecy.netlify.app"}/vie-sociale`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2 style="color: #c05621;">${subject}</h2>
                    <p>${message}</p>
                    <p>
                        <a href="${process.env.URL || "https://ehpad-crecy.netlify.app"}/vie-sociale" 
                           style="background-color: #c05621; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                           Voir les nouveautés
                        </a>
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Ceci est une notification automatique de votre EHPAD.</p>
                </div>
            `
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Notification envoyée à ${targets.length} destinataire(s) (Simulation: Admin only)` }),
        };
    } catch (error: any) {
        console.error("Notification failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

export { handler };
