import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibros } from '../hooks/useLibros';
import MarcaRoundel from '../components/MarcaRoundel';

function ResumenLibros() {
  const { libros, cargando, error } = useLibros();

  if (cargando) {
    return (
      <section className="resumen-seccion">
        <div className="resumen-interior">
          <p className="estado-carga">Cargando resumen…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="resumen-seccion">
        <div className="resumen-interior">
          <p className="error">{error}</p>
        </div>
      </section>
    );
  }

  const contar = (estado) => libros.filter((l) => l.estado === estado).length;
  const datos = [
    { texto: 'Total de libros', numero: libros.length },
    { texto: 'Leídos', numero: contar('leido') },
    { texto: 'Pendientes', numero: contar('pendiente') },
    { texto: 'Prestados', numero: contar('prestado') },
  ];

  return (
    <section className="resumen-seccion" aria-label="Resumen de tu biblioteca">
      <div className="resumen-interior">
        <h2 className="display-sm">Estado de tu catálogo</h2>
        <div className="resumen">
          {datos.map((d) => (
            <div key={d.texto} className="resumen-dato">
              <span className="resumen-numero">{d.numero}</span>
              <span className="resumen-etiqueta">{d.texto}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Inicio() {
  const { usuario } = useAuth();

  return (
    <>
      <section className="hero-editorial">
        <div className="hero-interior">
          <h1 className="display-xl">Tu biblioteca personal</h1>
          <p className="body-lg hero-subtitulo">
            Registrá tus libros y autores, y llevá la cuenta de lo que leíste, lo que tenés
            pendiente y lo que prestaste.
          </p>

          {usuario ? (
            <div className="acciones">
              <Link className="boton boton-grande" to="/libros">
                Ver mis libros
              </Link>
              <Link className="boton boton-secundario boton-grande" to="/libros/nuevo">
                Nuevo libro
              </Link>
            </div>
          ) : (
            <div className="acciones">
              <Link className="boton boton-grande" to="/login">
                Ingresar
              </Link>
              <Link className="boton boton-secundario boton-grande" to="/registro">
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </section>

      {usuario && <ResumenLibros />}

      <section className="banda-marca">
        <div className="banda-marca-interior">
          <MarcaRoundel size={56} invertido />
          <h2 className="display-xl">Cada libro en su lugar</h2>
          <p className="body-lg">
            Organizá tu colección por autor y estado de lectura, siempre sincronizada en tu cuenta.
          </p>
          {usuario ? (
            <Link className="boton boton-blanco boton-grande" to="/autores">
              Gestionar autores
            </Link>
          ) : (
            <Link className="boton boton-blanco boton-grande" to="/registro">
              Empezar ahora
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
