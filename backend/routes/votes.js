const { Router } = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const router = Router();

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

async function buildVoteSummary(db, carObjectId, userId) {
  const votes = await db.collection('votes')
    .find({ carId: carObjectId })
    .toArray();

  const upvotes = votes.filter((vote) => vote.value === 1).length;
  const downvotes = votes.filter((vote) => vote.value === -1).length;
  const currentUserVote = userId
    ? votes.find((vote) => vote.userId === userId)?.value || 0
    : 0;

  return {
    upvotes,
    downvotes,
    score: upvotes - downvotes,
    currentUserVote,
  };
}

// GET /api/votes/car/:carId
router.get('/car/:carId', async (req, res) => {
  const carObjectId = toObjectId(req.params.carId);

  if (!carObjectId) {
    return res.status(400).json({ error: 'Invalid car id.' });
  }

  const db = getDB();
  const summary = await buildVoteSummary(db, carObjectId, req.query.userId);
  res.json(summary);
});

// POST /api/votes
router.post('/', async (req, res) => {
  const { carId, userId, value } = req.body;

  if (!carId || !userId || ![1, -1].includes(value)) {
    return res.status(400).json({ error: 'carId, userId, and value (1 or -1) are required.' });
  }

  const carObjectId = toObjectId(carId);
  const userObjectId = toObjectId(userId);

  if (!carObjectId || !userObjectId) {
    return res.status(400).json({ error: 'Invalid car id or user id.' });
  }

  const db = getDB();
  const car = await db.collection('cars').findOne({ _id: carObjectId });
  if (!car) {
    return res.status(404).json({ error: 'Car not found.' });
  }

  const user = await db.collection('users').findOne({ _id: userObjectId });
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const votes = db.collection('votes');
  const existingVote = await votes.findOne({ carId: carObjectId, userId });

  if (!existingVote) {
    await votes.insertOne({
      carId: carObjectId,
      userId,
      value,
      createdAt: new Date(),
    });
  } else if (existingVote.value === value) {
    await votes.deleteOne({ _id: existingVote._id });
  } else {
    await votes.updateOne(
      { _id: existingVote._id },
      { $set: { value, updatedAt: new Date() } }
    );
  }

  const summary = await buildVoteSummary(db, carObjectId, userId);
  res.json({ message: 'Vote saved.', ...summary });
});

module.exports = router;
