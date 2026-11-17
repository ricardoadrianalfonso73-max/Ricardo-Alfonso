# Electro Tecno — Backend + Base de Datos

Este directorio es **100% independiente del frontend** y está listo para subirse a su propio repositorio de Git y desplegarse en **Render**, **Railway**, **Fly.io** o cualquier servidor **VPS con Node.js**.

## Estructura
- `src/server.ts`: Servidor Express independiente con soporte CORS.
- `src/routes/api.ts`: Endpoints REST (`/api/products`, `/api/auth/*`, `/api/orders`, `/api/contact`, `/api/service-requests`).
- `src/config/database.ts`: Persistencia automática y configuración MySQL.
- `src/middleware/auth.ts`: Autenticación HMAC y hash `scrypt`.
- `database/schema.sql`: Esquema SQL completo para MySQL 8.

## Despliegue rápido (Render / Railway)
1. Subí el contenido de la carpeta `backend/` a un repositorio propio en GitHub.
2. En Render/Railway configurá:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Agregá la variable de entorno `CORS_ORIGIN` con la URL de tu frontend en Vercel (ej. `https://tu-tienda.vercel.app`).
4. En tu frontend de Vercel agregá la variable `VITE_API_URL` apuntando a la URL de este backend.
