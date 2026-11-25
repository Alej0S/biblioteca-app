import { pool } from '../config/db.js';

const COLUMNAS = `
  a.id, a.nombre, a.nacionalidad, a.creado_en,
  (SELECT COUNT(*) FROM libros l WHERE l.autor_id = a.id) AS cantidad_libros`;

export async function listar(usuarioId) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM autores a WHERE a.usuario_id = ? ORDER BY a.nombre`,
    [usuarioId]
  );
  return filas;
}

export async function obtenerPorId(id, usuarioId) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM autores a WHERE a.id = ? AND a.usuario_id = ?`,
    [id, usuarioId]
  );
  return filas[0] ?? null;
}

export async function crear(usuarioId, { nombre, nacionalidad }) {
  const [resultado] = await pool.query(
    'INSERT INTO autores (usuario_id, nombre, nacionalidad) VALUES (?, ?, ?)',
    [usuarioId, nombre, nacionalidad]
  );
  return obtenerPorId(resultado.insertId, usuarioId);
}

export async function actualizar(id, usuarioId, { nombre, nacionalidad }) {
  const [resultado] = await pool.query(
    'UPDATE autores SET nombre = ?, nacionalidad = ? WHERE id = ? AND usuario_id = ?',
    [nombre, nacionalidad, id, usuarioId]
  );
  return resultado.affectedRows > 0 ? obtenerPorId(id, usuarioId) : null;
}

export async function eliminar(id, usuarioId) {
  const [resultado] = await pool.query(
    'DELETE FROM autores WHERE id = ? AND usuario_id = ?',
    [id, usuarioId]
  );
  return resultado.affectedRows > 0;
}
