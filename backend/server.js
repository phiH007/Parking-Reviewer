require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/api/auth', authRoutes);

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
