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

// GET /api/comments/car/:carId
router.get('/car/:carId', async (req, res) => {
  const carObjectId = toObjectId(req.params.carId);

  if (!carObjectId) {
    return res.status(400).json({ error: 'Invalid car id.' });
  }

  const db = getDB();
  const comments = await db.collection('comments')
    .find({ carId: carObjectId })
    .sort({ createdAt: -1 })
    .toArray();

  const userIds = comments
    .map((comment) => toObjectId(comment.userId))
    .filter(Boolean);

  const users = await db.collection('users')
    .find({ _id: { $in: userIds } })
    .toArray();

  const usernamesById = {};
  users.forEach((user) => {
    usernamesById[String(user._id)] = user.username;
  });

  const commentsWithNames = comments.map((comment) => ({
    ...comment,
    username: usernamesById[comment.userId] || 'Unknown User',
  }));

  res.json({ comments: commentsWithNames });
});

// POST /api/comments
router.post('/', async (req, res) => {
  const { carId, userId, text } = req.body;

  if (!carId || !userId || !text) {
    return res.status(400).json({ error: 'carId, userId, and text are required.' });
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

  const commentToSave = {
    carId: carObjectId,
    userId,
    text: text.trim(),
    createdAt: new Date(),
  };

  const result = await db.collection('comments').insertOne(commentToSave);

  res.status(201).json({
    message: 'Comment added.',
    comment: {
      ...commentToSave,
      _id: result.insertedId,
      username: user.username,
    },
  });
});

// DELETE /api/comments/:id - delete a comment (owner or admin)
router.delete('/:id', async (req, res) => {
  const { userId, requestingUserRole } = req.body;

  const commentObjectId = toObjectId(req.params.id);
  if (!commentObjectId) return res.status(400).json({ error: 'Invalid comment id.' });

  const db = getDB();
  const comment = await db.collection('comments').findOne({ _id: commentObjectId });
  if (!comment) return res.status(404).json({ error: 'Comment not found.' });

  const isOwner = comment.userId === userId;
  const isAdmin = requestingUserRole === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Not authorized to delete this comment.' });
  }

  await db.collection('comments').deleteOne({ _id: commentObjectId });
  res.json({ message: 'Comment deleted.' });
});

module.exports = router;
