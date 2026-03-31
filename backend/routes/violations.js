const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const router = express.Router();

// GET /api/violations (Get the master list of options)
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const violations = await db.collection('violations').find().toArray();
    res.json({ violations });
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

// POST /api/violations (Admin adds a new type of violation)
router.post('/', async (req, res) => {
  try {
    if (req.body.requestingUserRole !== 'admin') return res.status(403).send("Admin only");
    const db = getDB();
    let result = await db.collection('violations').insertOne({ name: req.body.name });
    res.send(result);
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

// DELETE /api/violations/:id (Admin removes a violation type)
router.delete('/:id', async (req, res) => {
  try {
    if (req.body.requestingUserRole !== 'admin') return res.status(403).send("Admin only");
    const db = getDB();
    await db.collection('violations').deleteOne({ _id: new ObjectId(req.params.id) });
    res.send("Deleted");
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

// POST /api/violations/car (Tag a specific car)
router.post('/car', async (req, res) => {
  try {
    const db = getDB();
    let newTag = {
      carId: new ObjectId(req.body.carId),
      violationId: new ObjectId(req.body.violationId),
      violationName: req.body.violationName,
      taggedBy: req.body.userId,
      createdAt: new Date()
    };
    await db.collection('carViolations').insertOne(newTag);
    res.send("Tagged");
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

// GET /api/violations/car/:carId (Get violations for a car)
router.get('/car/:carId', async (req, res) => {
  try {
    const db = getDB();
    const carViolations = await db.collection('carViolations')
      .find({ carId: new ObjectId(req.params.carId) })
      .toArray();
    res.json({ violations: carViolations });
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

module.exports = router;