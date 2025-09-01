const express = require('express');
const mqtt = require('mqtt');
const { Server, Socket } = require("socket.io");
const bodyParser = require('body-parser');
const { connectDb } = require('./src/config/db.js');
const sensorRouter = require('./src/routes/sensor.routes.js')
const SENSOR = require('./src/models/sensors.model.js');

const app = express()
const io = new Server(app);

let sensorBuffer = [];

//middlewares
app.use(bodyParser.json());

//routes
app.use('/api/v1', sensorRouter)

// MQTT setup
const mqttClient = mqtt.connect('192.168.1.52:1883');
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    //subscribe temperature topic
    mqttClient.subscribe('home/sensor/data', (err) => {
        if (err) {
            console.error("failed to suscribe to topic: ", err);
        }
    });
    //subscribirse a otro topico
});

mqttClient.on('message', async (topic, message) => {
    if(topic === 'home/sensors/data'){
        const get_payload_str = message.toString();
        console.log(`${topic} : payload string received : ${get_payload_str}\n`);
    
        const sensorData = convertPayloadStrToObj(get_payload_str);

        console.log('payload: ', sensorData);

        // update web/client with data using socketIO
        io.emit('sensorData', sensorData);  

        //save sensor data(average) in database
        saveAvgSensorData(sensorData);
    }
    // listen to other suscribe topics
    // if (topic == x){}
});

app.get('/', (req, res) => {
    console.log('sisas');
    res.status(200).send('Data received');
});

app.get('detail', async (req, res) => {
    try {
        const data = await SENSOR.getAllSensorData()
        res.render('detail', { data });
    } catch (error) {
        res.status(500).send('Error retrieving data');
    }
});

io.on('connection', (socket) => {
    console.log('A user connected to Socket.IO');

    // Handle checkbox data sent from the client
    socket.on('checkBoxData', (checkBoxData) => {
        console.log(`Live feedback from checkbox to MQTT: ${checkBoxData}`);

         // Send the retrieved data back to the client
         socket.emit('x', "mercy me");
        
        // Publish the checkbox data to the MQTT topic
        mqttClient.publish('esp/cmd', checkBoxData);
    });
    
    // Handle SensorDataWithinRange requests from the client
    socket.on('searchTimeRange', async (searchtime) => {
        // Query the database for sensor data within the specified time range
        const returnData = await SENSOR.getSensorDataWithinRange(searchtime);

        // Send the retrieved data back to the client
        socket.emit('recRange', returnData);
    });
});

function convertPayloadStrToObj(payload_str){
    const values = payload_str.split(',');

    return {
        temperature: parseFloat(values[0]),
        pressure: parseFloat(values[1]),
        airQuality: parseFloat(values[2]),
        lightIntensity: parseFloat(values[3]),
    };
}

const saveAvgSensorData = async (data) =>{
    sensorBuffer.push(data);

    // if 5 minutes (60 samples if collected every 5 seconds) have passed
    // calculate the averages and save to DB
    if (sensorBuffer.length >= 5){
        const avgTemperature = sensorBuffer.reduce((sum, d) => sum + d.temperature, 0) / sensorBuffer.length;
        const avgPressure = sensorBuffer.reduce((sum, d) => sum + d.pressure, 0) / sensorBuffer.length;
        const avgAirQuality = sensorBuffer.reduce((sum, d) => sum + d.airQuality, 0) / sensorBuffer.length;
        const avgLightIntensity = sensorBuffer.reduce((sum, d) => sum + d.lightIntensity, 0) / sensorBuffer.length;

        const dataObj = {
            temperature: parseFloat(avgTemperature).toFixed(2),
            pressure: parseFloat(avgPressure).toFixed(2),
            airQuality: parseFloat(avgAirQuality).toFixed(2),
            lightIntensity: parseFloat(avgLightIntensity).toFixed(2)
        };

        // database query to insert sensor data(average)
        const returnData = await SENSOR.createSensorData(dataObj);
        console.log("sensorModel.createSensorData: ", returnData);

        // clear the buffer for the next interval
        console.log("sensorBuffer: ", sensorBuffer);
        sensorBuffer = [];
    }
}


const PORT = 1615

app.listen(PORT, () => {
    connectDb();
    console.log(`server ready at: http://localhost:${PORT}`);
})