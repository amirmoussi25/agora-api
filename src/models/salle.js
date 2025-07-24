const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom de la salle est requis'],
        trim: true,
        maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
    },
    description: {
        type: String,
        required: [true, 'La description est requise'],
        trim: true,
        maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
    },
    capacite: {
        type: Number,
        required: [true, 'La capacité est requise'],
        min: [1, 'La capacité doit être d\'au moins 1 personne'],
        max: [10000, 'La capacité ne peut pas dépasser 10000 personnes'],
    },
    prix: {
        type: Number,
        required: [true, 'Le prix est requis'],
        min: [0, 'Le prix ne peut pas être négatif'],
    },
    uniteTemps: {
        type: String,
        enum: ['heure', 'demi-journee', 'journee'],
        default: 'heure',
    },
    adresse: {
        rue: {
            type: String,
            required: [true, 'La rue est requise'],
        },
        ville: {
            type: String,
            required: [true, 'La ville est requise'],
        },
        codePostal: {
            type: String,
            required: [true, 'Le code postal est requis'],
            match: [/^[0-9]{5}$/, 'Code postal invalide'],
        },
        pays: {
            type: String,
            default: 'France',
        },
    },
    coordonnees: {
        latitude: {
            type: Number,
            min: [-90, 'Latitude invalide'],
            max: [90, 'Latitude invalide'],
        },
        longitude: {
            type: Number,
            min: [-180, 'Longitude invalide'],
            max: [180, 'Longitude invalide'],
        },
    },
    equipements: [{
        nom: {
            type: String,
            required: true,
        },
        description: String,
        quantite: {
            type: Number,
            default: 1,
        },
    }],
    images: [{
        url: {
            type: String,
            required: true,
        },
        description: String,
        principale: {
            type: Boolean,
            default: false,
        },
    }],
    horaires: {
        lundi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
        mardi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
        mercredi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
        jeudi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
        vendredi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
        samedi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
        dimanche: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: true } },
    },
    regles: [{
        titre: String,
        description: String,
    }],
    disponible: {
        type: Boolean,
        default: true,
    },
    datesMaintenance: [{
        debut: Date,
        fin: Date,
        raison: String,
    }],
    gestionnaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: [true, 'Un gestionnaire est requis'],
    },
    statistiques: {
        nombreReservations: {
            type: Number,
            default: 0,
        },
        notemoyenne: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        nombreAvis: {
            type: Number,
            default: 0,
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

salleSchema.virtual('adresseComplete').get(function() {
    return `${this.adresse.rue}, ${this.adresse.codePostal} ${this.adresse.ville}`;
});

salleSchema.virtual('imagePrincipale').get(function() {
    const imagePrincipale = this.images.find(img => img.principale);
    return imagePrincipale ? imagePrincipale.url : (this.images[0] ? this.images[0].url : null);
});

salleSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'gestionnaire',
        select: 'nom prenom email telephone',
    });
    next();
});

salleSchema.index({ 'adresse.ville': 1 });
salleSchema.index({ capacite: 1 });
salleSchema.index({ prix: 1 });
salleSchema.index({ disponible: 1 });
salleSchema.index({ 'coordonnees.latitude': 1, 'coordonnees.longitude': 1 });

module.exports = mongoose.model('Salle', salleSchema);
