const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: [true, 'Un utilisateur est requis'],
    },
    salle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salle',
        required: [true, 'Une salle est requise'],
    },
    dateDebut: {
        type: Date,
        required: [true, 'La date de début est requise'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'La date de début doit être dans le futur',
        },
    },
    dateFin: {
        type: Date,
        required: [true, 'La date de fin est requise'],
        validate: {
            validator: function(value) {
                return value > this.dateDebut;
            },
            message: 'La date de fin doit être postérieure à la date de début',
        },
    },
    typeEvenement: {
        type: String,
        required: [true, 'Le type d\'événement est requis'],
        enum: {
            values: ['reunion', 'conference', 'exposition', 'formation', 'spectacle', 'mariage', 'anniversaire', 'autre'],
            message: 'Type d\'événement invalide',
        },
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },
    nombreParticipants: {
        type: Number,
        required: [true, 'Le nombre de participants est requis'],
        min: [1, 'Le nombre de participants doit être d\'au moins 1'],
    },
    statut: {
        type: String,
        enum: ['en_attente', 'confirmee', 'annulee', 'terminee', 'en_cours'],
        default: 'en_attente',
    },
    prixTotal: {
        type: Number,
        required: [true, 'Le prix total est requis'],
        min: [0, 'Le prix total ne peut pas être négatif'],
    },
    paiement: {
        statut: {
            type: String,
            enum: ['en_attente', 'paye', 'rembourse', 'echec'],
            default: 'en_attente',
        },
        methode: {
            type: String,
            enum: ['carte', 'virement', 'cheque', 'especes'],
        },
        transactionId: String,
        datePaiement: Date,
    },
    equipementsSupplementaires: [{
        nom: String,
        quantite: Number,
        prix: Number,
    }],
    commentaires: {
        utilisateur: String,
        gestionnaire: String,
        admin: String,
    },
    historique: [{
        action: {
            type: String,
            enum: ['creation', 'modification', 'confirmation', 'annulation', 'paiement', 'remboursement'],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        utilisateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Utilisateur',
        },
        details: String,
    }],
    rappels: [{
        type: {
            type: String,
            enum: ['email', 'sms', 'notification'],
        },
        date: Date,
        envoye: {
            type: Boolean,
            default: false,
        },
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

reservationSchema.virtual('duree').get(function() {
    return Math.ceil((this.dateFin - this.dateDebut) / (1000 * 60 * 60));
});

reservationSchema.virtual('estActive').get(function() {
    const maintenant = new Date();
    return this.dateDebut <= maintenant && this.dateFin >= maintenant && this.statut === 'confirmee';
});

reservationSchema.virtual('estTerminee').get(function() {
    return new Date() > this.dateFin;
});

reservationSchema.pre('save', function(next) {
    if (this.isNew) {
        this.historique.push({
            action: 'creation',
            utilisateur: this.utilisateur,
            details: 'Réservation créée',
        });
    }
    next();
});

reservationSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'utilisateur',
        select: 'nom prenom email telephone',
    }).populate({
        path: 'salle',
        select: 'nom adresse prix',
    });
    next();
});

reservationSchema.index({ utilisateur: 1 });
reservationSchema.index({ salle: 1 });
reservationSchema.index({ dateDebut: 1, dateFin: 1 });
reservationSchema.index({ statut: 1 });
reservationSchema.index({ typeEvenement: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
