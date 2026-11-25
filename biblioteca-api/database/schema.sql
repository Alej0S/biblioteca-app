SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS biblioteca
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE biblioteca;

DROP TABLE IF EXISTS libros;
DROP TABLE IF EXISTS autores;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE autores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  nacionalidad VARCHAR(100) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_autores_usuario_nombre UNIQUE (usuario_id, nombre),
  CONSTRAINT fk_autores_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE TABLE libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  autor_id INT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  anio SMALLINT NULL,
  estado ENUM('leido', 'pendiente', 'prestado') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_libros_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_libros_autor FOREIGN KEY (autor_id)
    REFERENCES autores (id) ON DELETE RESTRICT
);

CREATE USER IF NOT EXISTS 'biblioteca_app'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT SELECT, INSERT, UPDATE, DELETE ON biblioteca.* TO 'biblioteca_app'@'localhost';

INSERT INTO usuarios (id, email, password_hash) VALUES
  (1, 'demo@biblioteca.com', '$2b$10$9CERpUExcqO5H2.O9DgAKOVbHIfimMsxVX98pCVNyt9X8FBJ5UnBC');

INSERT INTO autores (id, usuario_id, nombre, nacionalidad) VALUES
  (1, 1, 'Jorge Luis Borges', 'Argentina'),
  (2, 1, 'Julio Cortázar', 'Argentina'),
  (3, 1, 'Ursula K. Le Guin', 'Estados Unidos');

INSERT INTO libros (usuario_id, autor_id, titulo, anio, estado) VALUES
  (1, 1, 'Ficciones', 1944, 'leido'),
  (1, 1, 'El Aleph', 1949, 'pendiente'),
  (1, 2, 'Rayuela', 1963, 'prestado'),
  (1, 2, 'Bestiario', 1951, 'leido'),
  (1, 3, 'Los desposeídos', 1974, 'pendiente');
