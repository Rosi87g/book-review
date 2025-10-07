import express from 'express';
import { addReview, editReview, deleteReview, getBookReviews, getAverageRating } from '../controllers/reviewController.js';
import authUser from '../middleware/authUser.js';

const reviewRouter = express.Router();

// Add a review
reviewRouter.post('/add-review', authUser, addReview);

// Edit a review
reviewRouter.put('/edit-review/:reviewId', authUser, editReview);

// Delete a review
reviewRouter.delete('/delete-review/:reviewId', authUser, deleteReview);

// Get all reviews for a book
reviewRouter.get('/book/:bookId', getBookReviews);

// Get average rating for a book
reviewRouter.get('/average/:bookId', getAverageRating);

export default reviewRouter;