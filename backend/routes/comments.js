const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');
const router = express.Router();

// GET /api/comments/all - get all comments (admin only)
router.get('/all', async (_req, res) => {
  try {
    const db = getDB();
    const comments = await db.collection('comments').find().sort({ createdAt: -1 }).toArray();
    const userIds = [...new Set(comments.map(c => c.userId).filter(Boolean))];
    const users = await db.collection('users').find({ _id: { $in: userIds } }).toArray();
    const usernamesById = {};
    users.forEach(u => { usernamesById[String(u._id)] = u.username; });
    const commentsWithNames = comments.map(c => ({ ...c, username: usernamesById[String(c.userId)] || 'Unknown' }));
    res.json({ comments: commentsWithNames });
  } catch (e) {
    console.log(e);
    res.send('Error');
  }
});

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
    const commentId = new ObjectId(req.params.id);
    const userId = req.body.userId;
    const role = req.body.role;

    if (!userId) {
      return res.status(400).send('User id is required.');
    }

    const comment = await db.collection('comments').findOne({ _id: commentId });

    if (!comment) {
      return res.status(404).send('Comment not found.');
    }

    const isOwner = String(comment.userId) === String(userId);
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).send('You can only delete your own comments unless you are an admin.');
    }

    await db.collection('comments').deleteOne({ _id: commentId });
    res.send('Comment deleted.');
  } catch (e) {
    console.log(e);
    res.send('Error');
  }
});

module.exports = router;
