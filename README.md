# Geoofertas

Aplicación Angular para gestión de embeddings y búsqueda semántica con integración de modelos de IA.

## 📋 Información General

- **Framework**: Angular CLI versión 20
- **Builder**: Vite (Angular 20+)
- **Lenguaje**: TypeScript
- **Estilos**: Bootstrap 5.3.3 + Font Awesome 6.7.2
- **Mapas**: Leaflet 1.9.4

## 🏗️ Arquitectura del Proyecto

### Componentes Principales

#### 1. **HeroComponent** (Página Principal)
Componente principal que gestiona la interacción con el backend de embeddings.

**Funcionalidades:**
- **Información de Documentos**: Consulta metadata de la base de datos de embeddings
- **Gestión de Documentos**:
  - Obtener primeros N documentos (`loadEarliestDocuments`)
  - Obtener últimos N documentos (`loadLatestDocuments`)
  - Obtener rango de documentos por ID (`loadDocumentsRange`)
  - Eliminar embeddings por ID (`deleteEmbeddingById`)
- **Generación de Embeddings**:
  - Embedding único (`getEmbedding`)
  - Embeddings múltiples (`getMultiEmbedding`)
- **Búsqueda Semántica**: Búsqueda por similitud de embeddings (`searchEmbedding`)
- **Información del Modelo**: Consulta estado y configuración del modelo activo

#### 2. **MapaComponent**
Componente de visualización geográfica usando Leaflet.

#### 3. **LlmDirectoComponent**
Interfaz para interacción directa con modelos de lenguaje.

#### 4. **IaComponent**
Componente de orquestación de IA.

#### 5. **Llm7ChatComponent**
Interfaz de chat con el modelo LLM7.

### Servicios

#### **EmbeddingService**
Servicio principal para comunicación con el backend de embeddings.

**Endpoints:**
```typescript
GET  /api/documents/info           // Información de la tabla documents
GET  /api/documents/earliest?n=5   // Primeros N documentos
GET  /api/documents/latest?n=5     // Últimos N documentos
GET  /api/documents/range?start_id=X&limit=Y  // Rango de documentos
DELETE /api/documents/{id}         // Eliminar documento por ID
POST /api/embedding?text=...       // Generar embedding único
POST /api/embeddings               // Generar embeddings múltiples
POST /api/search?text=...&limit=10 // Búsqueda semántica
```

#### **InfoModelsService**
Gestión de información de modelos de IA.

#### **Llm7Service**
Integración con el modelo LLM7 (langchain-llm7).

#### **LlmService**
Servicio genérico para modelos de lenguaje.

#### **IaOrquestadorService**
Orquestador de servicios de IA.

## 🔧 Configuración

### Entornos

#### **Development** (`environment.development.ts`)
```typescript
export const environment = {
    production: false,
    appName: 'Geoofertas',
    apiUrl: ''  // Usa proxy local
};
```

#### **Production** (`environment.ts`)
```typescript
export const environment = {
    production: true,
    appName: 'Geoofertas',
    apiUrl: 'https://embeddings-back.vercel.app'
};
```

### Proxy de Desarrollo

**Archivo**: `src/proxy.conf.json`

```json
{
  "/api": {
    "target": "https://embeddings-back.vercel.app",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

**Propósito**: Evitar problemas de CORS en desarrollo redirigiendo peticiones `/api/*` al backend en Vercel.

**Configuración en `angular.json`**:
```json
"serve": {
  "configurations": {
    "development": {
      "buildTarget": "geoofertas:build:development",
      "proxyConfig": "src/proxy.conf.json"
    }
  }
}
```

## 🚀 Comandos

### Desarrollo
```bash
ng serve                              # Servidor de desarrollo (puerto 4200)
ng serve --configuration development  # Modo desarrollo explícito (con proxy)
```

### Build
```bash
ng build                    # Build de producción
ng build --watch            # Build con watch mode
```

### Testing
```bash
ng test                     # Ejecutar tests con Karma
ng test --watch=false       # Tests sin watch mode
```

## 🌐 Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | HeroComponent | Página principal - Gestión de embeddings |
| `/mapa` | MapaComponent | Visualización de mapas |
| `/llm` | LlmDirectoComponent | Interacción directa con LLM |
| `/ia` | IaComponent | Orquestador de IA |
| `/chat` | Llm7ChatComponent | Chat con LLM7 |

## 📦 Dependencias Principales

### Producción
- `@angular/core`: ^20.0.3
- `@angular/router`: ^20.0.3
- `bootstrap`: ^5.3.3
- `@fortawesome/fontawesome-free`: ^6.7.2
- `leaflet`: ^1.9.4
- `langchain-llm7`: ^2025.4.291003
- `@langchain/core`: ^0.3.58

### Desarrollo
- `@angular/cli`: ^20.0.2
- `@angular/build`: ^20.0.2 (Vite builder)
- `typescript`: ~5.8.3

## 🔌 Backend

**URL**: `https://embeddings-back.vercel.app`

**Tecnología**: FastAPI (Python)

**Documentación**: `https://embeddings-back.vercel.app/docs` (Swagger UI)

**Modelo de Embeddings**: BAAI/bge-small-en-v1.5 (Hugging Face)

### Notas Importantes sobre el Backend

⚠️ **Limitaciones de Vercel Serverless**:
- El backend usa bases de datos basadas en archivos (SQLite/ChromaDB)
- En entornos serverless, esto puede causar errores `[Errno 16] Device or resource busy`
- Algunos endpoints pueden fallar si intentan acceder a archivos bloqueados
- Para producción, se recomienda migrar a bases de datos externas (PostgreSQL, etc.)

## 🛠️ Solución de Problemas

### Error: CORS en desarrollo
**Síntoma**: `Access to XMLHttpRequest blocked by CORS policy`

**Solución**: Asegúrate de que:
1. `environment.development.ts` tenga `apiUrl: ''`
2. El proxy esté configurado en `angular.json`
3. Reinicies el servidor después de cambios en configuración

### Error: 500 Internal Server Error
**Síntoma**: `GET /api/documents/info 500`

**Causa**: Error en el backend (no en Angular)

**Verificación**: 
1. Abre `https://embeddings-back.vercel.app/docs`
2. Prueba el endpoint directamente en Swagger
3. Revisa los logs de Vercel

### Proxy no funciona
**Síntoma**: Peticiones van a `localhost:4200/api/...` en lugar de Vercel

**Solución**:
```bash
# Detener servidor
Ctrl+C

# Reiniciar con configuración explícita
ng serve --configuration development
```

## 📝 Flujo de Datos

```
Usuario → Angular (localhost:4200)
         ↓
    Proxy (/api/*)
         ↓
    Vercel Backend (embeddings-back.vercel.app)
         ↓
    Hugging Face (Modelo de Embeddings)
         ↓
    Base de Datos (SQLite/ChromaDB)
```

## 🎨 Estilos y UI

- **Framework CSS**: Bootstrap 5.3.3
- **Iconos**: Font Awesome 6.7.2
- **Componentes**: Cards, Tabs, Tables, Forms
- **Responsive**: Mobile-first design

## 📄 Licencia

Este proyecto es privado.

---

**Última actualización**: Diciembre 2025