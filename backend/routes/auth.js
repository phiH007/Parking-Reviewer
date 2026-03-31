const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

router.post('/register', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('users');
    const username = req.body.username;
    const password = req.body.password;
    const requestedRole = req.body.role;

    if (!username || !password) {
      return res.send('Error');
    }

    const existingUser = await collection.findOne({ username: username });
    if (existingUser) {
      return res.send('Username already exists');
    }

    let newRole = 'standard';
    if (requestedRole === 'admin') {
      newRole = 'admin';
    }

    const newUser = {
      username: username,
      password: password,
      role: newRole,
    };

    const result = await collection.insertOne(newUser);
    res.json({
      insertedId: result.insertedId,
      username: newUser.username,
      role: newUser.role,
    });
  }
  catch(e) {
    console.log(e);
    res.send('Error');
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('users');
    const username = req.body.username;
    const password = req.body.password;

    const result = await collection.find({ username: username, password: password }).toArray();

    if(result.length > 0) {
        const foundUser = result[0];
        const normalizedRole = foundUser.role === 'admin' ? 'admin' : 'standard';

        if (foundUser.role !== normalizedRole) {
          await collection.updateOne(
            { _id: foundUser._id },
            { $set: { role: normalizedRole } }
          );
        }

        res.json({
          _id: foundUser._id,
          username: foundUser.username,
          role: normalizedRole,
        });
    } else {
        res.send('Invalid Login');
    }
  }
  catch(e) {
    console.log(e);
    res.send('Error');
  }
});

router.get('/users', async (req, res) => {
  try {
    const db = getDB();
    const requestingRole = req.query.role;

    if (requestingRole !== 'admin') {
      return res.status(403).send('Only admins can view users.');
    }

    const users = await db.collection('users')
      .find()
      .sort({ username: 1 })
      .project({ password: 0 })
      .toArray();

    const normalizedUsers = users.map((user) => ({
      ...user,
      role: user.role === 'admin' ? 'admin' : 'standard',
    }));

    res.json({ users: normalizedUsers });
  }
  catch(e) {
    console.log(e);
    res.send('Error');
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const db = getDB();
    const requestingRole = req.body.requestingRole;
    const requestingUserId = req.body.requestingUserId;
    const newRole = req.body.role;

    if (requestingRole !== 'admin') {
      return res.status(403).send('Only admins can update roles.');
    }

    if (newRole !== 'admin' && newRole !== 'standard') {
      return res.status(400).send('Invalid role.');
    }

    if (String(requestingUserId) === String(req.params.id)) {
      return res.status(400).send('You cannot change your own role here.');
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { role: newRole } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).send('User not found.');
    }

    res.json({
      user: {
        _id: result._id,
        username: result.username,
        role: result.role,
      }
    });
  }
  catch(e) {
    console.log(e);
    res.send('Error');
  }
});

module.exports = router;
