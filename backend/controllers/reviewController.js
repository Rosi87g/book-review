import mongoose from 'mongoose';
import reviewmodel from '../models/reviewModel.js';

// ✅ Add Review
export const addReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;
    const userId = req.user._id;

    if (!bookId || !rating) {
      return res.status(400).json({ success: false, message: 'Missing rating or book ID' });
    }

    const newReview = new reviewmodel({ bookId, userId, rating, reviewText });
    await newReview.save();

    const populatedReview = await reviewmodel.findById(newReview._id).populate('userId', 'name');
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: populatedReview,
    });
  } catch (error) {
    console.error("addReview error:", error);
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};

// ✅ Edit Review
export const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid review ID' });
    }

    const review = await reviewmodel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not allowed to edit this review' });
    }

    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    await review.save();

    res.status(200).json({ success: true, message: 'Review updated successfully', review });
  } catch (error) {
    console.error("editReview error:", error);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
};

// ✅ Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid review ID' });
    }

    const review = await reviewmodel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not allowed to delete this review' });
    }

    await reviewmodel.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error("deleteReview error:", error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

// ✅ Get All Reviews for a Book
export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await reviewmodel.find({ bookId }).populate('userId', 'name');

    res.status(200).json({
      success: true,
      reviews,
      message: reviews.length === 0 ? 'No reviews yet for this book' : undefined,
    });
  } catch (error) {
    console.error("getBookReviews error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// ✅ Get Average Rating
export const getAverageRating = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await reviewmodel.find({ bookId });

    if (reviews.length === 0) {
      return res.status(200).json({ success: true, average: 0, message: 'No ratings yet' });
    }

    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = total / reviews.length;

    res.status(200).json({ success: true, average: average.toFixed(1) });
  } catch (error) {
    console.error("getAverageRating error:", error);
    res.status(500).json({ success: false, message: 'Failed to calculate average rating' });
  }
};