const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connecté avec succès');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

const connectPostgreSQL = async () => {
    const sequelize = new Sequelize(
        process.env.POSTGRES_DB,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD,
        {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        }
    );

    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connecté avec succès');
        return sequelize;
    } catch (error) {
        console.error('❌ Erreur de connexion PostgreSQL:', error.message);
        process.exit(1);
    }
};

module.exports = {
    connectMongoDB,
    connectPostgreSQL,
};
