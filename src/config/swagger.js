const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Agora API',
            version: '1.0.0',
            description: 'API pour l\'application Agora - Location de salles municipales',
            contact: {
                name: 'Amir Moussi',
                email: 'contact@agora-app.fr',
            },
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.agora-app.fr'
                    : 'http://localhost:3001',
                description: process.env.NODE_ENV === 'production'
                    ? 'Serveur de production'
                    : 'Serveur de développement',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
