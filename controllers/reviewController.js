const db = require('../models');
const Review = db.Review;
const Book = db.Book;

// Add a review
const addReview = async (req, res) => {
  const { bookId, rating, comment } = req.body;

  try {
    // Check if the review already exists for the user and book
    const checkReview = await Review.findOne({
      where: {
        bookId,
        userId: req.user.id,
      },
    });


    if(checkReview) return res.status(200).json({ message: 'You have already added the review for the book, Now you can edit it!', review: checkReview });

    // Add a review
    const review = await Review.create({
      userId: req.user.id, // Extracted from JWT
      bookId,
      rating,
      comment,
    });

    // Update average rating for the book
    const averageRating = await calculateAverageRating(bookId);
    res.status(201).json({ message: 'Review added successfully', review, averageRating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit a review
const editReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findOne({ where: { id, userId: req.user.id } });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    // Update average rating for the book
    const averageRating = await calculateAverageRating(review.bookId);
    res.status(200).json({ message: 'Review updated successfully', review, averageRating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findOne({ where: { id, userId: req.user.id } });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const bookId = review.bookId;
    await review.destroy();

    // Update average rating for the book
    const averageRating = await calculateAverageRating(bookId);
    res.status(200).json({ message: 'Review deleted successfully', averageRating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews for a book
const getReviewsForBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { bookId },
      include: [{ model: db.User, as: 'user', attributes: ['username'] }],
    }); // include - Review model has a belongsTo association with the User model

    const averageRating = await calculateAverageRating(bookId);
    res.status(200).json({ reviews, averageRating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific review for a book by the logged-in user
const getReviewForTheBookByUserId = async (req, res) => {
  const { bookId } = req.params;

  try {
    // Find the review for the book by the logged-in user
    const review = await Review.findOne({
      where: {
        bookId,
        userId: req.user.id, // Extracted from JWT
      },
      include: [
        { model: Book, as: 'book', attributes: ['title', 'author'] }, // Include book details if needed
      ],
    });

    if (!review) {
      return res.status(404).json({ error: 'No review found for this book by the user.' });
    }

    res.status(200).json({ review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helper function to calculate average rating
const calculateAverageRating = async (bookId) => {
  const reviews = await Review.findAll({ where: { bookId } });

  if (reviews.length === 0) return null;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
};

module.exports = { addReview, editReview, deleteReview, getReviewsForBook, getReviewForTheBookByUserId };
