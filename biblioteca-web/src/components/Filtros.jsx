import { ESTADOS } from '../datos/estados';

export default function Filtros({ filtros, setFiltros, autores }) {
  function manejarCambio(e) {
    const { name, value } = e.target;
    setFiltros((anteriores) => ({ ...anteriores, [name]: value }));
  }

  return (
    <div className="filtros">
      <input
        type="search"
        name="buscar"
        placeholder="Buscar por título…"
        aria-label="Buscar por título"
        value={filtros.buscar}
        onChange={manejarCambio}
      />
      <select name="estado" aria-label="Filtrar por estado" value={filtros.estado} onChange={manejarCambio}>
        <option value="">Todos los estados</option>
        {ESTADOS.map((e) => (
          <option key={e.valor} value={e.valor}>{e.texto}</option>
        ))}
      </select>
      <select name="autor_id" aria-label="Filtrar por autor" value={filtros.autor_id} onChange={manejarCambio}>
        <option value="">Todos los autores</option>
        {autores.map((a) => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>
    </div>
  );
}
