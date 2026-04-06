const defaultViolations = [
  'Double Parked',
  'Blocking Hydrant',
  'Blocking Driveway',
  'No Parking Zone',
  'Handicap Zone',
  'Expired Meter',
  'Fire Lane',
  'Blocking Intersection',
];

async function seedViolations(db) {
  const violations = db.collection('violations');
  const existing = await violations.countDocuments();

  if (existing > 0) return;

  await violations.insertMany(defaultViolations.map((name) => ({ name })));
  console.log('Seeded default violations.');
}

async function seedDefaultAdmin(db) {
  const users = db.collection('users');
  const existingAdmin = await users.findOne({ username: 'admin' });

  if (existingAdmin) return;

  await users.insertOne({
    username: 'admin',
    password: 'admin',
    role: 'admin',
  });

  console.log('Seeded default admin user.');
}

module.exports = { seedViolations, seedDefaultAdmin };
