const express = require('express');
const {
  addReview,
  editReview,
  deleteReview,
  getReviewsForBook,
  getReviewForTheBookByUserId
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, addReview);             // Add a review
router.put('/:id', authenticateToken, editReview);          // Edit a review
router.delete('/:id', authenticateToken, deleteReview);     // Delete a review
router.get('/book/:bookId', getReviewsForBook);             // Get reviews for a book
router.get('/:bookId', authenticateToken, getReviewForTheBookByUserId);             // Get reviews for a book by user

module.exports = router;
