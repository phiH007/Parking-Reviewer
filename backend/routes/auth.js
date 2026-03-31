const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
// POST /api/auth/register  


// Just grabs the body and tosses it in the DB, exactly like our player POST route
router.post('/register', async (req, res) => {
    try {
      const db = getDB();
      let collection = db.collection("users");
      
      // adding a default role just so we have it
      let newUser = req.body;
      newUser.role = 'user'; 

      // Note: I added 'await' here! I noticed in server.js we forgot 'await' 
      // on insertOne, so I made sure to include it here so it doesn't break.
      let result = await collection.insertOne(newUser);
      res.send(result);
    }
    catch(e) {
        console.log(e);
        res.send("Error");
    }
});

// POST /api/auth/login
// Uses the req.body to find a match, mimicking how we look up players
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    let collection = db.collection("users");
      
      // This will look for a document that perfectly matches the {username, password} in req.body
    let result = await collection.find(req.body).toArray();
    
    if(result.length > 0) {
        res.json(result[0]); // Send back the user data if they exist
    } else {
        res.send("Invalid Login");
    }
  }
    catch(e) {
        console.log(e);
        res.send("Error");
    }
});

module.exports = router;