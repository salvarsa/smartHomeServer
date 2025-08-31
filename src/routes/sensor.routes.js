const express = require('express');
const senserRouter = express.Router()
const {
  getAllSensorData,
  getSensorDataById,
  getSensorDataWithinRange,
  createSensorData,
  deleteSensorData
} = require('../controllers/sensor.controller.js');

senserRouter.use(express.json());

senserRouter.route('/').get(getAllSensorData);
senserRouter.route('/:id').get(getSensorDataById);
senserRouter.route('/').post(createSensorData);
senserRouter.route('/search').post(getSensorDataWithinRange);
senserRouter.delete('/:id').delete(deleteSensorData);


module.exports = router