const { reponseErreur } = require('../utils/response');

const validerEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validerMotDePasse = (motDePasse) => {
    return motDePasse && motDePasse.length >= 8;
};

const validerTelephone = (telephone) => {
    const regex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
    return regex.test(telephone);
};

const validerInscription = (req, res, next) => {
    const { nom, prenom, email, motDePasse, telephone } = req.body;

    const erreurs = [];

    if (!nom || nom.trim().length < 2) {
        erreurs.push('Le nom doit contenir au moins 2 caractères');
    }

    if (!prenom || prenom.trim().length < 2) {
        erreurs.push('Le prénom doit contenir au moins 2 caractères');
    }

    if (!email || !validerEmail(email)) {
        erreurs.push('Email invalide');
    }

    if (!motDePasse || !validerMotDePasse(motDePasse)) {
        erreurs.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (telephone && !validerTelephone(telephone)) {
        erreurs.push('Numéro de téléphone invalide');
    }

    if (erreurs.length > 0) {
        return reponseErreur(res, 'Erreurs de validation', 400, erreurs);
    }

    next();
};

const validerConnexion = (req, res, next) => {
    const { email, motDePasse } = req.body;

    const erreurs = [];

    if (!email || !validerEmail(email)) {
        erreurs.push('Email invalide');
    }

    if (!motDePasse) {
        erreurs.push('Mot de passe requis');
    }

    if (erreurs.length > 0) {
        return reponseErreur(res, 'Erreurs de validation', 400, erreurs);
    }

    next();
};

const validerSalle = (req, res, next) => {
    const { nom, description, capacite, prix, adresse } = req.body;

    const erreurs = [];

    if (!nom || nom.trim().length < 3) {
        erreurs.push('Le nom de la salle doit contenir au moins 3 caractères');
    }

    if (!description || description.trim().length < 10) {
        erreurs.push('La description doit contenir au moins 10 caractères');
    }

    if (!capacite || capacite < 1) {
        erreurs.push('La capacité doit être supérieure à 0');
    }

    if (!prix || prix < 0) {
        erreurs.push('Le prix doit être positif');
    }

    if (!adresse || !adresse.rue || !adresse.ville || !adresse.codePostal) {
        erreurs.push('Adresse complète requise (rue, ville, code postal)');
    }

    if (erreurs.length > 0) {
        return reponseErreur(res, 'Erreurs de validation', 400, erreurs);
    }

    next();
};

const validerReservation = (req, res, next) => {
    const { salleId, dateDebut, dateFin, typeEvenement } = req.body;

    const erreurs = [];

    if (!salleId) {
        erreurs.push('ID de la salle requis');
    }

    if (!dateDebut || !dateFin) {
        erreurs.push('Dates de début et de fin requises');
    }

    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
        erreurs.push('La date de fin doit être postérieure à la date de début');
    }

    if (dateDebut && new Date(dateDebut) < new Date()) {
        erreurs.push('La date de début ne peut pas être dans le passé');
    }

    if (!typeEvenement) {
        erreurs.push('Type d\'événement requis');
    }

    if (erreurs.length > 0) {
        return reponseErreur(res, 'Erreurs de validation', 400, erreurs);
    }

    next();
};

module.exports = {
    validerInscription,
    validerConnexion,
    validerSalle,
    validerReservation,
    validerEmail,
    validerMotDePasse,
    validerTelephone,
};
