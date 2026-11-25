import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FORMATO_EMAIL = /^\S+@\S+\.\S+$/;

function validar({ email, password, confirmar }) {
  const errores = {};
  if (!FORMATO_EMAIL.test(email.trim())) errores.email = 'Ingresá un email válido';
  if (password.length < 6) errores.password = 'Mínimo 6 caracteres';
  if (confirmar !== password) errores.confirmar = 'Las contraseñas no coinciden';
  return errores;
}

export default function Registro() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ email: '', password: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError(null);

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await registro(datos.email.trim(), datos.password);
      navigate('/libros', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="tarjeta tarjeta-angosta">
      <h2>Crear cuenta</h2>
      <form onSubmit={manejarEnvio} className="formulario" noValidate>
        <label className="campo">
          Email
          <input type="email" name="email" value={datos.email} onChange={manejarCambio} autoComplete="email" />
          {errores.email && <span className="error-campo">{errores.email}</span>}
        </label>
        <label className="campo">
          Contraseña
          <input type="password" name="password" value={datos.password} onChange={manejarCambio} autoComplete="new-password" />
          {errores.password && <span className="error-campo">{errores.password}</span>}
        </label>
        <label className="campo">
          Repetir contraseña
          <input type="password" name="confirmar" value={datos.confirmar} onChange={manejarCambio} autoComplete="new-password" />
          {errores.confirmar && <span className="error-campo">{errores.confirmar}</span>}
        </label>

        {error && <p className="error">{error}</p>}

        <button className="boton" disabled={enviando}>
          {enviando ? 'Creando…' : 'Crear cuenta'}
        </button>
      </form>
      <p>¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
    </section>
  );
}
