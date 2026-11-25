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
    <section className="contenedor contenedor-angosto">
      <div className="tarjeta">
        <div className="encabezado-texto" style={{ marginBottom: '28px' }}>
          <h1 className="display-xl">Crear cuenta</h1>
          <span className="body-sm">Empezá a registrar tus lecturas hoy.</span>
        </div>

        <form onSubmit={manejarEnvio} className="formulario" noValidate>
          <label className={`campo ${errores.email ? 'campo-invalido' : ''}`}>
            <span className="campo-etiqueta">Email</span>
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={manejarCambio}
              autoComplete="email"
              placeholder="nombre@ejemplo.com"
            />
            {errores.email && <span className="error-campo">{errores.email}</span>}
          </label>

          <label className={`campo ${errores.password ? 'campo-invalido' : ''}`}>
            <span className="campo-etiqueta">Contraseña</span>
            <input
              type="password"
              name="password"
              value={datos.password}
              onChange={manejarCambio}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
            />
            {errores.password && <span className="error-campo">{errores.password}</span>}
          </label>

          <label className={`campo ${errores.confirmar ? 'campo-invalido' : ''}`}>
            <span className="campo-etiqueta">Repetir contraseña</span>
            <input
              type="password"
              name="confirmar"
              value={datos.confirmar}
              onChange={manejarCambio}
              autoComplete="new-password"
              placeholder="Repetí tu contraseña"
            />
            {errores.confirmar && <span className="error-campo">{errores.confirmar}</span>}
          </label>

          {error && <p className="error">{error}</p>}

          <button className="boton boton-ancho" disabled={enviando}>
            {enviando ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="pie-formulario">
          ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
        </p>
      </div>
    </section>
  );
}
