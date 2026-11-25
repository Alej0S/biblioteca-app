import { useState } from 'react';
import { Link } from 'react-router-dom';
import Insignia from './Insignia';
import { ESTADOS } from '../datos/estados';

export default function LibroItem({ libro, alCambiarEstado, alBorrar }) {
  const [error, setError] = useState(null);

  async function cambiar(e) {
    setError(null);
    try {
      await alCambiarEstado(libro.id, e.target.value);
    } catch (err) {
      setError(err.message);
    }
  }

  async function borrar() {
    if (!confirm(`¿Borrar "${libro.titulo}"?`)) return;
    try {
      await alBorrar(libro.id);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <li className="item">
      <div className="item-principal">
        <Link className="item-titulo" to={`/libros/${libro.id}`}>
          {libro.titulo}
        </Link>
        <div className="item-detalle">
          {libro.autor_nombre}
          {libro.anio !== null && ` · ${libro.anio}`}
        </div>
        {error && <p className="error-campo">{error}</p>}
      </div>

      <Insignia estado={libro.estado} />

      <div className="acciones">
        <select
          className="selector-estado"
          aria-label={`Cambiar estado de ${libro.titulo}`}
          value={libro.estado}
          onChange={cambiar}
        >
          {ESTADOS.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.texto}
            </option>
          ))}
        </select>
        <button type="button" className="boton boton-peligro boton-chico" onClick={borrar}>
          Borrar
        </button>
      </div>
    </li>
  );
}
