const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Not authorized, token missing' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token malformed' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

const admin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

module.exports = { protect, admin };
