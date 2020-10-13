import jwt from 'jsonwebtoken';
import config from '../config/keys';

const jwtSignAndCreate = (
  payload: string,
  secret: jwt.Secret,
  options?: jwt.SignOptions
) => {
  return jwt.sign(payload, secret, {
    expiresIn: config.jwt.accessTokenExpiry,
    ...options,
  });
};

export default jwtSignAndCreate;
