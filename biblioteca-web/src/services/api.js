const API_URL = import.meta.env.VITE_API_URL;
const CLAVE_TOKEN = 'token';

export const obtenerToken = () => localStorage.getItem(CLAVE_TOKEN);
export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token);
export const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN);

export async function request(ruta, { metodo = 'GET', cuerpo, signal } = {}) {
  const headers = {};

  const token = obtenerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers,
    body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    signal,
  });

  // 401 en una ruta protegida (token vencido, inválido o ausente): se cierra la
  // sesión y se avisa a AuthContext, que redirige a /login (ver RutaProtegida).
  // En /auth/* un 401 es "credenciales incorrectas" y no debe cerrar nada.
  if (res.status === 401 && !ruta.startsWith('/auth/')) {
    borrarToken();
    window.dispatchEvent(new Event('sesion-expirada'));
  }

  if (res.status === 204) return null;

  const datos = await res.json().catch(() => null);
  if (!res.ok) throw new Error(datos?.error || `Error ${res.status}`);

  return datos;
}
