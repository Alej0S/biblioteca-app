import { Link, useNavigate } from 'react-router-dom';
import FormularioLibro from '../components/FormularioLibro';
import { useAutores } from '../hooks/useAutores';
import * as librosService from '../services/libros';

export default function NuevoLibro() {
  const navigate = useNavigate();
  const { autores, cargando, error } = useAutores();

  async function guardar(datos) {
    await librosService.crear(datos);
    navigate('/libros');
  }

  return (
    <section className="tarjeta">
      <div className="encabezado">
        <h2>Nuevo libro</h2>
        <Link to="/libros">← Volver</Link>
      </div>

      {cargando && <p className="estado-carga">Cargando autores…</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && autores.length === 0 && (
        <div className="aviso">
          <p>Primero cargá un autor para poder agregar libros.</p>
          <Link className="boton" to="/autores">Ir a autores</Link>
        </div>
      )}
      {!cargando && !error && autores.length > 0 && (
        <FormularioLibro autores={autores} alGuardar={guardar} />
      )}
    </section>
  );
}
