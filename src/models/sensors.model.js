const { Schema, model } = require('mongoose')
const collectionName = 'sensors'

const schema = new Schema({
    _id: { type: String, required: true },
    temperature: { type: Number, default: 0 },
    pressure: { type: Number, default: 0 },
    airQuality: { type: Number, default: 0 },
    pressure: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isRemove: { type: Boolean, default: false },
}, {
  strict: true,
  collection: collectionName,
  _id: false
});

schema.index({ timestamp: -1 });
schema.index({ createdAt: -1 });

module.exports = model(collectionName, schema)