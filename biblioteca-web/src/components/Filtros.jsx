import { ESTADOS } from '../datos/estados';

export default function Filtros({ filtros, setFiltros, autores }) {
  const hayFiltros = Boolean(filtros.buscar || filtros.estado || filtros.autor_id);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFiltros((anteriores) => ({ ...anteriores, [name]: value }));
  }

  function limpiar() {
    setFiltros({ buscar: '', estado: '', autor_id: '' });
  }

  return (
    <div className="filtros">
      <div className="campo-busqueda">
        <span className="campo-busqueda-icono" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.25" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M13.8 13.8L17.5 17.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="search"
          name="buscar"
          placeholder="Buscar por título…"
          aria-label="Buscar por título"
          value={filtros.buscar}
          onChange={manejarCambio}
        />
      </div>

      <select
        name="estado"
        aria-label="Filtrar por estado"
        value={filtros.estado}
        onChange={manejarCambio}
      >
        <option value="">Todos los estados</option>
        {ESTADOS.map((e) => (
          <option key={e.valor} value={e.valor}>
            {e.texto}
          </option>
        ))}
      </select>

      <select
        name="autor_id"
        aria-label="Filtrar por autor"
        value={filtros.autor_id}
        onChange={manejarCambio}
      >
        <option value="">Todos los autores</option>
        {autores.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre}
          </option>
        ))}
      </select>

      {hayFiltros && (
        <button
          type="button"
          className="boton boton-secundario boton-chico"
          onClick={limpiar}
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
