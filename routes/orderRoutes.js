// routes/orderRoutes.js
import express from 'express';
import Order from '../models/orderModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token and get user ID
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.userId = user.id; // Assuming your token payload has the user ID as `id`
    next();
  });
};

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { items, total, deliveryInfo, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items to place order' });
    }

    const newOrder = new Order({
      userId: req.userId,
      items,
      total,
      deliveryInfo,
      paymentMethod,
    });

    await newOrder.save();

    res.status(201).json({ success: true, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
