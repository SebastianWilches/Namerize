# 🎯 **Namerize - Sistema de Gestión de Marcas Registradas**

**Desarrollado por:** **Jhoan Sebastián Wilches Jiménez**  
**Rol:** Desarrollador Full Stack  
**Fecha:** Enero 2025

---

## 📋 **Descripción del Proyecto**

**Namerize** es un sistema completo de gestión de marcas registradas construido con arquitectura moderna full-stack. La aplicación permite administrar marcas comerciales, sus titulares (personas/empresas) y los estados asociados a cada marca, proporcionando una solución integral para el control y seguimiento de registros marcarios.

---

## 🛠️ **Stack Tecnológico**

### **Backend - API REST**
| Librería/Framework | Versión | Propósito |
|-------------------|---------|-----------|
| **FastAPI** | 0.115.0 | Framework web principal para crear APIs REST |
| **Uvicorn** | 0.30.6 | Servidor ASGI de alto rendimiento |
| **SQLAlchemy** | 2.0.34 | ORM para manejo de base de datos relacional |
| **Pydantic** | 2.9.0 | Validación y serialización de datos |
| **Pydantic Settings** | 2.4.0 | Gestión de configuración y variables de entorno |
| **Python-dotenv** | 1.0.1 | Carga de variables de entorno desde archivos .env |

### **Frontend - Aplicación Web**
| Librería/Framework | Versión | Propósito |
|-------------------|---------|-----------|
| **Next.js** | 15.5.0 | Framework React con App Router |
| **React** | 19.1.0 | Librería principal para la interfaz de usuario |
| **React DOM** | 19.1.0 | Renderizado del DOM para React |
| **@tanstack/react-query** | 5.85.5 | Gestión de estado del servidor y cache |
| **Ky** | 1.9.0 | Cliente HTTP moderno basado en Fetch API |
| **React Hook Form** | 7.62.0 | Manejo de formularios con validación |
| **Zod** | 4.0.17 | Schema validation para TypeScript |

### **Herramientas de Desarrollo**
| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **TypeScript** | ^5 | Tipado estático para JavaScript |
| **Tailwind CSS** | 4.1.12 | Framework CSS utility-first |
| **ESLint** | ^9 | Linting y análisis estático de código |
| **PostCSS** | ^8.5.6 | Procesador de CSS |
| **Autoprefixer** | ^10.4.21 | Prefijos automáticos para CSS |

---

## 🌐 **API Endpoints - CRUD Completo**

### **🏥 Health Check**
```http
GET /health
```
**Descripción:** Verificación del estado de la API  
**Response:** `{ "status": "ok" }`

---

### **🏢 Brands (Marcas)**

#### **Listar Marcas**
```http
GET /brands?search={texto}&page={num}&page_size={num}&include_inactive={bool}
```
**Descripción:** Obtiene lista paginada de marcas con búsqueda  
**Parámetros:** search, paginación, incluir inactivas  
**Response:** Objeto paginado con lista de marcas

#### **Crear Marca**
```http
POST /brands
Content-Type: application/json

{
  "name": "ACME Health",
  "description": "Marca para productos de salud",
  "holder_id": 1,
  "status_id": 2
}
```
**Descripción:** Crea nueva marca con titular y estado  
**Validaciones:** Nombre único por titular

#### **Obtener Marca Específica**
```http
GET /brands/{brand_id}?include_inactive={bool}
```
**Descripción:** Obtiene detalles de una marca específica

#### **Actualizar Marca**
```http
PUT /brands/{brand_id}
Content-Type: application/json

{
  "name": "ACME Health v2",
  "status_id": 3
}
```
**Descripción:** Actualización parcial de marca existente

#### **Eliminar Marca (Soft Delete)**
```http
DELETE /brands/{brand_id}
```
**Descripción:** Eliminación lógica (marca como inactiva)

---

### **👥 Holders (Titulares)**

#### **Listar Titulares**
```http
GET /holders?search={texto}&page={num}&page_size={num}&include_inactive={bool}
```
**Descripción:** Lista paginada de titulares con búsqueda  
**Búsqueda:** Por nombre, identificación legal o email

#### **Crear Titular**
```http
POST /holders
Content-Type: application/json

{
  "name": "Laboratorios ACME S.A.S",
  "legal_identifier": "900123456-7",
  "email": "legal@acme.co"
}
```
**Descripción:** Registra nuevo titular (persona o empresa)

