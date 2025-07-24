const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const utilisateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        maxlength: [100, 'Le prénom ne peut pas dépasser 100 caractères'],
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
    },
    motDePasse: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
        select: false,
    },
    telephone: {
        type: String,
        trim: true,
        match: [/^(?:\+33|0)[1-9](?:[0-9]{8})$/, 'Numéro de téléphone invalide'],
    },
    role: {
        type: String,
        enum: ['utilisateur', 'gestionnaire', 'admin'],
        default: 'utilisateur',
    },
    avatar: {
        type: String,
        default: null,
    },
    adresse: {
        rue: String,
        ville: String,
        codePostal: String,
        pays: {
            type: String,
            default: 'France',
        },
    },
    preferences: {
        notifications: {
            email: {
                type: Boolean,
                default: true,
            },
            push: {
                type: Boolean,
                default: true,
            },
        },
        langue: {
            type: String,
            default: 'fr',
            enum: ['fr', 'en'],
        },
    },
    emailVerifie: {
        type: Boolean,
        default: false,
    },
    tokenVerification: String,
    tokenResetMotDePasse: String,
    tokenResetExpiration: Date,
    derniereConnexion: Date,
    actif: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

utilisateurSchema.virtual('nomComplet').get(function() {
    return `${this.prenom} ${this.nom}`;
});

utilisateurSchema.pre('save', async function(next) {
    if (!this.isModified('motDePasse')) return next();

    this.motDePasse = await bcrypt.hash(this.motDePasse, 12);
    next();
});

utilisateurSchema.methods.verifierMotDePasse = async function(motDePasseCandidat) {
    return await bcrypt.compare(motDePasseCandidat, this.motDePasse);
};

utilisateurSchema.methods.creerTokenResetMotDePasse = function() {
    const resetToken = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    this.tokenResetMotDePasse = resetToken;
    this.tokenResetExpiration = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

utilisateurSchema.index({ email: 1 });
utilisateurSchema.index({ role: 1 });
utilisateurSchema.index({ actif: 1 });

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
