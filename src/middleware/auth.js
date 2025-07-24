const jwt = require('jsonwebtoken');
const { reponseErreur } = require('../utils/response');

const verifierToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reponseErreur(res, 'Token d\'accès requis', 401);
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.utilisateur = decoded;
        next();
    } catch (error) {
        return reponseErreur(res, 'Token invalide', 401);
    }
};

const verifierRole = (...rolesAutorises) => {
    return (req, res, next) => {
        if (!req.utilisateur) {
            return reponseErreur(res, 'Utilisateur non authentifié', 401);
        }

        if (!rolesAutorises.includes(req.utilisateur.role)) {
            return reponseErreur(res, 'Accès non autorisé', 403);
        }

        next();
    };
};

const optionnel = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.utilisateur = null;
        return next();
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.utilisateur = decoded;
    } catch (error) {
        req.utilisateur = null;
    }

    next();
};

module.exports = {
    verifierToken,
    verifierRole,
    optionnel,
};
