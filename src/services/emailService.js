const { Resend } = require('resend');
const logger = require('../utils/logger');

const resend = new Resend(process.env.RESEND_API_KEY);

const envoyerEmail = async (destinataire, sujet, contenuHtml, contenuTexte = null) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Agora <noreply@agora-app.fr>',
            to: [destinataire],
            subject: sujet,
            html: contenuHtml,
            text: contenuTexte,
        });

        if (error) {
            logger.error('Erreur lors de l\'envoi d\'email:', error);
            throw new Error(`Erreur d'envoi d'email: ${error.message}`);
        }

        logger.info(`Email envoyé avec succès à ${destinataire}`, { emailId: data.id });
        return data;
    } catch (error) {
        logger.error('Erreur dans envoyerEmail:', error);
        throw error;
    }
};

const envoyerEmailVerification = async (utilisateur, tokenVerification) => {
    const lienVerification = `${process.env.FRONTEND_URL}/verification-email?token=${tokenVerification}`;

    const contenuHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vérification de votre compte Agora</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e11d48; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background-color: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenue sur Agora !</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</h2>
          <p>Merci de vous être inscrit sur Agora, la plateforme de location de salles municipales.</p>
          <p>Pour finaliser votre inscription, veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email :</p>
          <div style="text-align: center;">
            <a href="${lienVerification}" class="button">Vérifier mon email</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${lienVerification}</p>
          <p>Ce lien expirera dans 24 heures.</p>
          <p>Si vous n'avez pas créé de compte sur Agora, vous pouvez ignorer cet email.</p>
        </div>
        <div class="footer">
          <p>© 2025 Agora - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const contenuTexte = `
    Bonjour ${utilisateur.prenom} ${utilisateur.nom},
    
    Merci de vous être inscrit sur Agora.
    
    Pour vérifier votre email, cliquez sur ce lien : ${lienVerification}
    
    Ce lien expirera dans 24 heures.
    
    © 2025 Agora
  `;

    return await envoyerEmail(
        utilisateur.email,
        'Vérifiez votre compte Agora',
        contenuHtml,
        contenuTexte
    );
};

const envoyerEmailResetMotDePasse = async (utilisateur, tokenReset) => {
    const lienReset = `${process.env.FRONTEND_URL}/reset-mot-de-passe?token=${tokenReset}`;

    const contenuHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation de votre mot de passe</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e11d48; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background-color: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Réinitialisation du mot de passe</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur Agora.</p>
          <div class="warning">
            <p><strong>Attention :</strong> Ce lien n'est valide que pendant 10 minutes pour des raisons de sécurité.</p>
          </div>
          <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center;">
            <a href="${lienReset}" class="button">Réinitialiser mon mot de passe</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${lienReset}</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe restera inchangé.</p>
        </div>
        <div class="footer">
          <p>© 2025 Agora - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const contenuTexte = `
    Bonjour ${utilisateur.prenom} ${utilisateur.nom},
    
    Vous avez demandé la réinitialisation de votre mot de passe sur Agora.
    
    Cliquez sur ce lien pour réinitialiser votre mot de passe : ${lienReset}
    
    Ce lien n'est valide que pendant 10 minutes.
    
    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
    
    © 2025 Agora
  `;

    return await envoyerEmail(
        utilisateur.email,
        'Réinitialisation de votre mot de passe Agora',
        contenuHtml,
        contenuTexte
    );
};

