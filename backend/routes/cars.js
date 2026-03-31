const express = require('express');
const path = require('path');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const router = express.Router();

// setup for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET /api/cars
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const cars = await db.collection('cars').find(filter).sort({ createdAt: -1 }).toArray();
    res.json({ cars });
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

// POST /api/cars
// The 'upload.single' middleware grabs the image, the rest is in req.body
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const db = getDB();
    let newCar = {
      ...req.body,
      imagePath: req.file ? `uploads/${req.file.filename}` : '',
      createdAt: new Date()
    };
    let result = await db.collection('cars').insertOne(newCar);
    res.send(result);
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

// DELETE /api/cars/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('cars').deleteOne({ _id: new ObjectId(req.params.id) });
    res.send("Car deleted.");
  } catch (e) {
    console.log(e); res.send("Error");
  }
});

module.exports = router;