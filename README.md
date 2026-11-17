# Electro Tecno — Frontend y Backend Separados

El proyecto está organizado en **dos aplicaciones independientes** listas para subir a repositorios Git separados y desplegar por separado:

- **`frontend/`**: Tienda web en React + TypeScript + Vite + Tailwind CSS v4 (lista para **Vercel** o **Netlify**).
- **`backend/`**: API REST en Node.js + Express + TypeScript + esquema SQL para **MySQL** (lista para **Render**, **Railway**, **Fly.io** o **VPS**).

*(Los archivos en la raíz —`package.json`, `vite.config.ts`, `server.ts`— permiten correr ambos servicios juntos en un solo puerto durante el desarrollo local o en preview).*

---

## 1. Subir a Git por separado

### Repositorio 1: Frontend
```bash
cd frontend
git init
git add .
git commit -m "Frontend Electro Tecno"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/electro-tecno-frontend.git
git push -u origin main
```

### Repositorio 2: Backend + Base de Datos
```bash
cd backend
git init
git add .
git commit -m "Backend y base de datos Electro Tecno"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/electro-tecno-backend.git
git push -u origin main
```

---

## 2. Despliegue en producción

### A. Desplegar el Backend (`backend/`) en Render / Railway / VPS
1. Configurá la base de datos ejecutando `backend/database/schema.sql` en tu servidor MySQL (o usá la persistencia integrada de inicio rápido).
2. Variables de entorno del backend:
   - `PORT=4000` (o el asignado por el hosting)
   - `CORS_ORIGIN=https://tu-frontend.vercel.app`
   - `AUTH_SECRET=una-clave-larga-y-segura`
   - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
3. Comando de inicio: `npm start` (`tsx src/server.ts`)

### B. Desplegar el Frontend (`frontend/`) en Vercel
1. Importá el repositorio `electro-tecno-frontend` en Vercel.
2. En **Environment Variables**, agregá:
   - `VITE_API_URL=https://tu-backend-desplegado.com`
3. Build command: `npm run build` · Output directory: `dist`.

---

## 3. Desarrollo local rápido

En la raíz del proyecto podés ejecutar todo junto con:
```bash
npm install
npm run dev
```
Y abrir `http://localhost:3000`.
