const { Router } = require('express');
const { getDB } = require('../db');

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, role = 'user' } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const db = getDB();
  const users = db.collection('users');

  const existing = await users.findOne({ username });
  if (existing) {
    return res.status(409).json({ error: 'Username already taken.' });
  }

  const result = await users.insertOne({
    username,
    password,
    role: role === 'admin' ? 'admin' : 'user',
    createdAt: new Date(),
  });

  res.status(201).json({ message: 'User created.', userId: result.insertedId });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const db = getDB();
  const users = db.collection('users');

  const user = await users.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  res.json({
    message: 'Login successful.',
    user: { id: user._id, username: user.username, role: user.role },
  });
});

module.exports = router;
