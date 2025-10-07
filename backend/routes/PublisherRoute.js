import express from "express";
import upload from "../middleware/multer.js";
import authPublisher from '../middleware/authPublisher.js';
import bookmodel from "../models/bookmodel.js";

import { addBook, allBooksList, editBook, loginAdmin, signupPublisher, getBookById, 
  getPublisherProfile, deleteBook, getBookReviews, getRatingDistribution, 
  getReviewInsights,
  getPublisherBooks,
  getMonthlyReviewStats,
  verifyPublisherEmail,} 
  from "../controllers/publishercontroller.js";

const publishRouter = express.Router();

publishRouter.get('/book/:bookId', authPublisher, getBookById);
publishRouter.post('/add-book', authPublisher, upload.single('image'), addBook);
publishRouter.post('/update-book', authPublisher, upload.single('image'), editBook);
publishRouter.delete('/delete-book/:bookId', authPublisher, deleteBook);

publishRouter.post('/profile', authPublisher, getPublisherProfile);

publishRouter.post('/signup', signupPublisher);
publishRouter.post('/login', loginAdmin);

publishRouter.get('/verify/:token', verifyPublisherEmail);

publishRouter.post('/all-booksList', authPublisher, allBooksList);

publishRouter.get('/book-reviews/:bookId', authPublisher, getBookReviews);
publishRouter.get('/book-rating-distribution/:bookId', authPublisher, getRatingDistribution);
publishRouter.get('/review-insights', authPublisher, getReviewInsights);

publishRouter.get('/books', authPublisher, getPublisherBooks);
publishRouter.get('/monthly-reviews', authPublisher, getMonthlyReviewStats);


// Adding this GET route for fetching book details
publishRouter.get('/book/:id', authPublisher, async (req, res) => {
  try {
    const book = await bookmodel.findById(req.params.id);
    if (!book) return res.json({ success: false, message: 'Book not found' });
    res.json({ success: true, book });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default publishRouter;