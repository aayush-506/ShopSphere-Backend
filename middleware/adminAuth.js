import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
     const token = req.headers.token; // ✅ FIXED
     
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: "Unauthorized login" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default adminAuth;
