const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.psdu9fg.mongodb.net/?retryWrites=true&w=majority`;



app.get('/', (req, res) => {
    res.send('brand Shop server is running');
})

app.listen(port, () => {
    console.log(`Brand Shop Server is running on port: ${port}`);
})