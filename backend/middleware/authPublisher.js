import jwt from 'jsonwebtoken';
import Publisher from '../models/publishermodel.js';

const authPublisher = async (req, res, next) => {
  try {
    const token = req.headers.atoken; // ✅ Use consistent naming

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in again.',
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.',
      });
    }

    // ✅ Find publisher by ID
    const publisher = await Publisher.findById(decoded.id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher not found.',
      });
    }

    // ✅ Attach publisher to request
    req.publisher = publisher;
    next();
  } catch (error) {
    console.error('authPublisher error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed. ' + error.message,
    });
  }
};

export default authPublisher;