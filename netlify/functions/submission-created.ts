import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event) => {
    // Parsing du payload Netlify Forms
    // Documentation: https://docs.netlify.com/functions/trigger-on-events/#submission-created
    const body = JSON.parse(event.body || "{}");
    const { payload } = body;

    if (!payload) {
        return { statusCode: 400, body: "Payload manquant" };
    }

    const { data } = payload;
    const { subject, firstName, lastName, email, message, phone } = data;

    // --- LOGIQUE DE ROUTAGE ---
    let to = "";
    const cc = "technique@ehpad-crecy.fr"; // Copie technique pour tout le monde

    if (subject === "recrutement") {
        to = "rh@ehpad-crecy.fr";
    } else {
        // Pour "information", "visite", "admission", "autre"...
        to = "accueil@ehpad-crecy.fr";
    }

    // Configuration du transporteur (Même config que les autres fonctions)
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
        await transporter.sendMail({
            from: `"Site Web EHPAD" <${process.env.EMAIL_USER}>`,
            to: to,
            cc: cc,
            replyTo: email, // Permet de répondre direct à la personne
            subject: `[Contact Web] ${subject.toUpperCase()} - ${firstName} ${lastName}`,
            text: `
Nouveau message via le site web

Sujet : ${subject}
De : ${firstName} ${lastName} (${email})
Téléphone : ${phone || "Non renseigné"}

Message :
${message}
            `,
            html: `
<div style="font-family: sans-serif; color: #333;">
    <h2 style="color: #c05621;">Nouveau message via le site web</h2>
    <p><strong>Sujet :</strong> ${subject}</p>
    <p><strong>De :</strong> ${firstName} ${lastName} (<a href="mailto:${email}">${email}</a>)</p>
    <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p style="white-space: pre-line;">${message}</p>
    </div>
    <br>
    <p style="font-size: 12px; color: #666;">Ce message a été envoyé depuis le formulaire de contact.</p>
</div>
            `,
        });

        console.log(`[submission-created] Email route pour '${subject}' envoyé à ${to} (CC: ${cc})`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent" }),
        };
    } catch (error: any) {
        console.error("[submission-created] Erreur envoi email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

export { handler };
