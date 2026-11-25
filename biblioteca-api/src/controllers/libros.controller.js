import * as Libros from '../models/libros.model.js';
import * as Autores from '../models/autores.model.js';

const ESTADOS = ['leido', 'pendiente', 'prestado'];

function validar(cuerpo) {
  const titulo = String(cuerpo.titulo ?? '').trim();
  const estado = cuerpo.estado ?? 'pendiente';
  const autor_id = Number(cuerpo.autor_id);
  const anioCrudo = cuerpo.anio;
  const anio = anioCrudo === null || anioCrudo === undefined || anioCrudo === '' ? null : Number(anioCrudo);

  if (!titulo) return { error: 'El título es obligatorio' };
  if (titulo.length > 200) return { error: 'El título no puede superar los 200 caracteres' };
  if (anio !== null && (!Number.isInteger(anio) || anio < 0 || anio > new Date().getFullYear())) {
    return { error: 'El año no es válido' };
  }
  if (!ESTADOS.includes(estado)) return { error: 'El estado no es válido' };
  if (!Number.isInteger(autor_id) || autor_id < 1) return { error: 'El autor es obligatorio' };

  return { datos: { titulo, anio, estado, autor_id } };
}

function leerId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Id inválido' });
    return null;
  }
  return id;
}

// El autor tiene que existir y ser del mismo usuario: si no, la FK fallaría
// (o peor, el libro quedaría asociado al autor de otra persona).
async function autorEsDelUsuario(autorId, usuarioId) {
  return (await Autores.obtenerPorId(autorId, usuarioId)) !== null;
}

export async function listar(req, res, next) {
  try {
    const { estado = '', buscar = '', autor_id = '' } = req.query;

    if (estado && !ESTADOS.includes(estado)) {
      return res.status(400).json({ error: 'El filtro de estado no es válido' });
    }
    if (autor_id && !(Number.isInteger(Number(autor_id)) && Number(autor_id) > 0)) {
      return res.status(400).json({ error: 'El filtro de autor no es válido' });
    }

    res.json(await Libros.listar(req.usuario.id, { estado, buscar, autor_id }));
  } catch (error) {
    next(error);
  }
}

export async function obtener(req, res, next) {
  try {
    const id = leerId(req, res);
    if (id === null) return;

    const libro = await Libros.obtenerPorId(id, req.usuario.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    res.json(libro);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { datos, error } = validar(req.body ?? {});
    if (error) return res.status(400).json({ error });

    if (!(await autorEsDelUsuario(datos.autor_id, req.usuario.id))) {
      return res.status(400).json({ error: 'El autor no existe' });
    }

    res.status(201).json(await Libros.crear(req.usuario.id, datos));
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const id = leerId(req, res);
    if (id === null) return;

    const { datos, error } = validar(req.body ?? {});
    if (error) return res.status(400).json({ error });

    // Primero se comprueba que el libro sea del usuario (404), después el autor (400)
    if (!(await Libros.obtenerPorId(id, req.usuario.id))) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    if (!(await autorEsDelUsuario(datos.autor_id, req.usuario.id))) {
      return res.status(400).json({ error: 'El autor no existe' });
    }

    res.json(await Libros.actualizar(id, req.usuario.id, datos));
  } catch (error) {
    next(error);
  }
}

export async function cambiarEstado(req, res, next) {
  try {
    const id = leerId(req, res);
    if (id === null) return;

    const { estado } = req.body ?? {};
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ error: 'El estado no es válido' });
    }

    const libro = await Libros.cambiarEstado(id, req.usuario.id, estado);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    res.json(libro);
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    const id = leerId(req, res);
    if (id === null) return;

    const eliminado = await Libros.eliminar(id, req.usuario.id);
    if (!eliminado) return res.status(404).json({ error: 'Libro no encontrado' });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
