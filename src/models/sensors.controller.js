const { Schema, model } = require('mongoose')
const collectionName = 'sensors'

const schema = new Schema({
    _id: { type: String, required: true },
    temperature: { type: Number, default: 0 },
    pressure: { type: Number, default: 0 },
    airQuality: { type: Number, default: 0 },
    pressure: { type: Number, default: 0 },
})

module.exports = model(collectionName, schema)