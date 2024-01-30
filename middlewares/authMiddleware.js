const jwt = require('jsonwebtoken');
const hashedSecret = require('../crypto/config.js');

const generateToken = (user) => {
    return jwt.sign(
      {
        user: user.id,
      },
      hashedSecret,
      { expiresIn: '1h' }
    );
}

const isAuthenticated = (req, res, next) => {
  if (req.session.token) next()
  else next('route')
}


const verifyToken = (req, res, next) => {
    const token = req.session.token;
  
    if (!token) {
      return res.status(401).json({ message: 'token no generado' });
    }
  
    jwt.verify(token, hashedSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'token invalido' });
      }
      req.user = decoded.user;
      next();
    });
}

module.exports = {
    generateToken,
    verifyToken,
    isAuthenticated
}