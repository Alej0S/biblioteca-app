import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RutaProtegida from './components/RutaProtegida';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Libros from './pages/Libros';
import NuevoLibro from './pages/NuevoLibro';
import DetalleLibro from './pages/DetalleLibro';
import Autores from './pages/Autores';
import NoEncontrada from './pages/NoEncontrada';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Protegidas: sin sesión redirigen a /login */}
        <Route path="/libros" element={<RutaProtegida><Libros /></RutaProtegida>} />
        <Route path="/libros/nuevo" element={<RutaProtegida><NuevoLibro /></RutaProtegida>} />
        <Route path="/libros/:id" element={<RutaProtegida><DetalleLibro /></RutaProtegida>} />
        <Route path="/autores" element={<RutaProtegida><Autores /></RutaProtegida>} />

        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
