import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/auth';
import { guardarToken, borrarToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Se lee localStorage al crear el estado (de forma síncrona): al recargar la
  // página la sesión ya está disponible antes de que RutaProtegida decida.
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  function abrirSesion({ token, usuario: datos }) {
    guardarToken(token);
    localStorage.setItem('usuario', JSON.stringify(datos));
    setUsuario(datos);
  }

  async function login(email, password) {
    abrirSesion(await authService.login(email, password));
  }

  async function registro(email, password) {
    abrirSesion(await authService.registro(email, password));
  }

  function logout() {
    borrarToken();
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  // services/api.js borra el token y avisa con este evento cuando la API
  // responde 401: acá se olvida al usuario y RutaProtegida manda a /login
  useEffect(() => {
    function alExpirar() {
      localStorage.removeItem('usuario');
      setUsuario(null);
    }
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}
