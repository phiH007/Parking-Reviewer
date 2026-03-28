require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const violationRoutes = require('./routes/violations');
const commentRoutes = require('./routes/comments');
const voteRoutes = require('./routes/votes');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);


app.get('/', (req, res) => {
  res.send('Parking Reviewer API');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Now listening on port ' + PORT);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
