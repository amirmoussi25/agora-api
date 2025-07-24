const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0,
};

module.exports = mongooseOptions;
