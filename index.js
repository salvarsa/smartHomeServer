const express = require('express')
const bodyParser = require('body-parser');
const { connectDb } = require('./src/config/db.js')

const app = express()
app.use(bodyParser.json())

const PORT = 1615

app.listen(PORT, () => {
    connectDb();
    console.log(`server ready at: http://localhost:${PORT}`);
})