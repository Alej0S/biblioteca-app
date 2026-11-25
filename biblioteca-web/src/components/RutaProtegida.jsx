import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Envuelve las páginas que necesitan sesión. Sin usuario, manda a /login y
// recuerda adónde quería ir (state.desde) para volver después de ingresar.
export default function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location }} />;
  }

  return children;
}
