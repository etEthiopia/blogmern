
const jwt = require('jsonwebtoken');

// @desc Authentication middleware for authors
// @access Public
function authenticate(req, res, next) {
    const token = req.header('Authorization');


    // Check for token
    if (!token) {

        return res.status(401).json({
            success: false,
            message: 'No Token, Unauthorized Access'
        })
    } else {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Add user from payload
            req.user = decoded;
            next();
        } catch (err) {
            res.status(400).json({
                message: err,
                success: false
            })
        }
    }

}

module.exports = authenticate;