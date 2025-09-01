const express = require('express');
const sensorRouter = express.Router()
const {
  getAllSensorData,
  getSensorDataById,
  getSensorDataWithinRange,
  createSensorData,
  deleteSensorData
} = require('../controllers/sensor.controller.js');

sensorRouter.use(express.json());

sensorRouter.route('/').get(getAllSensorData);
sensorRouter.route('/:id').get(getSensorDataById);
sensorRouter.route('/').post(createSensorData);
sensorRouter.route('/search').post(getSensorDataWithinRange);
//sensorRouter.delete('/:id').delete(deleteSensorData);


module.exports = sensorRouter