const jwt = require('jsonwebtoken');

const AuthCheck = (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send('Token is required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).send('Invalid token access');
    }

    next()
};

module.exports = AuthCheck;
