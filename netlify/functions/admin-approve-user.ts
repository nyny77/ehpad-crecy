import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

export const handler: Handler = async (event, context) => {
    // 1. Security Check
    const { user, identity } = context.clientContext || {};
    if (!user || !user.app_metadata?.roles?.includes("admin")) {
        return { statusCode: 403, body: "Forbidden: Admin access required" };
    }

    // 2. Parse Body
    let body;
    try {
        body = JSON.parse(event.body || "{}");
    } catch (e) {
        return { statusCode: 400, body: "Invalid JSON" };
    }

    const { userId, role = "famille" } = body;
    if (!userId) {
        return { statusCode: 400, body: "Missing userId" };
    }

    // 3. Update User Role in Netlify Identity
    let userEmail = "";
    try {
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

    } catch (error: any) {
        console.error("Identity API Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to update user role" }) };
    }

    // 4. Send Email Notification
    // Skip email if no credentials (dev mode safety, though we want to test it)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User approved, but email skipped (no credentials)" }),
        };
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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User approved and email sent" }),
        };
    } catch (error: any) {
        console.error("Email Error:", error);
        // We still return 200 because the user WAS updated, just email failed.
        // But we warn in the body.
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User approved, but email failed", error: error.message }),
        };
    }
};
