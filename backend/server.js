const express = require('express');
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const app = express();
const PORT = 8080;

async function connectDB() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB!");
        
        db = client.db("ParkingDB"); 

        app.listen(PORT, () => {
            console.log("Now listening on port " + PORT);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

connectDB();