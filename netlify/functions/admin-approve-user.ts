import type { Handler } from "@netlify/functions";
import { logFunctionError } from "./_shared/technical-log";
import nodemailer from "nodemailer";
import { isAdminRequest, json } from "./_shared/admin-auth";
import { parseJsonObject, validationStatus } from "./_shared/request-security";

export const handler: Handler = async (event, context) => {
    // 1. Security Check
    if (!isAdminRequest(context)) return json(403, { error: "Accès administrateur requis" });
    if (event.httpMethod !== "POST") return json(405, { error: "Méthode non autorisée" });
    const { identity } = context.clientContext || {};
    if (!identity?.url || !identity.token) return json(503, { error: "Service d’identité indisponible" });

    try {
        const body = parseJsonObject(event.body, 8 * 1024);
        const userId = String(body.userId || "").trim();
        const role = String(body.role || "famille").trim();
        if (!/^[a-zA-Z0-9-]{6,100}$/.test(userId)) return json(400, { error: "Identifiant utilisateur invalide" });
        if (!new Set(["famille", "admin"]).has(role)) return json(400, { error: "Rôle invalide" });

    // 3. Update User Role in Netlify Identity
        let userEmail = "";
        // First get the user to know their email (for the notification)
        const getUserResponse = await fetch(`${identity.url}/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${identity.token}` },
        });

        if (!getUserResponse.ok) {
            throw new Error("User not found");
        }

        const userData = await getUserResponse.json();
        userEmail = userData.email;

        // Update the user
        const updateResponse = await fetch(`${identity.url}/admin/users/${userId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${identity.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                app_metadata: {
                    roles: [role],
                },
            }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update user role: ${updateResponse.statusText}`);
        }


    // 4. Send Email Notification
    // Skip email if no credentials (dev mode safety, though we want to test it)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return json(200, { message: "Utilisateur approuvé ; notification non configurée" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "587"),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const loginUrl = process.env.URL || "https://ehpad-crecy.netlify.app";

        await transporter.sendMail({
            from: `"EHPAD de Crécy" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "🎉 Votre compte EHPAD a été validé !",
            text: `Bonjour,\n\nBonne nouvelle ! Votre compte a été validé par l'administration.\n\nVous pouvez désormais consulter les actualités et la galerie photos.\n\nConnectez-vous ici : ${loginUrl}/galerie\n\nÀ très bientôt,\nL'équipe de l'EHPAD`,
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="${loginUrl}/images/logo.png" alt="EHPAD de Crécy" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
                        </div>
                        <h2 style="color: #C80040; margin-top: 0; text-align: center;">🎉 Compte validé !</h2>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Bonjour,</p>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                            Nous avons le plaisir de vous informer que votre compte a été <strong>validé par l'équipe technique</strong>.
                        </p>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                            Vous avez désormais un accès complet à l'espace <strong>"Vie Sociale"</strong>. Retrouvez dès maintenant les photos et actualités de l'EHPAD de Crécy.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginUrl}/galerie"
                               style="background-color: #C80040; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                               Accéder à l'Espace Famille
                            </a>
                        </div>
                        <p style="color: #718096; font-size: 14px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            Si le bouton ne fonctionne pas, copiez ce lien : <br>
                            <a href="${loginUrl}/galerie" style="color: #C80040;">${loginUrl}/galerie</a>
                        </p>
                    </div>
                    <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 20px;">
                        Ceci est un message automatique de l'EHPAD de Crécy-la-Chapelle.
                    </p>
                </div>
            `
        });

        return json(200, { message: "Utilisateur approuvé et notification envoyée" });
    } catch (error) {
        logFunctionError("admin-approve-user:email", error, context.awsRequestId);
        return json(200, { message: "Utilisateur approuvé ; notification non envoyée" });
    }
    } catch (error) {
        logFunctionError("admin-approve-user:identity", error, context.awsRequestId);
        return json(validationStatus(error), { error: "Approbation de l’utilisateur impossible" });
    }
};
