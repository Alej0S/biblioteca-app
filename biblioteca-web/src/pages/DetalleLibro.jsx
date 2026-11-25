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
    <section className="tarjeta">
      <div className="encabezado">
        <h2>Editar libro</h2>
        <Link to="/libros">← Volver</Link>
      </div>

      {(cargando || cargandoAutores) && <p className="estado-carga">Cargando…</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !cargandoAutores && libro && (
        <FormularioLibro inicial={libro} autores={autores} alGuardar={guardar} />
      )}
    </section>
  );
}
