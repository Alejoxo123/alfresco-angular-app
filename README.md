# 📁 Alfresco Angular App – Prueba Técnica Profesional

Aplicación desarrollada con **Angular 20 (Standalone Components)** que consume la **API REST de Alfresco**, utilizando `alf_ticket` para autenticación.  
Incluye navegación dinámica de nodos, creación de carpetas y documentos, edición de contenido, manejo de sesión y una interfaz moderna inspirada en Bridgetech.

---

# 🚀 Características Principales

## 🔐 Autenticación
- Login usando el endpoint oficial de autenticación de Alfresco:
```
POST /alfresco/api/-default-/public/authentication/versions/1/tickets
```
- Manejo de `alf_ticket` con almacenamiento local seguro.
- Redirección automática al módulo de documentos.
- Logout con invalidación del ticket vía:
```
DELETE /alfresco/api/-default-/public/authentication/versions/1/tickets/-me-?alf_ticket=...
```

---

## 📂 Gestión de Documentos y Carpetas

### ✔ Listado de nodos con paginación
```
GET /alfresco/api/-default-/public/alfresco/versions/1/nodes/{nodeId}/children?alf_ticket=...
```

### ✔ Navegación con Breadcrumb dinámico  
El usuario puede moverse entre carpetas fácilmente, subir de nivel y visualizar el contexto actual.

### ✔ Crear carpetas
```
POST /nodes/{parentId}/children
{
  "name": "Nueva carpeta",
  "nodeType": "cm:folder"
}
```

### ✔ Crear documentos `.txt`
```
POST /nodes/{parentId}/children
{
  "name": "documento.txt",
  "nodeType": "cm:content"
}
```

### ✔ Editar nombre de archivos o carpetas
```
PUT /nodes/{nodeId}
{
  "name": "nuevoNombre"
}
```

### ✔ Editar contenido de documentos `.txt`
```
PUT /nodes/{nodeId}/content
Content-Type: text/plain
```

---

# 🎨 Diseño UI – Bridgetech Style

La aplicación sigue un diseño moderno inspirado en los colores y estilo de Bridgetech:

| Elemento | Color |
|---------|--------|
| Azul corporativo | `#004dff` |
| Azul hover | `#0036b3` |
| Naranja corporativo | `#ff8000` |
| Fondo suave | `#f5f6fa` |

Incluye:
- Navbar fijo y global con menú de usuario.
- Tarjetas y modales con sombras suaves.
- Formularios accesibles y responsivos.
- Tablas modernas con hover y badges visuales.
- Spinners de carga y notificaciones con `ngx-toastr`.

---

# 🧱 Arquitectura del Proyecto  
### 🧩 Estructura basada en Standalone Components (sin módulos)

```
src/
 ├─ app/
 │   ├─ login/
 │   │    ├─ login.ts             # Componente standalone
 │   │    ├─ login.html
 │   │    └─ login.scss
 │   ├─ documents/
 │   │    ├─ documents.ts         # Lógica principal del explorador
 │   │    ├─ documents.html
 │   │    └─ documents.scss
 │   ├─ navbar/
 │   │    ├─ navbar.ts            # Barra superior global
 │   │    ├─ navbar.html
 │   │    └─ navbar.scss
 │   ├─ services/
 │   │    ├─ authentication.ts    # Manjeo de login / logout
 │   │    └─ alfresco.ts          # CRUD de nodos, contenido y navegación
 │   ├─ models/
 │   │    └─ alfresco.models.ts   # Interfaces del API de Alfresco
 │   ├─ app.routes.ts             # Declaración de rutas standalone
 │   ├─ app.config.ts             # Providers globales
 │   └─ app.ts                    # Root component
 ├─ environments/
 │   ├─ environment.ts
 │   └─ environment.development.ts
 ├─ main.ts                       # Bootstrap de Angular
 └─ styles.scss                   # Estilos globales (Toastr + fuentes)
```

---

# 🧬 Principios de Arquitectura Aplicados

### ✔ Standalone Architecture
- Elimina módulos innecesarios.
- Cada componente importa solo lo que usa.
- Providers centralizados en `app.config.ts`.

### ✔ Servicios fuertemente tipados
- Interfaces separadas en `/models`.
- HttpClient centralizado por servicio.

### ✔ Manejo de errores profesional
- Toasts para errores y éxitos.
- Validaciones de formularios reactivas.

### ✔ Facilidad de mantenimiento
- UI separada por componentes.
- Carpetas organizadas por dominio.
- Código comentado y limpio.

---

# ⚙ Configuración de Environments

### `environment.ts`
```ts
export const environment = {
  production: true,
  alfrescoBaseUrl: 'http://alfresco-demos.bridgetech.company:8080'
};
```

### `environment.development.ts`
```ts
export const environment = {
  production: false,
  alfrescoBaseUrl: 'http://alfresco-demos.bridgetech.company:8080'
};
```

### Uso en servicios
```ts
import { environment } from '../../environments/environment';

this.baseUrl = `${environment.alfrescoBaseUrl}/alfresco/api/-default-/public/...`;
```

---

# 🛠 Instalación y Ejecución

### 1️⃣ Clonar el repositorio
```
git clone https://github.com/Alejoxo123/alfresco-angular-app.git
```

### 2️⃣ Instalar dependencias
```
npm install
```

### 3️⃣ Ejecutar servidor local
```
ng serve
```
Abrir → http://localhost:4200/

---

# 🏗 Compilar para producción

```
ng build
```

Genera los archivos en `/dist`.

---

# 🧪 Scripts disponibles

```
npm start
npm run build
npm run watch
npm test
```

---

# 📦 Cómo subir este proyecto a GitHub

```
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Alejoxo123/alfresco-angular-app.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

# 🏁 Objetivos de la prueba técnica logrados

- ✔ Login con ticket de Alfresco  
- ✔ Almacenamiento persistente de sesión  
- ✔ Listado de nodos con navegación jerárquica  
- ✔ Breadcrumb inteligente  
- ✔ Crear carpetas  
- ✔ Crear documentos `.txt`  
- ✔ Editar nombre  
- ✔ Editar contenido  
- ✔ Logout con invalidación real del ticket  
- ✔ UI moderna con estilo Bridgetech  
- ✔ Notificaciones con Toastr  
- ✔ Arquitectura limpia y profesional  
- ✔ Uso avanzado de componentes standalone  

---

# 📄 Licencia
Proyecto desarrollado exclusivamente para fines de evaluación técnica y demostración.

---

¡Gracias por revisar este proyecto!  
Si deseas una versión del README con screenshots o GIFs, puedo generarlos también.
