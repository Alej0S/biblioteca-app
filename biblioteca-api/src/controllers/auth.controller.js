import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Usuarios from '../models/usuarios.model.js';

const FORMATO_EMAIL = /^\S+@\S+\.\S+$/;

function firmarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

export async function registro(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Faltan el email o la contraseña' });
    }

    if (!FORMATO_EMAIL.test(email.trim())) {
      return res.status(400).json({ error: 'El email no tiene un formato válido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = await Usuarios.crear(email.trim(), hash);
    const usuario = { id, email: email.trim() };

    res.status(201).json({ token: firmarToken(usuario), usuario });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ese email ya está registrado' });
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    const registrado = typeof email === 'string' ? await Usuarios.buscarPorEmail(email.trim()) : undefined;
    const coincide =
      registrado && (await bcrypt.compare(String(password ?? ''), registrado.password_hash));

    if (!coincide) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const usuario = { id: registrado.id, email: registrado.email };
    res.json({ token: firmarToken(usuario), usuario });
  } catch (error) {
    next(error);
  }
}
