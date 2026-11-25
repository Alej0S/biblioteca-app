import { useState } from 'react';
import { useAutores } from '../hooks/useAutores';
import FormularioAutor from '../components/FormularioAutor';

export default function Autores() {
  const { autores, cargando, error, crear, actualizar, eliminar } = useAutores();
  const [editandoId, setEditandoId] = useState(null);
  const [errorBorrado, setErrorBorrado] = useState(null);

  async function borrar(autor) {
    if (!confirm(`¿Borrar a ${autor.nombre}?`)) return;
    setErrorBorrado(null);
    try {
      await eliminar(autor.id);
    } catch (err) {
      setErrorBorrado(err.message);
    }
  }

  async function guardarEdicion(id, datos) {
    await actualizar(id, datos);
    setEditandoId(null);
  }

  return (
    <section className="contenedor">
      <div className="encabezado-pagina">
        <div className="encabezado-texto">
          <h1 className="display-xl">Autores</h1>
          {!cargando && !error && (
            <span className="body-sm tabular">
              {autores.length} {autores.length === 1 ? 'autor registrado' : 'autores registrados'}
            </span>
          )}
        </div>
      </div>

      <div className="tarjeta tarjeta-superficie">
        <h2 className="tarjeta-titulo">Nuevo autor</h2>
        <FormularioAutor alGuardar={crear} textoBoton="Agregar autor" className="nuevo-autor" />
      </div>

      {errorBorrado && <p className="error" style={{ marginBottom: '24px' }}>{errorBorrado}</p>}

      {cargando && <p className="estado-carga">Cargando autores…</p>}
      {error && <p className="error">No se pudieron cargar los autores: {error}</p>}
      {!cargando && !error && autores.length === 0 && (
        <div className="vacio">
          <p>Todavía no cargaste autores.</p>
        </div>
      )}

      {!cargando && !error && autores.length > 0 && (
        <ul className="lista">
          {autores.map((autor) =>
            editandoId === autor.id ? (
              <li key={autor.id} className="item item-editando">
                <FormularioAutor
                  inicial={autor}
                  alGuardar={(datos) => guardarEdicion(autor.id, datos)}
                  alCancelar={() => setEditandoId(null)}
                />
              </li>
            ) : (
              <li key={autor.id} className="item">
                <div className="item-principal">
                  <span className="item-titulo">{autor.nombre}</span>
                  <div className="item-detalle">
                    {autor.nacionalidad ?? 'Sin nacionalidad'} · {autor.cantidad_libros}{' '}
                    {Number(autor.cantidad_libros) === 1 ? 'libro' : 'libros'}
                  </div>
                </div>
                <div className="acciones">
                  <button
                    type="button"
                    className="boton boton-secundario boton-chico"
                    onClick={() => setEditandoId(autor.id)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="boton boton-peligro boton-chico"
                    onClick={() => borrar(autor)}
                  >
                    Borrar
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}
