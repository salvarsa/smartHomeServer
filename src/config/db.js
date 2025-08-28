const {connect} = require('mongoose')

const db = 'mongodb+srv://salvarsa:sisas1234@smarthome.qo13kxm.mongodb.net/'

const connectDb = async () => {
    try {
        await connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('DB_CONNECT');
    } catch (error) {
        console.error('DB CONNECTION ERROR:', error)
    }
}

module.exports = { connectDb, connection: mongoose.connection };