require('dotenv').config();
const { server, initializeDatabase } = require('./app');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await initializeDatabase();

        server.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📚 Documentation disponible sur http://localhost:${PORT}/api-docs`);
            console.log(`🏥 Health check disponible sur http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

startServer();
