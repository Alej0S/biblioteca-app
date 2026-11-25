import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Inicio() {
  const { usuario } = useAuth();

  return (
    <section className="tarjeta">
      <h2>Tu biblioteca personal</h2>
      <p>Registrá tus libros y autores, y llevá la cuenta de lo que leíste, lo que tenés pendiente y lo que prestaste.</p>
      {usuario ? (
        <Link className="boton" to="/libros">Ver mis libros</Link>
      ) : (
        <div className="acciones">
          <Link className="boton" to="/login">Ingresar</Link>
          <Link className="boton boton-secundario" to="/registro">Crear cuenta</Link>
        </div>
      )}
    </section>
  );
}
