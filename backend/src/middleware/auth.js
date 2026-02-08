import { verifyToken } from '../utils/jwt.js';

/**
 * Authentication middleware - Validates JWT token
 * Attaches user info to req.user
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const queryToken = req.query?.token;
    const altHeaderToken = req.headers['x-access-token'];
    const token = headerToken || queryToken || altHeaderToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }

    const normalizedRole = decoded.role?.toLowerCase?.() || decoded.role;

    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      role: normalizedRole,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};
