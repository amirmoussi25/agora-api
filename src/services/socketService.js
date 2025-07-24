const logger = require('../utils/logger');

class SocketService {
    constructor() {
        this.io = null;
        this.utilisateursConnectes = new Map();
    }

    initialiser(io) {
        this.io = io;

        this.io.on('connection', (socket) => {
            logger.info(`Nouvelle connexion Socket.IO: ${socket.id}`);

            socket.on('authentification', (data) => {
                this.gererAuthentification(socket, data);
            });

            socket.on('rejoindre_salle', (salleId) => {
                this.rejoindreSalle(socket, salleId);
            });

            socket.on('quitter_salle', (salleId) => {
                this.quitterSalle(socket, salleId);
            });

            socket.on('message_chat', (data) => {
                this.gererMessageChat(socket, data);
            });

            socket.on('statut_reservation', (data) => {
                this.gererStatutReservation(socket, data);
            });

            socket.on('notification_lue', (notificationId) => {
                this.marquerNotificationLue(socket, notificationId);
            });

            socket.on('disconnect', () => {
                this.gererDeconnexion(socket);
            });
        });
    }

    gererAuthentification(socket, data) {
        try {
            const { utilisateurId, token } = data;

            if (!utilisateurId || !token) {
                socket.emit('erreur_authentification', { message: 'Données d\'authentification manquantes' });
                return;
            }

            this.utilisateursConnectes.set(socket.id, {
                utilisateurId,
                socket,
                derniereActivite: new Date(),
            });

            socket.join(`utilisateur_${utilisateurId}`);

            socket.emit('authentification_reussie', {
                message: 'Authentification réussie',
                utilisateurId
            });

            logger.info(`Utilisateur ${utilisateurId} authentifié via Socket.IO`);
        } catch (error) {
            logger.error('Erreur lors de l\'authentification Socket.IO:', error);
            socket.emit('erreur_authentification', { message: 'Erreur d\'authentification' });
        }
    }

    rejoindreSalle(socket, salleId) {
        try {
            socket.join(`salle_${salleId}`);
            socket.emit('salle_rejointe', { salleId });

            socket.to(`salle_${salleId}`).emit('utilisateur_rejoint', {
                socketId: socket.id,
                salleId,
            });

            logger.info(`Socket ${socket.id} a rejoint la salle ${salleId}`);
        } catch (error) {
            logger.error('Erreur lors de la jonction à la salle:', error);
            socket.emit('erreur', { message: 'Impossible de rejoindre la salle' });
        }
    }

    quitterSalle(socket, salleId) {
        try {
            socket.leave(`salle_${salleId}`);
            socket.emit('salle_quittee', { salleId });

            socket.to(`salle_${salleId}`).emit('utilisateur_parti', {
                socketId: socket.id,
                salleId,
            });

            logger.info(`Socket ${socket.id} a quitté la salle ${salleId}`);
        } catch (error) {
            logger.error('Erreur lors de la sortie de la salle:', error);
        }
    }

    gererMessageChat(socket, data) {
        try {
            const { salleId, message, utilisateurId } = data;

            if (!salleId || !message || !utilisateurId) {
                socket.emit('erreur', { message: 'Données du message incomplètes' });
                return;
            }

            const messageAvecTimestamp = {
                id: Date.now().toString(),
                utilisateurId,
                message,
                timestamp: new Date(),
                salleId,
            };

            this.io.to(`salle_${salleId}`).emit('nouveau_message', messageAvecTimestamp);

            logger.info(`Message envoyé dans la salle ${salleId} par l'utilisateur ${utilisateurId}`);
        } catch (error) {
            logger.error('Erreur lors de l\'envoi du message:', error);
            socket.emit('erreur', { message: 'Impossible d\'envoyer le message' });
        }
    }

    gererStatutReservation(socket, data) {
        try {
            const { reservationId, nouveauStatut, utilisateurId } = data;

            if (!reservationId || !nouveauStatut) {
                socket.emit('erreur', { message: 'Données de statut incomplètes' });
                return;
            }

            this.io.to(`utilisateur_${utilisateurId}`).emit('statut_reservation_mis_a_jour', {
                reservationId,
                nouveauStatut,
                timestamp: new Date(),
            });

            logger.info(`Statut de réservation ${reservationId} mis à jour: ${nouveauStatut}`);
        } catch (error) {
            logger.error('Erreur lors de la mise à jour du statut:', error);
        }
    }

    marquerNotificationLue(socket, notificationId) {
        try {
            const utilisateur = this.utilisateursConnectes.get(socket.id);

            if (!utilisateur) {
                socket.emit('erreur', { message: 'Utilisateur non authentifié' });
                return;
            }

            socket.emit('notification_marquee_lue', { notificationId });

            logger.info(`Notification ${notificationId} marquée comme lue`);
        } catch (error) {
            logger.error('Erreur lors du marquage de la notification:', error);
        }
    }

    gererDeconnexion(socket) {
        try {
            const utilisateur = this.utilisateursConnectes.get(socket.id);

            if (utilisateur) {
                logger.info(`Utilisateur ${utilisateur.utilisateurId} déconnecté (Socket: ${socket.id})`);
                this.utilisateursConnectes.delete(socket.id);
            } else {
                logger.info(`Socket ${socket.id} déconnecté`);
            }
        } catch (error) {
            logger.error('Erreur lors de la déconnexion:', error);
        }
    }

    envoyerNotificationUtilisateur(utilisateurId, notification) {
        try {
            this.io.to(`utilisateur_${utilisateurId}`).emit('nouvelle_notification', {
                id: Date.now().toString(),
                titre: notification.titre,
                message: notification.message,
                type: notification.type || 'info',
                timestamp: new Date(),
                lue: false,
            });

            logger.info(`Notification envoyée à l'utilisateur ${utilisateurId}`);
        } catch (error) {
            logger.error('Erreur lors de l\'envoi de notification:', error);
        }
    }

    envoyerMiseAJourReservation(utilisateurId, reservation) {
        try {
            this.io.to(`utilisateur_${utilisateurId}`).emit('reservation_mise_a_jour', {
                reservation,
                timestamp: new Date(),
            });

            logger.info(`Mise à jour de réservation envoyée à l'utilisateur ${utilisateurId}`);
        } catch (error) {
            logger.error('Erreur lors de l\'envoi de mise à jour:', error);
        }
    }

    diffuserMiseAJourSalle(salleId, salle) {
        try {
            this.io.to(`salle_${salleId}`).emit('salle_mise_a_jour', {
                salle,
                timestamp: new Date(),
            });

            logger.info(`Mise à jour de salle ${salleId} diffusée`);
        } catch (error) {
            logger.error('Erreur lors de la diffusion de mise à jour:', error);
        }
    }

    obtenirUtilisateursConnectes() {
        return Array.from(this.utilisateursConnectes.values()).map(utilisateur => ({
            utilisateurId: utilisateur.utilisateurId,
            derniereActivite: utilisateur.derniereActivite,
        }));
    }

    obtenirNombreConnexions() {
        return this.utilisateursConnectes.size;
    }
}

module.exports = new SocketService();
