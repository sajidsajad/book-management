const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const userRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');


require('dotenv').config();

const app = express();

// Middlewares
// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Enable cookies and credentials sharing
}));
app.use(bodyParser.json());

//! ROUTES:-
// User Routes
app.use('/api/users', userRoutes);
// Book routes
app.use('/api/books', bookRoutes);
// Review routes
app.use('/api/reviews', reviewRoutes);

// Database Sync
db.sequelize
  .sync()
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.log('Error syncing database:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


