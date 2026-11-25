import { request } from './api';

export function listar({ buscar = '', estado = '', autor_id = '' } = {}, signal) {
  const parametros = new URLSearchParams();
  if (buscar) parametros.set('buscar', buscar);
  if (estado) parametros.set('estado', estado);
  if (autor_id) parametros.set('autor_id', autor_id);

  const consulta = parametros.toString();
  return request(`/libros${consulta ? `?${consulta}` : ''}`, { signal });
}

export const obtener = (id, signal) => request(`/libros/${id}`, { signal });
export const crear = (datos) => request('/libros', { metodo: 'POST', cuerpo: datos });
export const actualizar = (id, datos) => request(`/libros/${id}`, { metodo: 'PUT', cuerpo: datos });
export const cambiarEstado = (id, estado) =>
  request(`/libros/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado } });
export const eliminar = (id) => request(`/libros/${id}`, { metodo: 'DELETE' });
