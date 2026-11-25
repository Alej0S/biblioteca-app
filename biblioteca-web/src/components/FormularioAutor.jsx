import { useState } from 'react';

const VACIO = { nombre: '', nacionalidad: '' };

export default function FormularioAutor({
  inicial,
  alGuardar,
  alCancelar,
  textoBoton = 'Guardar',
  className = '',
}) {
  const [datos, setDatos] = useState(() =>
    inicial ? { nombre: inicial.nombre, nacionalidad: inicial.nacionalidad ?? '' } : VACIO
  );
  const [errorNombre, setErrorNombre] = useState(null);
  const [errorServidor, setErrorServidor] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setErrorServidor(null);

    const nombre = datos.nombre.trim();
    if (!nombre) return setErrorNombre('El nombre es obligatorio');
    if (nombre.length > 150) return setErrorNombre('Máximo 150 caracteres');
    setErrorNombre(null);

    setEnviando(true);
    try {
      await alGuardar({ nombre, nacionalidad: datos.nacionalidad.trim() });
      if (!inicial) setDatos(VACIO);
    } catch (err) {
      setErrorServidor(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} className={`formulario ${className}`} noValidate>
      <div className="formulario-fila">
        <label className={`campo ${errorNombre ? 'campo-invalido' : ''}`}>
          <span className="campo-etiqueta">Nombre</span>
          <input
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
            maxLength={150}
            placeholder="Ej. Jorge Luis Borges"
          />
          {errorNombre && <span className="error-campo">{errorNombre}</span>}
        </label>
        <label className="campo">
          <span className="campo-etiqueta">Nacionalidad</span>
          <input
            name="nacionalidad"
            value={datos.nacionalidad}
            onChange={manejarCambio}
            maxLength={100}
            placeholder="Opcional"
          />
        </label>
      </div>

      {errorServidor && <p className="error">{errorServidor}</p>}

      <div className="acciones">
        <button className="boton" disabled={enviando}>
          {enviando ? 'Guardando…' : textoBoton}
        </button>
        {alCancelar && (
          <button type="button" className="boton boton-secundario" onClick={alCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
