import { pool } from '../config/db.js';

// JOIN con autores para devolver también el nombre del autor de cada libro.
// Todas las consultas filtran por l.usuario_id: un usuario solo ve sus libros.
const COLUMNAS = `
  l.id, l.titulo, l.anio, l.estado, l.autor_id, a.nombre AS autor_nombre, l.creado_en`;
const DESDE = 'FROM libros l JOIN autores a ON a.id = l.autor_id';

export async function listar(usuarioId, { estado, buscar, autor_id } = {}) {
  let sql = `SELECT ${COLUMNAS} ${DESDE} WHERE l.usuario_id = ?`;
  const parametros = [usuarioId];

  if (estado) {
    sql += ' AND l.estado = ?';
    parametros.push(estado);
  }

  if (autor_id) {
    sql += ' AND l.autor_id = ?';
    parametros.push(autor_id);
  }

  if (buscar) {
    sql += ' AND l.titulo LIKE ?';
    parametros.push(`%${buscar}%`);
  }

  sql += ' ORDER BY l.id DESC';

  const [filas] = await pool.query(sql, parametros);
  return filas;
}

export async function obtenerPorId(id, usuarioId) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} ${DESDE} WHERE l.id = ? AND l.usuario_id = ?`,
    [id, usuarioId]
  );
  return filas[0] ?? null;
}

export async function crear(usuarioId, { titulo, anio, estado, autor_id }) {
  const [resultado] = await pool.query(
    'INSERT INTO libros (usuario_id, autor_id, titulo, anio, estado) VALUES (?, ?, ?, ?, ?)',
    [usuarioId, autor_id, titulo, anio, estado]
  );
  return obtenerPorId(resultado.insertId, usuarioId);
}

export async function actualizar(id, usuarioId, { titulo, anio, estado, autor_id }) {
  const [resultado] = await pool.query(
    'UPDATE libros SET titulo = ?, anio = ?, estado = ?, autor_id = ? WHERE id = ? AND usuario_id = ?',
    [titulo, anio, estado, autor_id, id, usuarioId]
  );
  return resultado.affectedRows > 0 ? obtenerPorId(id, usuarioId) : null;
}

export async function cambiarEstado(id, usuarioId, estado) {
  const [resultado] = await pool.query(
    'UPDATE libros SET estado = ? WHERE id = ? AND usuario_id = ?',
    [estado, id, usuarioId]
  );
  return resultado.affectedRows > 0 ? obtenerPorId(id, usuarioId) : null;
}

export async function eliminar(id, usuarioId) {
  const [resultado] = await pool.query(
    'DELETE FROM libros WHERE id = ? AND usuario_id = ?',
    [id, usuarioId]
  );
  return resultado.affectedRows > 0;
}
