const SENSOR = require('../models/sensors.model.js');
const {v4: uuid} = require('uuid')

const getAllSensorData = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const result = await SENSOR.find({})
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(201).json({
        success: true,
        count: result.length, 
        data: result
    })
  } catch (err) {
    res.status(500).json({
        success: false, 
        message: `Error getting all sensor data: ${err.message}`
    })
  }
};

const getSensorDataById = async (req, res) => {
  try {
    const _id = req.params._id
    const result = await SENSOR.findById(_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Sensor data not found'
      });
    }

    res.status(200).json({success: true, data: result})
  } catch (err) {
    res.status(500).json({
        success: false, 
        message: `Error getting sensor data by ID: ${err.message}`
    })
  }
};

const getSensorDataWithinRange = async (req, res) => {
  try {
    const { timeStart, timeEnd } = req.body;
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - (timeEnd * 60 * 60 * 1000));
    const filterStartTime = new Date(endTime.getTime() - (timeStart * 60 * 60 * 1000));

    const result = await SENSOR.find({
      updatedAt: {
        $gte: startTime,
        $lte: filterStartTime
      }
    }).sort({ timestamp: -1 });


    res.status(200).json({
        success: true,
        count: result.length, 
        data: result
    })
  } catch (err) {
    res.status(500).json({
        success: false, 
        message: `Error getting sensor data within range: ${err.message}`
    })
  }
};

const createSensorData = async (req, res) => {
  try {
    const data = req.body
    data._id = uuid()

    const sensorData = new SENSOR({
      temperature: data.temperature,
      pressure: data.pressure,
      air_quality: data.airQuality,
      light_intensity: data.lightIntensity
    });

    const result = await sensorData.save();
    res.status(200).json({success: true, data: result})
  } catch (err) {
    res.status(500).json({
        success: false, 
        message: `Error creating sensor data: ${err.message}`
    })
  }
};

const deleteSensorData = async (req, res) => {
  try {
    const _id = req.params._id
    const result = await SENSOR.findByIdAndDelete(_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Sensor data not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Sensor data deleted successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error deleting sensor data: ${err.message}`
    });
  }
};

module.exports = {
  getAllSensorData,
  getSensorDataById,
  getSensorDataWithinRange,
  createSensorData,
  deleteSensorData
};