const mongoose = require('mongoose');
const sequelize = require('../config/postgres');

const UtilisateurMongo = require('./utilisateur');
const SalleMongo = require('./salle');
const ReservationMongo = require('./reservation');

const { DataTypes } = require('sequelize');

const UtilisateurPostgres = sequelize.define('Utilisateur', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    motDePasse: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('utilisateur', 'gestionnaire', 'admin'),
        defaultValue: 'utilisateur',
    },
    emailVerifie: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tokenVerification: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    tokenResetMotDePasse: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    tokenResetExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    actif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'utilisateurs',
    timestamps: true,
    underscored: true,
});

const SallePostgres = sequelize.define('Salle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    capacite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    adresse: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    coordonnees: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    equipements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    gestionnaireId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UtilisateurPostgres,
            key: 'id',
        },
    },
}, {
    tableName: 'salles',
    timestamps: true,
    underscored: true,
});

const ReservationPostgres = sequelize.define('Reservation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    utilisateurId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UtilisateurPostgres,
            key: 'id',
        },
    },
    salleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: SallePostgres,
            key: 'id',
        },
    },
    dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dateFin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    typeEvenement: {
        type: DataTypes.ENUM('reunion', 'conference', 'exposition', 'formation', 'spectacle', 'autre'),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    nombreParticipants: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
        },
    },
    statut: {
        type: DataTypes.ENUM('en_attente', 'confirmee', 'annulee', 'terminee'),
        defaultValue: 'en_attente',
    },
    prixTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    commentaires: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'reservations',
    timestamps: true,
    underscored: true,
});

UtilisateurPostgres.hasMany(SallePostgres, {
    foreignKey: 'gestionnaireId',
    as: 'sallesGerees'
});
SallePostgres.belongsTo(UtilisateurPostgres, {
    foreignKey: 'gestionnaireId',
    as: 'gestionnaire'
});

UtilisateurPostgres.hasMany(ReservationPostgres, {
    foreignKey: 'utilisateurId',
    as: 'reservations'
});
ReservationPostgres.belongsTo(UtilisateurPostgres, {
    foreignKey: 'utilisateurId',
    as: 'utilisateur'
});

SallePostgres.hasMany(ReservationPostgres, {
    foreignKey: 'salleId',
    as: 'reservations'
});
ReservationPostgres.belongsTo(SallePostgres, {
    foreignKey: 'salleId',
    as: 'salle'
});

module.exports = {
    mongoose,
    sequelize,
    UtilisateurMongo,
    SalleMongo,
    ReservationMongo,
    UtilisateurPostgres,
    SallePostgres,
    ReservationPostgres,
};
