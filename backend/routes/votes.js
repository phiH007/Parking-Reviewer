const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const router = express.Router();

// GET /api/votes/car/:carId
router.get('/car/:carId', async (req, res) => {
  try {
    const db = getDB();
    const votes = await db.collection('votes')
        .find({ carId: new ObjectId(req.params.carId) })
        .toArray();
    
    // Calculate the score right here with a quick loop
    let upvotes = 0, downvotes = 0;
    votes.forEach(v => v.value === 1 ? upvotes++ : downvotes++);
    
    res.json({ upvotes, downvotes, score: upvotes - downvotes });
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

// POST /api/votes
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    
    // The magical upsert! It updates the vote if the user already voted, or creates a new one.
    await db.collection('votes').updateOne(
      { carId: new ObjectId(req.body.carId), userId: req.body.userId },
      { $set: { value: req.body.value, updatedAt: new Date() } },
      { upsert: true } 
    );
    
    res.send("Vote recorded");
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

module.exports = router;