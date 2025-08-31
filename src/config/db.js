const {connect} = require('mongoose')
const mongoose = require('mongoose');

const db = 'mongodb+srv://salvarsa:sisas1234@smarthome.qo13kxm.mongodb.net/'

const connectDb = async () => {
    try {
        await connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('✅ DB_CONNECTED: MongoDB Atlas');
    } catch (error) {
        console.error('DB CONNECTION ERROR:', error)
    }
}

// Manejo de eventos de conexión
const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📡 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔄 MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = { connectDb, connection: mongoose.connection };