import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormularioLibro from '../components/FormularioLibro';
import { useAutores } from '../hooks/useAutores';
import * as librosService from '../services/libros';

export default function DetalleLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { autores, cargando: cargandoAutores } = useAutores();
  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();

    librosService
      .obtener(id, controlador.signal)
      .then(setLibro)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });

    return () => controlador.abort();
  }, [id]);

  async function guardar(datos) {
    await librosService.actualizar(id, datos);
    navigate('/libros');
  }

  return (
    <section className="contenedor contenedor-formulario">
      <Link className="enlace-volver" to="/libros">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M10 3.5L5.5 8L10 12.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Volver a libros
      </Link>

      <div className="encabezado-pagina">
        <div className="encabezado-texto">
          <h1 className="display-xl">Editar libro</h1>
          {libro && <span className="body-sm">{libro.titulo}</span>}
        </div>
      </div>

      {(cargando || cargandoAutores) && <p className="estado-carga">Cargando…</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !cargandoAutores && libro && (
        <div className="tarjeta">
          <FormularioLibro inicial={libro} autores={autores} alGuardar={guardar} />
        </div>
      )}
    </section>
  );
}
