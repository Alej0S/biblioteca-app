import { useEffect, useState } from 'react';
import * as librosService from '../services/libros';

export function useLibros() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ buscar: '', estado: '', autor_id: '' });

  useEffect(() => {
    const controlador = new AbortController();

    // Debounce: mientras se escribe en el buscador se espera 400 ms antes de
    // pedir; si cambia otra letra, la limpieza cancela el pedido pendiente.
    const demora = filtros.buscar ? 400 : 0;
    const temporizador = setTimeout(() => {
      setCargando(true);
      setError(null);

      librosService
        .listar(filtros, controlador.signal)
        .then(setLibros)
        .catch((e) => {
          if (e.name !== 'AbortError') setError(e.message);
        })
        .finally(() => {
          if (!controlador.signal.aborted) setCargando(false);
        });
    }, demora);

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [filtros]);

  async function cambiarEstado(id, estado) {
    const actualizado = await librosService.cambiarEstado(id, estado);
    setLibros((actuales) => actuales.map((l) => (l.id === id ? actualizado : l)));
  }

  async function eliminar(id) {
    await librosService.eliminar(id);
    setLibros((actuales) => actuales.filter((l) => l.id !== id));
  }

  return { libros, cargando, error, filtros, setFiltros, cambiarEstado, eliminar };
}
