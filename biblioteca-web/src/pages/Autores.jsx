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
      setErrorBorrado(err.message); // 409: "No se puede borrar: el autor tiene libros"
    }
  }

  async function guardarEdicion(id, datos) {
    await actualizar(id, datos);
    setEditandoId(null);
  }

  return (
    <>
      <section className="tarjeta">
        <h2>Autores</h2>
        <FormularioAutor alGuardar={crear} textoBoton="Agregar autor" className="nuevo-autor" />
      </section>

      <section className="tarjeta">
        {errorBorrado && <p className="error">{errorBorrado}</p>}

        {cargando && <p className="estado-carga">Cargando autores…</p>}
        {error && <p className="error">No se pudieron cargar los autores: {error}</p>}
        {!cargando && !error && autores.length === 0 && (
          <p className="vacio">Todavía no cargaste autores.</p>
        )}

        {!cargando && !error && autores.length > 0 && (
          <ul className="lista">
            {autores.map((autor) =>
              editandoId === autor.id ? (
                <li key={autor.id} className="item">
                  <FormularioAutor
                    inicial={autor}
                    alGuardar={(datos) => guardarEdicion(autor.id, datos)}
                    alCancelar={() => setEditandoId(null)}
                  />
                </li>
              ) : (
                <li key={autor.id} className="item">
                  <div className="item-principal">
                    <strong>{autor.nombre}</strong>
                    <div className="item-detalle">
                      {autor.nacionalidad ?? 'Sin nacionalidad'} · {autor.cantidad_libros}{' '}
                      {Number(autor.cantidad_libros) === 1 ? 'libro' : 'libros'}
                    </div>
                  </div>
                  <div className="acciones">
                    <button className="boton boton-secundario boton-chico" onClick={() => setEditandoId(autor.id)}>Editar</button>
                    <button className="boton boton-peligro boton-chico" onClick={() => borrar(autor)}>Borrar</button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </>
  );
}
