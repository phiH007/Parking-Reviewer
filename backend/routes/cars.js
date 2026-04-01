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
    const carId = new ObjectId(req.params.id);
    const userId = req.body.userId;
    const role = req.body.role;

    if (!userId) {
      return res.status(400).send('User id is required.');
    }

    const car = await db.collection('cars').findOne({ _id: carId });

    if (!car) {
      return res.status(404).send('Car not found.');
    }

    const isOwner = String(car.userId) === String(userId);
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).send('You can only delete your own cars unless you are an admin.');
    }

    await db.collection('cars').deleteOne({ _id: carId });
    await db.collection('comments').deleteMany({ carId: carId });
    res.send('Car deleted.');
  } catch (e) {
    console.log(e); res.send('Error');
  }
});

module.exports = router;
