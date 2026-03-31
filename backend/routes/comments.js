const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const router = express.Router();

// GET /api/comments/car/:carId
router.get('/car/:carId', async (req, res) => {
  try {
    const db = getDB();
    const comments = await db.collection('comments')
      .find({ carId: new ObjectId(req.params.carId) })
      .sort({ createdAt: -1 })
      .toArray();
      
    res.json({ comments });
  } catch (e) {
    console.log(e);
    res.send("Error");
  }
});

// POST /api/comments
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    
    let newComment = {
      carId: new ObjectId(req.body.carId),
      userId: new ObjectId(req.body.userId),
      username: req.body.username,
      text: req.body.text,
      createdAt: new Date()
    };

    let result = await db.collection('comments').insertOne(newComment);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.send("Error");
  }
});

// DELETE /api/comments/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('comments').deleteOne({ _id: new ObjectId(req.params.id) });
    res.send("Comment deleted.");
  } catch (e) {
    console.log(e);
    res.send("Error");
  }
});

module.exports = router;