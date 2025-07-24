const reponseSucces = (res, donnees, message = 'Opération réussie', statut = 200) => {
    return res.status(statut).json({
        statut: 'succès',
        message,
        donnees,
    });
};

const reponseErreur = (res, message = 'Une erreur est survenue', statut = 500, erreurs = null) => {
    return res.status(statut).json({
        statut: 'erreur',
        message,
        erreurs,
    });
};

const reponsePagination = (res, donnees, pagination, message = 'Données récupérées avec succès') => {
    return res.status(200).json({
        statut: 'succès',
        message,
        donnees,
        pagination,
    });
};

module.exports = {
    reponseSucces,
    reponseErreur,
    reponsePagination,
};
