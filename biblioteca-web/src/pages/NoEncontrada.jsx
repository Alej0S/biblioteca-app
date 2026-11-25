import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return (
    <section className="contenedor contenedor-angosto">
      <div className="vacio">
        <span className="codigo-404">404</span>
        <h1 className="display-md">Página no encontrada</h1>
        <p>La dirección que buscás no existe.</p>
        <Link className="boton" to="/">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