#### **Eliminar Titular (Soft Delete)**
```http
DELETE /holders/{holder_id}
```
**Descripción:** Eliminación lógica del titular

---

### **📊 Statuses (Estados de Marca)**

#### **Listar Estados**
```http
GET /statuses?include_inactive={bool}
```
**Descripción:** Obtiene lista de estados disponibles  
**Estados por defecto:** PENDING, ACTIVE, INACTIVE

#### **Crear Estado**
```http
POST /statuses
Content-Type: application/json

{
  "code": "SUSPENDED",
  "label": "Suspendida"
}
```
**Descripción:** Crea nuevo estado de marca  
**Validación:** Código único

#### **Eliminar Estado (Soft Delete)**
```http
DELETE /statuses/{status_id}
```
**Descripción:** Eliminación lógica del estado

---

## 🎨 **Características del Frontend**

### **🏠 Landing Page**
- Diseño moderno con efectos glassmorphism
- Indicador de conexión en tiempo real con la API
- Call-to-action para acceso rápido a módulos principales

### **🏢 Módulo de Marcas**
- Vista de tabla responsive con paginación
- Búsqueda en tiempo real
- Formularios de creación y edición inline
- Vista de detalles completa con capacidad de edición

### **👥 Módulo de Titulares**
- Vista de cards con avatares generados dinámicamente
- Gestión completa de contactos y documentación legal
- Formularios integrados con validación

### **📊 Módulo de Estados**
- Grid de cards con badges coloridos según tipo
- Gestión de estados del ciclo de vida de marcas
- Validación de unicidad de códigos

### **🎛️ Navegación y UX**
- Sidebar sticky con indicadores visuales
- Estados activos con gradientes temáticos
- Validación de formularios en tiempo real
- Estados de carga y manejo de errores elegante

---

## 📖 **Documentación y Código Fuente**

### **📚 Documentación Interactiva**
La documentación completa de todos los endpoints estará disponible de manera local en:
- **Swagger UI:** `RutaTest1`
- **ReDoc:** `RutaTest1/redoc`

### **💻 Repositorio de Código**
El código fuente completo del proyecto estará disponible en:
- **GitHub:** `CodigoFuente1`

---

## 🚀 **Características Técnicas Destacadas**

### **Backend**
- ✅ **API REST** completa con documentación automática
- ✅ **Soft Delete** en todas las entidades
- ✅ **Timestamps automáticos** con actualización inteligente
- ✅ **Paginación optimizada** (máximo 100 registros)
- ✅ **Validación robusta** con Pydantic schemas
- ✅ **CORS configurado** para desarrollo local

### **Frontend**
- ✅ **App Router de Next.js 15** con Server Components
- ✅ **Sistema de diseño personalizado** con CSS Modules
- ✅ **React Query** para gestión de estado del servidor
- ✅ **Validación de formularios** en tiempo real
- ✅ **Responsive design** completo
- ✅ **TypeScript** para tipado estático robusto

### **Base de Datos**
- ✅ **SQLite** para desarrollo local
- ✅ **Migraciones automáticas** con SQLAlchemy
- ✅ **Relaciones FK** con integridad referencial
- ✅ **Índices** para optimización de consultas

---

## 🎯 **Casos de Uso Principales**

1. **Registro de Marcas:** Crear y asociar marcas con titulares y estados específicos
2. **Gestión de Titulares:** Administrar información de personas y empresas propietarias
3. **Seguimiento de Estados:** Control del ciclo de vida de registros marcarios
4. **Búsqueda y Filtrado:** Localización rápida de información mediante búsquedas
5. **Reportes y Consultas:** Visualización organizada de datos con paginación

---

## 📊 **Métricas del Proyecto**

- **Líneas de código:** ~3,500+ líneas
- **Componentes React:** 15+ componentes personalizados
- **Endpoints API:** 12 endpoints CRUD completos
- **Páginas frontend:** 6 páginas principales
- **Tiempo de desarrollo:** 3 semanas aproximadamente
- **Cobertura de funcionalidades:** 100% de los requerimientos

---

## 🏆 **Conclusión**

**Namerize** representa una solución completa y moderna para la gestión de marcas registradas, implementando las mejores prácticas de desarrollo full-stack con un enfoque en la experiencia del usuario, la escalabilidad y el mantenimiento del código. El proyecto demuestra competencias avanzadas en tecnologías web modernas y arquitectura de software empresarial.

---

**© 2025 - Desarrollado por Jhoan Sebastián Wilches Jiménez**
