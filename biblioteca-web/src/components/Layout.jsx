import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MarcaRoundel from './MarcaRoundel';

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
        <div className="barra-interior">
          <Link to="/" className="marca">
            <MarcaRoundel size={36} />
            <span className="marca-nombre">Biblioteca</span>
          </Link>

          <nav className="barra-nav" aria-label="Navegación principal">
            <NavLink to="/" end className="nav-enlace">
              Inicio
            </NavLink>
            {usuario && (
              <NavLink to="/libros" className="nav-enlace">
                Libros
              </NavLink>
            )}
            {usuario && (
              <NavLink to="/autores" className="nav-enlace">
                Autores
              </NavLink>
            )}
          </nav>

          <div className="barra-sesion">
            {usuario ? (
              <>
                <span className="barra-usuario" title={usuario.email}>
                  {usuario.email}
                </span>
                <button
                  type="button"
                  className="boton boton-secundario boton-chico"
                  onClick={salir}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="boton boton-secundario boton-chico">
                  Ingresar
                </NavLink>
                <NavLink to="/registro" className="boton boton-chico">
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pagina-principal">
        <Outlet />
      </main>

      <footer className="pie">
        <div className="pie-interior">
          <div className="pie-marca">
            <MarcaRoundel size={30} invertido />
            <span>Biblioteca personal</span>
          </div>

          <nav className="pie-enlaces" aria-label="Navegación del pie">
            <Link to="/">Inicio</Link>
            {usuario ? (
              <>
                <Link to="/libros">Mis libros</Link>
                <Link to="/libros/nuevo">Nuevo libro</Link>
                <Link to="/autores">Autores</Link>
              </>
            ) : (
              <>
                <Link to="/login">Ingresar</Link>
                <Link to="/registro">Crear cuenta</Link>
              </>
            )}
          </nav>

          <p className="pie-nota">Catálogo personal de lecturas</p>
        </div>
      </footer>
    </>
  );
}
