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

  // Si llegó redirigido por RutaProtegida, vuelve a la página que pidió
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
    <section className="tarjeta tarjeta-angosta">
      <h2>Ingresar</h2>
      <form onSubmit={manejarEnvio} className="formulario" noValidate>
        <label className="campo">
          Email
          <input type="email" name="email" value={datos.email} onChange={manejarCambio} autoComplete="email" />
        </label>
        <label className="campo">
          Contraseña
          <input type="password" name="password" value={datos.password} onChange={manejarCambio} autoComplete="current-password" />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="boton" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p>¿No tenés cuenta? <Link to="/registro">Creá una</Link></p>
    </section>
  );
}
