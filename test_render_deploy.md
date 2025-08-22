# 🧪 Pruebas Post-Deploy

## URLs a verificar:

1. **Health Check:**
   ```
   GET https://namerize-backend.onrender.com/health
   Respuesta esperada: {"status": "ok"}
   ```

2. **API Docs (Swagger):**
   ```
   https://namerize-backend.onrender.com/docs
   Debe mostrar la interfaz de FastAPI
   ```

3. **Lista de marcas (vacía al inicio):**
   ```
   GET https://namerize-backend.onrender.com/brands
   Respuesta esperada: {"items": [], "page": 1, "page_size": 10, "total": 0}
   ```

4. **Lista de estados (debe tener los 3 por defecto):**
   ```
   GET https://namerize-backend.onrender.com/statuses
   Respuesta esperada: [{"id": 1, "code": "PENDING", "label": "Pendiente"}, ...]
   ```

## ✅ Si todas estas pruebas pasan, tu deploy está exitoso!
