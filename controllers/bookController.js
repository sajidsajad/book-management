const db = require('../models');
const Book = db.Book;
const Review = db.Review;

const { fn, col } = require('sequelize'); 

// Add a new book
const addBook = async (req, res) => {
  // console.log(req.body);
  const { title, author, isbn, genre } = req.body;

  try {
    const userId = req.user.id; // Get user ID from middleware
    const coverImage = req.file ? req.file.path : null; // Get file URL from Cloudinary
    const newBook = await Book.create({ title, author, isbn, genre, coverImage, userId });
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing book
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, genre } = req.body;
  const userId = req.user.id;
  console.log(req.body);

  try {
    const book = await Book.findOne({
      where: {
        id: id,         // Primary key condition
        userId: userId, // Additional condition
      },
    });

    
    if (!book) return res.status(404).json({ error: 'Book not found' });
    const coverImage = req.file ? req.file.path : book.coverImage;
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.genre = genre || book.genre;
    book.coverImage = coverImage;

    await book.save();
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a book
const getBook = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the book by ID with its reviews and calculate the average rating
    const book = await Book.findByPk(id, {
      include: {
        model: Review,
        as: 'reviews',
        attributes: [
          'id', // Include review ID
          'rating', // Include individual ratings
          'comment', // Include review comments
          'userId', // Include review comments
        ],
      },
      attributes: {
        include: [[fn('AVG', col('reviews.rating')), 'averageRating']], // Add average rating as a computed field
      },
      group: ['Book.id', 'reviews.id'], // Group by Book ID and Review ID to enable aggregation
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });
      book.dataValues.averageRating = parseFloat(book.dataValues.averageRating).toFixed(1);


    // Check user ownership of the book
    // if (req.user.id === book.userId) {
    if (book) {
      res.status(200).json({ book });
    } else {
      res.status(400).json({ error: 'Invalid User' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const book = await Book.findOne({
      where: {
        id: id,         // Primary key condition
        userId: userId, // Additional condition
      },
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });

    await book.destroy();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Books
const getBooks = async (req, res) => {
  // const { query } = req.query;

  try {
    let books = await Book.findAll(
    // {
    //   where: {
    //     userId: req.user.id, // Filter by userId
    //   },
    // }
    {
      include: {
        model: Review,
        as: 'reviews',
        attributes: [[fn('AVG', col('rating')), 'averageRating']], // Calculate average rating
      },
      group: ['Book.id', 'reviews.id'], // Group by book ID to get the average rating
    }
    );

    // Format the response to match the desired structure
    books = books.map(book => {
      const averageRating = book.reviews[0]? book.reviews[0].dataValues.averageRating : 0;
      // console.log(book.reviews[0].dataValues.averageRating);
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: book.genre,
        coverImage: book.coverImage,
        userId: book.userId,
        ratings: parseFloat(averageRating).toFixed(1), // Convert to float and limit decimals to 1
      };
    });


    if(books.length > 0 ) res.status(200).json({ books });
    else res.status(200).json({ message: 'No Books added by you yet!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search for books
const searchBooks = async (req, res) => {
  const { query } = req.query;

  try {
    const books = await Book.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { title: { [db.Sequelize.Op.iLike]: `%${query}%` } },
          { author: { [db.Sequelize.Op.iLike]: `%${query}%` } },
          { isbn: { [db.Sequelize.Op.iLike]: `%${query}%` } },
        ],
      },
    });

    res.status(200).json({ books });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
  getBook,
  getBooks
};
