import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";
import { logFunctionError } from "./_shared/technical-log";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { escapeHtml, parseJsonObject, validationStatus } from "./_shared/request-security";

const handler: Handler = async (event, context) => {
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });

    try {
        const body = parseJsonObject(event.body, 16 * 1024);
        const subjectText = String(body.subject || "Nouveauté sur l'Espace Famille").trim().slice(0, 160);
        const messageText = String(body.message || "Un nouvel article ou une photo a été publié(e). Connectez-vous pour le découvrir !").trim().slice(0, 2_000);
        if (!subjectText || !messageText) return json(400, { error: "Sujet et message obligatoires" });
        const subjectHtml = escapeHtml(subjectText, 160);
        const messageHtml = escapeHtml(messageText, 2_000).replace(/\r?\n/g, "<br>");

        // Récupérer les utilisateurs Netlify Identity
        const adminEmail = process.env.ADMIN_EMAIL;
    // On s'assure de ne garder que des strings valides
        const targets: string[] = [adminEmail].filter((email): email is string => !!email);

        if (targets.length === 0) return json(503, { error: "Messagerie non configurée" });

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

        // Envoi en boucle (ou en Bcc pour protéger la vie privée)
        await transporter.sendMail({
            from: `"EHPAD Crécy" <${process.env.EMAIL_USER}>`,
            bcc: targets, // Envoi caché à la liste
            subject: subjectText,
            text: `${messageText}\n\nAccédez à l'espace ici : ${process.env.URL || "https://ehpadcrecy.netlify.app"}/galerie`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2 style="color: #c05621;">${subjectHtml}</h2>
                    <p>${messageHtml}</p>
                    <p>
                        <a href="${process.env.URL || "https://ehpadcrecy.netlify.app"}/galerie"
                           style="background-color: #c05621; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                           Voir les nouveautés
                        </a>
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Ceci est une notification automatique de votre EHPAD.</p>
                </div>
            `
        });

        return json(200, { message: `Notification envoyée à ${targets.length} destinataire(s)` });
    } catch (error) {
        logFunctionError("send-notification", error, context.awsRequestId);
        return json(validationStatus(error), { error: error instanceof Error ? error.message : "Échec de l’envoi" });
    }
};

export { handler };
