import { request } from './api';

export const login = (email, password) =>
  request('/auth/login', { metodo: 'POST', cuerpo: { email, password } });

export const registro = (email, password) =>
  request('/auth/registro', { metodo: 'POST', cuerpo: { email, password } });
