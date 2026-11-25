import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return (
    <section className="tarjeta vacio">
      <h2>Página no encontrada</h2>
      <p>La dirección que buscás no existe.</p>
      <Link className="boton" to="/">Volver al inicio</Link>
    </section>
  );
}
