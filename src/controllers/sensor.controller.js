const SENSOR = require('../models/sensors.model.js');

sensorDataSchema.index({ timestamp: -1 });
sensorDataSchema.index({ createdAt: -1 });

const getAllSensorData = async (req, res) => {
  try {
    const result = await SENSOR.find({})
      .sort({ timestamp: -1 })
      .limit(limit = 50);

    res.status(201).json({success: true, data: result})
  } catch (err) {
    res.status(500).json({
        success: false, 
        message: `Error getting all sensor data: ${err.message}`
    })
  }
};

const getSensorDataById = async (req, res) => {
  try {
    const id = req.params.id
    const result = await SENSOR.findById(id);
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
    const timeRange = req.params.timeRange
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - (timeRange.timeEnd * 60 * 60 * 1000));
    const filterStartTime = new Date(endTime.getTime() - (timeRange.timeStart * 60 * 60 * 1000));

    const result = await SENSOR.find({
      timestamp: {
        $gte: startTime,
        $lte: filterStartTime
      }
    }).sort({ timestamp: -1 });


    res.status(200).json({success: true, data: result})
  } catch (err) {
    res.status(500).json({
        success: false, 
        message: `Error getting sensor data within range: ${err.message}`
    })
  }
};

const createSensorData = async (req, res) => {
  try {
    const data = req.params.data
    const sensorData = new SENSOR({
      temperature: data.temperature,
      pressure: data.pressure,
      air_quality: data.airQuality,
      light_intensity: data.lightIntensity
    });

    const result = await SENSOR.save();
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
    const id = req.params.id
    const result = await SENSOR.findByIdAndDelete(id);
    return result;
  } catch (err) {
    throw new Error(`Error deleting sensor data: ${err.message}`);
  }
};


module.exports = {
  getAllSensorData,
  getSensorDataById,
  getSensorDataWithinRange,
  createSensorData,
  deleteSensorData
};