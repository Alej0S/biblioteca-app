import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibros } from '../hooks/useLibros';

// Solo se monta con sesión: así no se pide /libros sin token
function ResumenLibros() {
  const { libros, cargando, error } = useLibros();

  if (cargando) return <p className="estado-carga">Cargando resumen…</p>;
  if (error) return <p className="error">{error}</p>;

  // Dato derivado: se calcula en cada render a partir de la lista (React 03)
  const contar = (estado) => libros.filter((l) => l.estado === estado).length;
  const datos = [
    { texto: 'Total', numero: libros.length },
    { texto: 'Leídos', numero: contar('leido') },
    { texto: 'Pendientes', numero: contar('pendiente') },
    { texto: 'Prestados', numero: contar('prestado') },
  ];

  return (
    <div className="resumen">
      {datos.map((d) => (
        <div key={d.texto} className="resumen-dato">
          <span className="resumen-numero">{d.numero}</span>
          {d.texto}
        </div>
      ))}
    </div>
  );
}

export default function Inicio() {
  const { usuario } = useAuth();

  return (
    <section className="tarjeta">
      <h2>Tu biblioteca personal</h2>
      <p>Registrá tus libros y autores, y llevá la cuenta de lo que leíste, lo que tenés pendiente y lo que prestaste.</p>
      {usuario ? (
        <>
          <ResumenLibros />
          <Link className="boton" to="/libros">Ver mis libros</Link>
        </>
      ) : (
        <div className="acciones">
          <Link className="boton" to="/login">Ingresar</Link>
          <Link className="boton boton-secundario" to="/registro">Crear cuenta</Link>
        </div>
      )}
    </section>
  );
}
