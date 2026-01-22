
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { user } = JSON.parse(event.body || "{}");

    // Vérifier si les variables d'environnement sont configurées
    // Le client peut utiliser un service comme Gmail, Outlook, ou SendGrid (SMTP)
    const requiredEnvVars = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS", "ADMIN_EMAIL"];
    const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

    if (missingEnvVars.length > 0) {
        console.warn(`[identity-signup] Missing env vars: ${missingEnvVars.join(", ")}. Skipping email.`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email config missing, skipping notification." }),
        };
    }

    // Configuration du transporteur SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true", // true pour 465, false pour les autres
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"EHPAD Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL, // L'adresse de l'admin
        subject: `[EHPAD] Nouvelle inscription : ${user.user_metadata?.full_name || user.email}`,
        text: `
      Nouvelle inscription sur le site de l'EHPAD !

      Email: ${user.email}
      Nom: ${user.user_metadata?.full_name || "Non renseigné"}
      Rôle demandé : ${user.user_metadata?.role_requested || "Non spécifié"}
      ${user.user_metadata?.role_requested === 'famille' ? `Lien avec le résident : ${user.user_metadata?.relation_display || "Non spécifié"}` : ""}
      
      Action requise :
      1. Connectez-vous à Netlify > Identity.
      2. Vérifiez l'utilisateur.
      3. Ajoutez le rôle "${user.user_metadata?.role_requested === 'admin' ? 'admin' : 'famille'}" pour valider l'accès.
    `,
        html: `
      <h3>Nouvelle inscription sur le site de l'EHPAD</h3>
      <p>Un nouvel utilisateur vient de créer un compte :</p>
      <ul>
        <li><strong>Email :</strong> ${user.email}</li>
        <li><strong>Nom :</strong> ${user.user_metadata?.full_name || "Non renseigné"}</li>
        <li><strong>Rôle demandé :</strong> ${user.user_metadata?.role_requested || "Non spécifié"}</li>
        ${user.user_metadata?.role_requested === 'famille' ? `<li><strong>Lien avec le résident :</strong> ${user.user_metadata?.relation_display || "Non spécifié"}</li>` : ""}
      </ul>
      <hr />
      <p><strong>Action requise :</strong></p>
      <ol>
        <li>Connectez-vous à votre tableau de bord Netlify > Identity.</li>
        <li>Vérifiez l'identité de la personne.</li>
        <li>Attribuez-lui le rôle <code style="background: #eee; padding: 2px 5px; border-radius: 3px;">${user.user_metadata?.role_requested === 'admin' ? 'admin' : 'famille'}</code> pour valider son accès.</li>
      </ol>
      <p><a href="https://app.netlify.com">Accéder à Netlify</a></p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[identity-signup] Notification email sent to ${process.env.ADMIN_EMAIL} for user ${user.email}`);
    } catch (error) {
        console.error("[identity-signup] Error sending email:", error);
        // On ne bloque pas l'inscription même si l'email échoue
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Signup processed" }),
    };
};

export { handler };
