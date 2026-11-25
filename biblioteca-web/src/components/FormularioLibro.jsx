import { useRef, useState } from 'react';
import { ESTADOS } from '../datos/estados';

const ANIO_ACTUAL = new Date().getFullYear();

function validar({ titulo, autor_id, anio }) {
  const errores = {};
  if (!titulo.trim()) errores.titulo = 'El título es obligatorio';
  else if (titulo.trim().length > 200) errores.titulo = 'Máximo 200 caracteres';
  if (!autor_id) errores.autor_id = 'Elegí un autor';
  if (anio.trim() !== '') {
    const numero = Number(anio);
    if (!/^\d+$/.test(anio.trim()) || numero > ANIO_ACTUAL) {
      errores.anio = `El año debe estar entre 0 y ${ANIO_ACTUAL}`;
    }
  }
  return errores;
}

export default function FormularioLibro({ inicial, autores, alGuardar }) {
  const [datos, setDatos] = useState(() => ({
    titulo: inicial?.titulo ?? '',
    autor_id: inicial?.autor_id ? String(inicial.autor_id) : '',
    anio: inicial?.anio != null ? String(inicial.anio) : '',
    estado: inicial?.estado ?? 'pendiente',
  }));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const refs = { titulo: useRef(null), autor_id: useRef(null), anio: useRef(null) };

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setErrorServidor(null);

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    const primero = ['titulo', 'autor_id', 'anio'].find((campo) => nuevosErrores[campo]);
    if (primero) {
      refs[primero].current.focus();
      return;
    }

    setEnviando(true);
    try {
      await alGuardar({
        titulo: datos.titulo.trim(),
        autor_id: Number(datos.autor_id),
        anio: datos.anio.trim() === '' ? null : Number(datos.anio),
        estado: datos.estado,
      });
    } catch (err) {
      setErrorServidor(err.message);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="formulario" noValidate>
      <label className={`campo ${errores.titulo ? 'campo-invalido' : ''}`}>
        Título
        <input ref={refs.titulo} name="titulo" value={datos.titulo} onChange={manejarCambio} maxLength={200} />
        {errores.titulo && <span className="error-campo">{errores.titulo}</span>}
      </label>

      <div className="formulario-fila">
        <label className={`campo ${errores.autor_id ? 'campo-invalido' : ''}`}>
          Autor
          <select ref={refs.autor_id} name="autor_id" value={datos.autor_id} onChange={manejarCambio}>
            <option value="">Elegí un autor…</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
          {errores.autor_id && <span className="error-campo">{errores.autor_id}</span>}
        </label>

        <label className={`campo ${errores.anio ? 'campo-invalido' : ''}`}>
          Año
          <input ref={refs.anio} type="text" inputMode="numeric" name="anio" value={datos.anio} onChange={manejarCambio} placeholder="Opcional" maxLength={4} />
          {errores.anio && <span className="error-campo">{errores.anio}</span>}
        </label>

        <label className="campo">
          Estado
          <select name="estado" value={datos.estado} onChange={manejarCambio}>
            {ESTADOS.map((e) => (
              <option key={e.valor} value={e.valor}>{e.texto}</option>
            ))}
          </select>
        </label>
      </div>

      {errorServidor && <p className="error">{errorServidor}</p>}

      <div className="acciones">
        <button className="boton" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  );
}
