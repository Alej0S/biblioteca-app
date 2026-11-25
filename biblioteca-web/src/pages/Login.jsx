import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [datos, setDatos] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.desde?.pathname || '/libros';

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError(null);

    if (!datos.email.trim() || !datos.password) {
      setError('Completá el email y la contraseña');
      return;
    }

    setEnviando(true);
    try {
      await login(datos.email.trim(), datos.password);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="contenedor contenedor-angosto">
      <div className="tarjeta">
        <div className="encabezado-texto" style={{ marginBottom: '28px' }}>
          <h1 className="display-xl">Ingresar</h1>
          <span className="body-sm">Accedé a tu biblioteca personal.</span>
        </div>

        <form onSubmit={manejarEnvio} className="formulario" noValidate>
          <label className="campo">
            <span className="campo-etiqueta">Email</span>
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={manejarCambio}
              autoComplete="email"
              placeholder="nombre@ejemplo.com"
            />
          </label>

          <label className="campo">
            <span className="campo-etiqueta">Contraseña</span>
            <input
              type="password"
              name="password"
              value={datos.password}
              onChange={manejarCambio}
              autoComplete="current-password"
              placeholder="Tu contraseña"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="boton boton-ancho" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="pie-formulario">
          ¿No tenés cuenta? <Link to="/registro">Creá una</Link>
        </p>
      </div>
    </section>
  );
}
