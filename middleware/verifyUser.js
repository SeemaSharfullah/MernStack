const jwt = require('jsonwebtoken');
const JWT_SECRET = 'JWTSECRET';

// In your route handler or middleware
const verifyToken = (req, res, next) => {
    const token = req.header('token');
    console.log(token, 'token');
    if (!token) {
        res.status(401).send({ error: 'Access denied! No token provided' });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET); // decode
        console.log('User id:', data);
       // req.user = data; // property
        next();
    } catch (err) {
        res.status(403).send({ message: 'Invalid token!' });
    }
};

module.exports =  verifyToken ;
