const express = require('express');
const { addBook, updateBook, deleteBook, searchBooks, getBooks, getBook } = require('../controllers/bookController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// router.post('/', authenticateToken, addBook);          
router.post('/', authenticateToken, upload.single('coverImage'), addBook);// Add a new book
router.put('/:id', authenticateToken, upload.single('coverImage'), updateBook);    // Update an existing book
router.delete('/:id', authenticateToken, deleteBook); // Delete a book
router.get('/search', searchBooks);                  // Search books by query
// router.get('/', authenticateToken, getBooks);                  // get all books
router.get('/',  getBooks);                  // get all books
// router.get('/:id', authenticateToken, getBook);                  // get book by id
router.get('/:id',  getBook);                  // get book by id

module.exports = router;
