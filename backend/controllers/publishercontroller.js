import { v2 as cloudinary } from 'cloudinary';
import bookmodel from '../models/bookmodel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import bcrypt from 'bcrypt';
import Publisher from '../models/publishermodel.js';
import reviewModel from '../models/reviewModel.js';
import sendEmail from '../config/sendEmail.js';

const ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL || '_blank';

// API FOR EDIT BOOK DETAILS
const editBook = async (req, res) => {
  try {
    const { bookId, title, author, description, year, genre, addedBy, publish } = req.body;

    if (!bookId) {
      return res.json({ success: false, message: 'Missing book ID' });
    }

    const updates = { title, author, description, year, genre, addedBy, publish };

    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
      });
      updates.image = imageUpload.secure_url;
    }

    const updatedBook = await bookmodel.findByIdAndUpdate(bookId, updates, {
      new: true,
    });

    if (!updatedBook) {
      return res.json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, message: 'Book updated successfully', updatedBook });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/delete-book/:bookId
const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const deleted = await bookmodel.findByIdAndDelete(bookId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete book' });
  }
};

// API TO ADD BOOK

const addBook = async (req, res) => {
  try {
    const { title, author, description, year, genre, publish } = req.body;
    const imageFile = req.file;

    if (!title || !author || !description || !year || !genre || publish === undefined) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Image file missing' });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: 'image',
    });

    const imageUrl = imageUpload.secure_url;

    const bookData = {
      title,
      author,
      description,
      genre,
      image: imageUrl,
      year: parseInt(year),
      addedBy: req.publisher._id,
      publish: publish === 'true' || publish === true,
    };

    const newBook = new bookmodel(bookData);
    await newBook.save();

    fs.unlinkSync(imageFile.path);

    res.status(201).json({ success: true, message: 'New Book Published' });
  } catch (error) {
    console.error("AddBook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const signupPublisher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await Publisher.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔐 Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');

    const newPublisher = new Publisher({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      isVerified: false,
    });

    await newPublisher.save();

    // 📧 Send verification email
    const verifyLink = `${process.env.VITE_BACKEND_URL}/api/admin/verify/${verifyToken}`;
    await sendEmail(email, 'Verify your Publisher Account', `
      <p>Hello ${name},</p>
      <p>Click below to verify your account:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>This link will activate your publisher access.</p>
    `);

    res.json({ success: true, message: 'Signup successful. Please verify your email to activate your account.' });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};

// ✅ Replace loginAdmin with DB-based login
const loginAdmin = async (req, res) => {
  try {
    const { email, password, publisherId } = req.body;

    const publisher = await Publisher.findOne({ email, publisherId });
    if (!publisher) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, publisher.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: publisher._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API TO GET ALL BOOKS INFO
const allBooksList = async (req, res) => {
  try {
    const publisherId = req.publisher._id;

    // Fetch books added by this publisher and populate their name
    const books = await bookmodel
      .find({ addedBy: publisherId })
      .populate({
        path: 'addedBy',
        select: 'name email', // You can include more fields if needed
      });

    return res.status(200).json({
      success: true,
      books,
      count: books.length, // Optional: include total count
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve books. Please try again later.',
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await bookmodel
      .findById(bookId)
      .populate({ path: 'addedBy', select: 'name email' }); // ✅ Show publisher name

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, book });
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve book details.' });
  }
};

const getPublisherProfile = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.publisher._id).select('name email publisherId');
    if (!publisher) {
      return res.status(404).json({ success: false, message: 'Publisher not found' });
    }

    res.status(200).json({ success: true, publisher });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch publisher profile' });
  }
};

// GET /api/publisher/book-reviews/:bookId
const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await bookmodel.findById(bookId)
      .populate({
        path: 'reviews',
        select: 'rating reviewText createdAt userId',
        populate: { path: 'userId', select: 'name' }
      });

    if (!book || book.addedBy.toString() !== req.publisher._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized or book not found' });
    }

    res.json({ success: true, reviews: book.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// GET /api/publisher/book-rating-distribution/:bookId
const getRatingDistribution = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await bookmodel.findById(bookId).populate('reviews');
    if (!book || book.addedBy.toString() !== req.publisher._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized or book not found' });
    }

    const distribution = [0, 0, 0, 0, 0]; // index 0 = 1-star, index 4 = 5-star
    book.reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating - 1]++;
      }
    });

    const average = book.reviews.length > 0
      ? (book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length).toFixed(1)
      : 0;

    res.json({ success: true, distribution, average });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch rating data' });
  }
};

// GET /api/publisher/review-insights
const getReviewInsights = async (req, res) => {
  try {
    const books = await bookmodel.find({ addedBy: req.publisher._id }).populate({
      path: 'reviews',
      select: 'rating reviewText userId',
      populate: { path: 'userId', select: 'name' }
    });

    const insights = books.map(book => {
      const totalReviews = book.reviews.length;
      const averageRating = totalReviews > 0
        ? (book.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

      const distribution = [0, 0, 0, 0, 0];
      book.reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) distribution[r.rating - 1]++;
      });

      return {
        bookId: book._id,
        title: book.title,
        image: book.image,
        averageRating,
        totalReviews,
        distribution,
        reviews: book.reviews
      };
    });

    res.json({ success: true, insights });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch review insights' });
  }
};

// GET /api/publisher/books
const getPublisherBooks = async (req, res) => {
  const books = await bookmodel.find({ addedBy: req.publisher._id }).populate('reviews');
  res.json({ books });
};

// GET /api/publisher/monthly-reviews
const getMonthlyReviewStats = async (req, res) => {
  const reviews = await reviewModel.find({ publisherId: req.publisher._id });
  const monthlyData = Array(12).fill(0).map((_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    count: 0
  }));

  reviews.forEach(r => {
    const month = new Date(r.createdAt).getMonth();
    monthlyData[month].count += 1;
  });

  res.json({ monthlyData });
};

const verifyPublisherEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const publisher = await Publisher.findOne({ verifyToken: token });

    if (!publisher) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
    }

    publisher.isVerified = true;
    publisher.verifyToken = undefined;

    // Generate unique publisher ID if not already present
    if (!publisher.publisherId) {
      publisher.publisherId = 'PUB-' + crypto.randomBytes(4).toString('hex');
    }

    await publisher.save();

    // Send publisher ID via email
    await sendEmail(publisher.email, 'Your Publisher ID', `
      <p>Hello ${publisher.name},</p>
      <p>Your account has been verified successfully.</p>
      <p>Your Publisher ID is: <strong>${publisher.publisherId}</strong></p>
    `);

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect(`${ADMIN_FRONTEND_URL}/publisher-login`);
    }

  } catch (error) {
    console.error('verifyPublisherEmail error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};


export { addBook, loginAdmin, allBooksList, editBook, 
  signupPublisher, getBookById, getPublisherProfile, deleteBook, getReviewInsights, 
  getBookReviews, getRatingDistribution, getPublisherBooks, getMonthlyReviewStats,
  verifyPublisherEmail, };
