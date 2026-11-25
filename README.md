# 📚 Biblioteca personal

Aplicación web full-stack para registrar tus **libros** y **autores**, y llevar la cuenta de cuáles **leíste**, cuáles tenés **pendientes** y cuáles **prestaste**. Cada usuario tiene su propia biblioteca: inicia sesión con JWT y solo ve y modifica sus datos.

- **Backend:** Node.js + Express 5 + MySQL (`biblioteca-api/`)
- **Frontend:** React + Vite + React Router (`biblioteca-web/`)

> Descripción completa del proyecto (arquitectura, endpoints, modelo de datos y decisiones): ver [PROYECTO.md](PROYECTO.md).

---

## Requisitos previos

| Herramienta                   | Versión                                                                            | Para qué                  |
| ----------------------------- | ----------------------------------------------------------------------------------- | -------------------------- |
| [Node.js](https://nodejs.org/) | 22 LTS (o ≥ 20.19)                                                                 | Correr la API y el cliente |
| MySQL o MariaDB               | MySQL 8 / MariaDB 10.4+ (por ejemplo, el de [XAMPP](https://www.apachefriends.org/)) | Base de datos              |
| Git                           | cualquiera                                                                          | Clonar el repositorio      |

## Instalación

```bash
git clone <url-de-este-repositorio>
cd biblioteca-app

# Dependencias de la API
cd biblioteca-api
npm install

# Dependencias del cliente
cd ../biblioteca-web
npm install
```

## Crear la base de datos

El script `biblioteca-api/database/schema.sql` crea **todo**: la base `biblioteca`, las tablas `usuarios`, `autores` y `libros`, el usuario de la aplicación `biblioteca_app` y unos datos de ejemplo.

> ⚠️ Borra y vuelve a crear las tablas: si ya tenías datos, se pierden.

**Opción A: terminal** (desde la carpeta `biblioteca-api`). Funciona igual en PowerShell, cmd y bash:

```bash
mysql -u root -p -e "source database/schema.sql"
```

Con XAMPP en Windows (root sin contraseña, `mysql` no está en el PATH):

```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "source database/schema.sql"
```

> En cmd o bash también sirve `mysql -u root -p < database/schema.sql`. En **PowerShell no**: ahí el `<` no redirige archivos.

**Opción B: phpMyAdmin.** Abrir `http://localhost/phpmyadmin` → pestaña **Importar** → elegir `database/schema.sql` → **Continuar**.

**Usuario de prueba** (lo crea el script): `demo@biblioteca.com` / `demo123`, con 3 autores y 5 libros.

> 🔐 El script crea el usuario MySQL `biblioteca_app` con la clave `una-clave-segura` y **solo** permisos `SELECT, INSERT, UPDATE, DELETE`. Fuera de un entorno de práctica, cambiá esa clave en el script y en el `.env`.

## Variables de entorno

Cada proyecto trae un `.env.example`. Copialo como `.env` y completá los valores. **El `.env` nunca se sube al repositorio.**

```bash
# en biblioteca-api/
cp .env.example .env
# en biblioteca-web/
cp .env.example .env
```

(En Windows sin `cp`: `copy .env.example .env`.)

### `biblioteca-api/.env`

| Variable         | Ejemplo                       | Descripción                                                                                                                |
| ---------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `PORT`         | `3000`                      | Puerto donde escucha la API                                                                                                 |
| `FRONTEND_URL` | `http://localhost:5173`     | Origen del cliente; CORS solo acepta pedidos de esta URL                                                                    |
| `DB_HOST`      | `localhost`                 | Servidor MySQL                                                                                                              |
| `DB_PORT`      | `3306`                      | Puerto MySQL                                                                                                                |
| `DB_USER`      | `biblioteca_app`            | Usuario MySQL (lo crea `schema.sql`)                                                                                      |
| `DB_PASSWORD`  | `una-clave-segura`          | Clave de ese usuario (la misma de `schema.sql`)                                                                           |
| `DB_NAME`      | `biblioteca`                | Nombre de la base                                                                                                           |
| `JWT_SECRET`   | *(texto largo y aleatorio)* | Clave para firmar los tokens. Generar una con: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |

### `biblioteca-web/.env`

| Variable         | Ejemplo                       | Descripción                                                              |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de la API. Vite solo expone variables que empiezan con `VITE_` |

## Ejecutar

Hacen falta **dos terminales** (y MySQL encendido):

```bash
# Terminal 1 — API
cd biblioteca-api
npm run dev          # http://localhost:3000  (muestra "Conectado a MySQL" y "API en ...")

# Terminal 2 — Cliente
cd biblioteca-web
npm run dev          # http://localhost:5173
```

Abrir **http://localhost:5173**, ingresar con el usuario demo o crear una cuenta nueva.

### Otros scripts

| Carpeta            | Comando           | Qué hace                                  |
| ------------------ | ----------------- | ------------------------------------------ |
| `biblioteca-api` | `npm start`     | Corre la API sin recarga automática       |
| `biblioteca-web` | `npm run build` | Genera la versión optimizada en `dist/` |
| `biblioteca-web` | `npm run lint`  | Revisa el código con oxlint               |

## Estructura

```
biblioteca-app/
├── biblioteca-api/             API REST (Express + MySQL)
│   ├── database/schema.sql     Script de la base de datos
│   └── src/
│       ├── server.js, app.js   Arranque y configuración de Express
│       ├── config/             Pool de conexiones a MySQL
│       ├── middlewares/        Autenticación JWT y manejo de errores
│       ├── routes/             Endpoints
│       ├── controllers/        Validaciones y respuestas HTTP
│       └── models/             Consultas SQL
└── biblioteca-web/             Cliente React (Vite)
    └── src/
        ├── pages/              Una pantalla por ruta
        ├── components/         Piezas reutilizables
        ├── hooks/              useLibros, useAutores
        ├── services/           Comunicación con la API
        ├── context/            Sesión (AuthContext)
        └── datos/              Constantes
```

## Problemas comunes

| Síntoma                                                                 | Causa probable                                                     | Solución                                     |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------- |
| `No se pudo conectar a MySQL: connect ECONNREFUSED`                    | MySQL apagado                                                      | Encender MySQL (en XAMPP: *Start* en MySQL) |
| `Access denied for user 'biblioteca_app'`                              | No se corrió `schema.sql` o la clave del `.env` no coincide   | Correr el script; revisar `DB_PASSWORD`     |
| `EADDRINUSE :::3000`                                                   | Otra API ya usa el puerto                                          | Cerrar la otra terminal o cambiar `PORT`    |
| Error de CORS en la consola del navegador                                | `FRONTEND_URL` no coincide con la URL del cliente                | Poner exactamente `http://localhost:5173`   |
| `VITE_API_URL` es `undefined` / los pedidos van a `/undefined/...` | Falta `biblioteca-web/.env` o no se reinició Vite               | Crear el `.env` y reiniciar `npm run dev` |
| Me manda a "Ingresar" de golpe                                           | El token venció (dura 2 h)                                        | Volver a iniciar sesión                      |
| Un libro que existe responde 404                                         | Es de otro usuario: por seguridad, la API responde "no encontrado" | Ingresar con el usuario dueño                |
