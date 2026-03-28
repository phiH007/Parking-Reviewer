const { Router } = require('express');
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

const router = Router();

// GET /api/violations - get all violation types (public)
router.get('/', async (req, res) => {
  const db = getDB();
  const violations = await db.collection('violations').find().toArray();
  res.json({ violations });
});

// POST /api/violations - add a new violation type (admin only)
router.post('/', async (req, res) => {
  const { name, requestingUserRole } = req.body;

  if (requestingUserRole !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add violation types.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Violation name is required.' });
  }

  const db = getDB();
  const existing = await db.collection('violations').findOne({ name });
  if (existing) {
    return res.status(409).json({ error: 'Violation type already exists.' });
  }

  const result = await db.collection('violations').insertOne({ name });
  res.status(201).json({ message: 'Violation added.', violationId: result.insertedId });
});

// DELETE /api/violations/:id - remove a violation type (admin only)
router.delete('/:id', async (req, res) => {
  const { requestingUserRole } = req.body;

  if (requestingUserRole !== 'admin') {
    return res.status(403).json({ error: 'Only admins can remove violation types.' });
  }

  const db = getDB();
  const violation = await db.collection('violations').findOne({ _id: new ObjectId(req.params.id) });
  if (!violation) return res.status(404).json({ error: 'Violation not found.' });

  await db.collection('violations').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: 'Violation removed.' });
});

// POST /api/violations/car - tag a car with a violation (logged-in users)
router.post('/car', async (req, res) => {
  const { carId, violationId, userId } = req.body;

  if (!carId || !violationId || !userId) {
    return res.status(400).json({ error: 'carId, violationId, and userId are required.' });
  }

  const db = getDB();

  const car = await db.collection('cars').findOne({ _id: new ObjectId(carId) });
  if (!car) return res.status(404).json({ error: 'Car not found.' });

  const violation = await db.collection('violations').findOne({ _id: new ObjectId(violationId) });
  if (!violation) return res.status(404).json({ error: 'Violation not found.' });

  const existing = await db.collection('carViolations').findOne({
    carId: new ObjectId(carId),
    violationId: new ObjectId(violationId),
  });
  if (existing) return res.status(409).json({ error: 'This violation is already tagged on this car.' });

  await db.collection('carViolations').insertOne({
    carId: new ObjectId(carId),
    violationId: new ObjectId(violationId),
    taggedBy: userId,
    createdAt: new Date(),
  });

  res.status(201).json({ message: 'Violation tagged on car.' });
});

// GET /api/violations/car/:carId - get all violations for a specific car (public)
router.get('/car/:carId', async (req, res) => {
  const db = getDB();

  const carViolations = await db.collection('carViolations')
    .find({ carId: new ObjectId(req.params.carId) })
    .toArray();

  const violationIds = carViolations.map((cv) => cv.violationId);

  const violations = await db.collection('violations')
    .find({ _id: { $in: violationIds } })
    .toArray();

  res.json({ violations });
});

module.exports = router;
