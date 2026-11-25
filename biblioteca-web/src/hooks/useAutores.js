import { useEffect, useState } from 'react';
import * as autoresService from '../services/autores';

export function useAutores() {
  const [autores, setAutores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Se carga una sola vez al montar (cargando ya arranca en true)
  useEffect(() => {
    const controlador = new AbortController();

    autoresService
      .listar(controlador.signal)
      .then(setAutores)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });

    return () => controlador.abort();
  }, []);

  // Se actualiza el estado con lo que responde la API ("primero la API,
  // después el estado"): si la API falla, la pantalla no cambia.
  async function crear(datos) {
    const nuevo = await autoresService.crear(datos);
    setAutores((actuales) =>
      [...actuales, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre))
    );
  }

  async function actualizar(id, datos) {
    const actualizado = await autoresService.actualizar(id, datos);
    setAutores((actuales) => actuales.map((a) => (a.id === id ? actualizado : a)));
  }

  async function eliminar(id) {
    await autoresService.eliminar(id);
    setAutores((actuales) => actuales.filter((a) => a.id !== id));
  }

  return { autores, cargando, error, crear, actualizar, eliminar };
}
