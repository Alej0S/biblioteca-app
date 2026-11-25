import jwt from 'jsonwebtoken';

export function requiereAutenticacion(req, res, next) {
  const cabecera = req.headers.authorization;

  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Falta el token de autenticación' });
  }

  try {
    req.usuario = jwt.verify(cabecera.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch (error) {
    const mensaje =
      error.name === 'TokenExpiredError' ? 'La sesión expiró' : 'Token inválido';
    res.status(401).json({ error: mensaje });
  }
}
