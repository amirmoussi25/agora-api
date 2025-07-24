const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { Server } = require('socket.io');
const http = require('http');

const swaggerSpecs = require('./config/swagger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { connectMongoDB, connectPostgreSQL } = require('./config/database');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
    },
});

app.set('io', io);

const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        erreur: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get('/health', (req, res) => {
    res.status(200).json({
        statut: 'succès',
        message: 'API Agora fonctionne correctement',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api', routes);

app.use('*', (req, res) => {
    res.status(404).json({
        erreur: 'Route non trouvée',
        message: 'La route demandée n\'existe pas',
    });
});

app.use(errorHandler);

const initializeDatabase = async () => {
    await connectMongoDB();
    const sequelize = await connectPostgreSQL();

    if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('✅ Tables PostgreSQL synchronisées');
    }
};

io.on('connection', (socket) => {
    console.log('Utilisateur connecté:', socket.id);

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté:', socket.id);
    });
});

module.exports = { app, server, initializeDatabase };
