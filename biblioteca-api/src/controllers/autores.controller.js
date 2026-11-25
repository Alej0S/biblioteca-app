import * as Autores from '../models/autores.model.js';

function validar(cuerpo) {
  const nombre = String(cuerpo.nombre ?? '').trim();
  const nacionalidad = String(cuerpo.nacionalidad ?? '').trim() || null;

  if (!nombre) return { error: 'El nombre es obligatorio' };
  if (nombre.length > 150) return { error: 'El nombre no puede superar los 150 caracteres' };
  if (nacionalidad && nacionalidad.length > 100) {
    return { error: 'La nacionalidad no puede superar los 100 caracteres' };
  }

  return { datos: { nombre, nacionalidad } };
}

function leerId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Id inválido' });
    return null;
  }
  return id;
}

export async function listar(req, res, next) {
  try {
    res.json(await Autores.listar(req.usuario.id));
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const id = leerId(req, res);
    if (id === null) return;

    const autor = await Autores.obtenerPorId(id, req.usuario.id);
    if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });

    res.json(autor);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { datos, error } = validar(req.body ?? {});
    if (error) return res.status(400).json({ error });

    res.status(201).json(await Autores.crear(req.usuario.id, datos));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya tenés un autor con ese nombre' });
    }
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const id = leerId(req, res);
    if (id === null) return;

    const { datos, error } = validar(req.body ?? {});
    if (error) return res.status(400).json({ error });

    const autor = await Autores.actualizar(id, req.usuario.id, datos);
    if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });

    res.json(autor);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya tenés un autor con ese nombre' });
    }
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    const id = leerId(req, res);
    if (id === null) return;

    const eliminado = await Autores.eliminar(id, req.usuario.id);
    if (!eliminado) return res.status(404).json({ error: 'Autor no encontrado' });

    res.status(204).end();
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ error: 'No se puede borrar: el autor tiene libros' });
    }
    next(error);
  }
}
