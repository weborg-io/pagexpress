import jwt from 'jsonwebtoken';
import config from 'config';

const auth = (req, res, next) => {
  const AuthorizationHeader = req.header('Authorization');

  if (!AuthorizationHeader) {
    return res.status(401).json({
      message: 'Access denied. No token provided',
      status: 'error',
    });
  }

  const [bearerKeyword, token] = AuthorizationHeader.split(' ');

  if (bearerKeyword !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Access denied. No token provided',
      status: 'error',
    });
  }

  try {
    res.user = jwt.verify(token, config.get('pxSecret'));
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid token',
      status: 'error',
    });
  }
};

export default auth;
