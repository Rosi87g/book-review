import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usermodel from '../models/usermodel.js';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import sendEmail from '../config/sendEmail.js';

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Enter a strong password" });
    }

    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verifyToken = crypto.randomBytes(32).toString('hex');

    const newUser = new usermodel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyToken,
    });

    await newUser.save();

    const verifyLink = `${process.env.FRONTEND_URL}/verify/${verifyToken}`;
    await sendEmail(email, 'Verify your email', `
      <p>Hello ${name},</p>
      <p>Thanks for registering. Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email before logging in.",
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    const user = await usermodel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET PROFILE
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = await usermodel.findById(userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Missing user context." });
    }

    const { name, bio } = req.body;
    const imageFile = req.file;

    if (!name || !bio) {
      return res.json({ success: false, message: "Data Missing" });
    }

    let updateData = { name, bio };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await usermodel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log("Update error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ ADD TO FAVOURITES
const addToFavourites = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    await usermodel.findByIdAndUpdate(userId, {
      $addToSet: { favourites: bookId },
    });

    res.status(200).json({ success: true, message: 'Added to favourites' });
  } catch (error) {
    console.error("addToFavourites error:", error);
    res.status(500).json({ success: false, message: 'Failed to add to favourites' });
  }
};

// ✅ REMOVE FROM FAVOURITES
const removeFromFavourites = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    await usermodel.findByIdAndUpdate(userId, {
      $pull: { favourites: bookId },
    });

    res.status(200).json({ success: true, message: 'Removed from favourites' });
  } catch (error) {
    console.error("removeFromFavourites error:", error);
    res.status(500).json({ success: false, message: 'Failed to remove from favourites' });
  }
};

// ✅ GET FAVOURITES
const getFavourites = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await usermodel.findById(userId).populate('favourites');
    res.status(200).json({ success: true, favourites: user.favourites });
  } catch (error) {
    console.error("getFavourites error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch favourites' });
  }
};

// ✅ VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await usermodel.findOne({ verifyToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('verifyEmail error:', error);
    res.status(500).json({ success: false, message: 'Email verification failed' });
  }
};

// ✅ REQUEST PASSWORD RESET
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(404).json({ success: false, message: 'User not found or not verified' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    await sendEmail(email, 'Reset your password', `
      <p>Hello ${user.name},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `);

    res.status(200).json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('requestPasswordReset error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset link' });
  }
};

// ✅ RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await usermodel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

        res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in.',
    });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

//API TO RESEND VERIFICATION EMAIL

const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    await user.save();

    const verifyLink = `${process.env.FRONTEND_URL}/verify/${verifyToken}`;
    await sendEmail(user.email, "Verify your email", `
      <p>Hello ${user.name},</p>
      <p>Click to verify your email:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `);

    res.json({ success: true, message: "Verification email resent" });
  } catch (error) {
    console.error("resendVerificationEmail error:", error);
    res.status(500).json({ success: false, message: "Failed to resend verification email" });
  }
};

//API TO REVERIFY PASSWORD
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Invalid password input" });
    }

    const user = await usermodel.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    res.status(500).json({ success: false, message: "Failed to change password" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  resendVerificationEmail, changePassword,
  getProfile,
  updateProfile,
  addToFavourites,
  removeFromFavourites,
  getFavourites
};