const envoyerEmailConfirmationReservation = async (utilisateur, reservation, salle) => {
    const contenuHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de réservation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e11d48; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .reservation-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .success { background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Réservation confirmée !</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</h2>
          <div class="success">
            <p><strong>Excellente nouvelle !</strong> Votre réservation a été confirmée.</p>
          </div>
          
          <div class="reservation-details">
            <h3>Détails de votre réservation</h3>
            <div class="detail-row">
              <span class="label">Numéro de réservation :</span>
              <span class="value">#${reservation._id.toString().substring(0, 8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Salle :</span>
              <span class="value">${salle.nom}</span>
            </div>
            <div class="detail-row">
              <span class="label">Adresse :</span>
              <span class="value">${salle.adresse.rue}, ${salle.adresse.codePostal} ${salle.adresse.ville}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date de début :</span>
              <span class="value">${new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date de fin :</span>
              <span class="value">${new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</span>
            </div>
            <div class="detail-row">
              <span class="label">Type d'événement :</span>
              <span class="value">${reservation.typeEvenement}</span>
            </div>
            <div class="detail-row">
              <span class="label">Nombre de participants :</span>
              <span class="value">${reservation.nombreParticipants}</span>
            </div>
            <div class="detail-row">
              <span class="label">Prix total :</span>
              <span class="value">${reservation.prixTotal}€</span>
            </div>
          </div>
          
          <p>Nous vous rappelons de respecter les conditions d'utilisation de la salle et de la laisser propre après votre événement.</p>
          <p>En cas de questions, n'hésitez pas à nous contacter.</p>
        </div>
        <div class="footer">
          <p>© 2025 Agora - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const contenuTexte = `
    Bonjour ${utilisateur.prenom} ${utilisateur.nom},
    
    Votre réservation a été confirmée !
    
    Détails de votre réservation :
    - Numéro : #${reservation._id.toString().substring(0, 8).toUpperCase()}
    - Salle : ${salle.nom}
    - Adresse : ${salle.adresse.rue}, ${salle.adresse.codePostal} ${salle.adresse.ville}
    - Début : ${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
    - Fin : ${new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
    - Type : ${reservation.typeEvenement}
    - Participants : ${reservation.nombreParticipants}
    - Prix total : ${reservation.prixTotal}€
    
    © 2025 Agora
  `;

    return await envoyerEmail(
        utilisateur.email,
        'Confirmation de votre réservation Agora',
        contenuHtml,
        contenuTexte
    );
};

const envoyerEmailAnnulationReservation = async (utilisateur, reservation, salle, raison = '') => {
    const contenuHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Annulation de réservation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .reservation-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Réservation annulée</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</h2>
          <div class="warning">
            <p><strong>Votre réservation a été annulée.</strong></p>
            ${raison ? `<p>Raison : ${raison}</p>` : ''}
          </div>
          
          <div class="reservation-details">
            <h3>Détails de la réservation annulée</h3>
            <div class="detail-row">
              <span class="label">Numéro de réservation :</span>
              <span class="value">#${reservation._id.toString().substring(0, 8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Salle :</span>
              <span class="value">${salle.nom}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date prévue :</span>
              <span class="value">${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</span>
            </div>
            <div class="detail-row">
              <span class="label">Prix :</span>
              <span class="value">${reservation.prixTotal}€</span>
            </div>
          </div>
          
          <p>Si un paiement a été effectué, le remboursement sera traité dans les prochains jours ouvrables.</p>
          <p>Nous nous excusons pour tout désagrément causé.</p>
        </div>
        <div class="footer">
          <p>© 2025 Agora - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const contenuTexte = `
    Bonjour ${utilisateur.prenom} ${utilisateur.nom},
    
    Votre réservation a été annulée.
    ${raison ? `Raison : ${raison}` : ''}
    
    Détails :
    - Numéro : #${reservation._id.toString().substring(0, 8).toUpperCase()}
    - Salle : ${salle.nom}
    - Date : ${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
    - Prix : ${reservation.prixTotal}€
    
    Le remboursement sera traité si applicable.
    
    © 2025 Agora
  `;

    return await envoyerEmail(
        utilisateur.email,
        'Annulation de votre réservation Agora',
        contenuHtml,
        contenuTexte
    );
};

const envoyerEmailRappelReservation = async (utilisateur, reservation, salle, heuresAvant = 24) => {
    const contenuHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rappel de réservation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0ea5e9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .reservation-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .info { background-color: #dbeafe; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rappel de réservation</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${utilisateur.prenom} ${utilisateur.nom},</h2>
          <div class="info">
            <p><strong>Rappel :</strong> Votre réservation commence dans ${heuresAvant} heures.</p>
          </div>
          
          <div class="reservation-details">
            <h3>Détails de votre réservation</h3>
            <div class="detail-row">
              <span class="label">Salle :</span>
              <span class="value">${salle.nom}</span>
            </div>
            <div class="detail-row">
              <span class="label">Adresse :</span>
              <span class="value">${salle.adresse.rue}, ${salle.adresse.codePostal} ${salle.adresse.ville}</span>
            </div>
            <div class="detail-row">
              <span class="label">Début :</span>
              <span class="value">${new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fin :</span>
              <span class="value">${new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</span>
            </div>
          </div>
          
          <p>N'oubliez pas d'apporter une pièce d'identité et de respecter les horaires de votre réservation.</p>
          <p>Passez un excellent événement !</p>
        </div>
        <div class="footer">
          <p>© 2025 Agora - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const contenuTexte = `
    Bonjour ${utilisateur.prenom} ${utilisateur.nom},
    
    Rappel : Votre réservation commence dans ${heuresAvant} heures.
    
    Détails :
    - Salle : ${salle.nom}
    - Adresse : ${salle.adresse.rue}, ${salle.adresse.codePostal} ${salle.adresse.ville}
    - Début : ${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
    - Fin : ${new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
    
    N'oubliez pas votre pièce d'identité !
    
    © 2025 Agora
  `;

    return await envoyerEmail(
        utilisateur.email,
        'Rappel : Votre réservation Agora approche',
        contenuHtml,
        contenuTexte
    );
};

module.exports = {
    envoyerEmail,
    envoyerEmailVerification,
    envoyerEmailResetMotDePasse,
    envoyerEmailConfirmationReservation,
    envoyerEmailAnnulationReservation,
    envoyerEmailRappelReservation,
};
