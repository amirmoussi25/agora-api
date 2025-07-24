require('dotenv').config({ path: '.env.test' });

const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agora_test');
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
