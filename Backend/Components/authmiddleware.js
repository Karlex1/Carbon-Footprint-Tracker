const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]
    // console.log(token);
    try {
    if (!token) {
        console.log("token missing")
        return res.status(401).json({message:"No token, authorization failed"})
    }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: "Token is not valid" });
    }
}

module.exports = authMiddleware;