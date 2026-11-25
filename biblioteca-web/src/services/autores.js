import { request } from './api';

export const listar = (signal) => request('/autores', { signal });
export const crear = (datos) => request('/autores', { metodo: 'POST', cuerpo: datos });
export const actualizar = (id, datos) => request(`/autores/${id}`, { metodo: 'PUT', cuerpo: datos });
export const eliminar = (id) => request(`/autores/${id}`, { metodo: 'DELETE' });
