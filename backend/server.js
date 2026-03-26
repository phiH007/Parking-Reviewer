require('dotenv').config();
const express = require('express');
<<<<<<< HEAD
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
=======
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');

>>>>>>> adb74f5 (implement user authentication with login and registration features; add dotenv for environment variables; set up MongoDB connection; update frontend to handle user state)
const app = express();
const PORT = process.env.PORT || 8080;

<<<<<<< HEAD
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
=======
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Parking Reviewer API');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Now listening on port ' + PORT);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
>>>>>>> adb74f5 (implement user authentication with login and registration features; add dotenv for environment variables; set up MongoDB connection; update frontend to handle user state)
