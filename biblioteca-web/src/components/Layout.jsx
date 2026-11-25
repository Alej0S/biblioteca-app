import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function salir() {
    logout();
    navigate('/');
  }

  return (
    <>
      <header className="barra">
        <h1>📚 Biblioteca</h1>
        <nav>
          <NavLink to="/" end>Inicio</NavLink>
          {usuario && <NavLink to="/libros">Libros</NavLink>}
          {usuario && <NavLink to="/autores">Autores</NavLink>}
        </nav>
        <div className="sesion">
          {usuario ? (
            <>
              <span className="usuario">{usuario.email}</span>
              <button className="boton boton-secundario" onClick={salir}>Salir</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Ingresar</NavLink>
              <NavLink to="/registro">Registrarse</NavLink>
            </>
          )}
        </div>
      </header>

      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}
