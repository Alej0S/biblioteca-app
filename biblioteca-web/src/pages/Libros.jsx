import { Link } from 'react-router-dom';
import { useLibros } from '../hooks/useLibros';
import { useAutores } from '../hooks/useAutores';
import Filtros from '../components/Filtros';
import ListaLibros from '../components/ListaLibros';

export default function Libros() {
  const { libros, cargando, error, filtros, setFiltros, cambiarEstado, eliminar } = useLibros();
  const { autores } = useAutores();

  const hayFiltros = Boolean(filtros.buscar || filtros.estado || filtros.autor_id);

  return (
    <section className="tarjeta">
      <div className="encabezado">
        <h2>Mis libros</h2>
        <Link className="boton" to="/libros/nuevo">Nuevo libro</Link>
      </div>

      <Filtros filtros={filtros} setFiltros={setFiltros} autores={autores} />

      {cargando && <p className="estado-carga">Cargando libros…</p>}
      {error && <p className="error">No se pudieron cargar los libros: {error}</p>}
      {!cargando && !error && libros.length === 0 && (
        <p className="vacio">
          {hayFiltros ? 'No hay libros que coincidan con los filtros.' : 'Todavía no cargaste libros.'}
        </p>
      )}
      {!cargando && !error && libros.length > 0 && (
        <ListaLibros libros={libros} alCambiarEstado={cambiarEstado} alBorrar={eliminar} />
      )}
    </section>
  );
}
