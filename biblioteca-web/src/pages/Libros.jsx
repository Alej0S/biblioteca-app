import { Link } from 'react-router-dom';
import { useLibros } from '../hooks/useLibros';
import { useAutores } from '../hooks/useAutores';
import Filtros from '../components/Filtros';
import ListaLibros from '../components/ListaLibros';

export default function Libros() {
  const { libros, cargando, error, filtros, setFiltros, cambiarEstado, eliminar } = useLibros();
  const { autores } = useAutores();

  const hayFiltros = Boolean(filtros.buscar || filtros.estado || filtros.autor_id);

  function limpiarFiltros() {
    setFiltros({ buscar: '', estado: '', autor_id: '' });
  }

  return (
    <section className="contenedor">
      <div className="encabezado-pagina">
        <div className="encabezado-texto">
          <h1 className="display-xl">Mis libros</h1>
          {!cargando && !error && (
            <span className="body-sm tabular">
              {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
              {hayFiltros ? ' encontrados' : ' en tu biblioteca'}
            </span>
          )}
        </div>
        <Link className="boton" to="/libros/nuevo">
          Nuevo libro
        </Link>
      </div>

      <Filtros filtros={filtros} setFiltros={setFiltros} autores={autores} />

      {cargando && <p className="estado-carga">Cargando libros…</p>}
      {error && <p className="error">No se pudieron cargar los libros: {error}</p>}

      {!cargando && !error && libros.length === 0 && (
        <div className="vacio">
          <p>
            {hayFiltros
              ? 'No hay libros que coincidan con los filtros actuales.'
              : 'Todavía no cargaste libros en tu biblioteca.'}
          </p>
          {hayFiltros ? (
            <button
              type="button"
              className="boton boton-secundario boton-chico"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          ) : (
            <Link className="boton" to="/libros/nuevo">
              Agregar primer libro
            </Link>
          )}
        </div>
      )}

      {!cargando && !error && libros.length > 0 && (
        <ListaLibros libros={libros} alCambiarEstado={cambiarEstado} alBorrar={eliminar} />
      )}
    </section>
  );
}
