const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getDB } = require('../db');

const router = Router();
const uploadsDir = path.join(__dirname, '..', 'uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path.basename(file.originalname, extension)
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/-+/g, '-')
      .slice(0, 40) || 'car';

    cb(null, `${Date.now()}-${safeBaseName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg'];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only PNG and JPG images are allowed.'));
      return;
    }

    cb(null, true);
  },
});

// GET /api/cars
router.get('/', async (req, res) => {
  const { userId } = req.query;

  const db = getDB();
  const cars = db.collection('cars');
  const filter = userId ? { userId } : {};

  const results = await cars
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  const carsWithImageUrls = results.map((car) => ({
    ...car,
    imageUrl: car.imagePath ? `/${car.imagePath.replace(/\\/g, '/')}` : '',
  }));

  res.json({ cars: carsWithImageUrls });
});

// POST /api/cars
router.post('/', upload.single('image'), async (req, res) => {
  const { userId, plate, make, model, reason } = req.body;

  if (!userId || !plate || !make || !model || !reason) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = getDB();
  const cars = db.collection('cars');

  const result = await cars.insertOne({
    userId,
    plate,
    make,
    model,
    reason,
    imagePath: req.file ? path.posix.join('uploads', req.file.filename) : '',
    imageName: req.file ? req.file.originalname : '',
    createdAt: new Date(),
  });

  res.status(201).json({
    message: 'Car report saved.',
    carId: result.insertedId,
  });
});

router.use((err, _req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'Please upload an image smaller than 5 MB.' });
    return;
  }

  if (err.message === 'Only PNG and JPG images are allowed.') {
    res.status(400).json({ error: err.message });
    return;
  }

  next(err);
});

module.exports = router;
