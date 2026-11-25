import LibroItem from './LibroItem';

export default function ListaLibros({ libros, alCambiarEstado, alBorrar }) {
  return (
    <ul className="lista">
      {libros.map((libro) => (
        <LibroItem key={libro.id} libro={libro} alCambiarEstado={alCambiarEstado} alBorrar={alBorrar} />
      ))}
    </ul>
  );
}
