const express = require('express');
const router = express.Router();
const { getDB } = require('../db');


router.post('/register', async (req, res) => {
    try {
      const db = getDB();
      let collection = db.collection("users");
      const existingUser = await collection.findOne({ username: req.body.username });
      if (existingUser) {
        return res.send("Username already exists");
      }
      
      let newUser = req.body;
      newUser.role = 'user'; 

      let result = await collection.insertOne(newUser);
      res.send(result);
    }
    catch(e) {
        console.log(e);
        res.send("Error");
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    let collection = db.collection("users");
      
    let result = await collection.find(req.body).toArray();
    
    if(result.length > 0) {
        res.json(result[0]);
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