const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Erreur capturée:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });

    if (err.name === 'ValidationError') {
        const erreurs = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            statut: 'erreur',
            message: 'Erreur de validation',
            erreurs,
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            statut: 'erreur',
            message: 'Format d\'ID invalide',
        });
    }

    if (err.code === 11000) {
        const champ = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            statut: 'erreur',
            message: `${champ} déjà existant`,
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            statut: 'erreur',
            message: 'Token invalide',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            statut: 'erreur',
            message: 'Token expiré',
        });
    }

    res.status(err.statusCode || 500).json({
        statut: 'erreur',
        message: err.message || 'Erreur interne du serveur',
    });
};

module.exports = errorHandler;
