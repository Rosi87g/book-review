import jwt from 'jsonwebtoken';
import usermodel from '../models/usermodel.js';

// User authentication middleware

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("authUser error:", error);
    res.status(401).json({ success: false, message: 'Unauthorized access' });
  }
};

export default authUser;