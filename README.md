# AgroSync - Aplicación Agrícola
## AgroSync 🚜 Frontend
Este repositorio contiene el **frontend (cliente) de AgroSync**, la interfaz de usuario diseñada para la gestión técnica de campos agrícolas. La plataforma ofrece una experiencia interactiva que consume las API REST de AgroSync para centralizar:
- Mapas interactivos con geolocalización de parcelas.
- Visualizador inmersivo de imágenes en 360º.
- Panel de mensajería en tiempo real y gestión de alertas.
- Generación y consulta de reportes técnicos.
  
El sistema está construido como una Single Page Application (SPA) moderna, enfocada en la visualización de datos y la facilidad de uso para el personal de campo y directivos.

### Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
- **Node.js (v18+)**
- **Yarn o npm** (se recomienda Yarn para este proyecto)
**Configuración de proyecto en Firebase** para la autenticación
  
### Instalación y arranque rápido
#### 1º - Clonar y preparar entorno
```language
git clone https://github.com/hannapoli/desafio-final-client.git
cd desafio-final-client
yarn
```

### 2º - Configurar variables de entorno
Renombra .env.template a **.env** y `completa las credenciales`:
```language
VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
VITE_BACKEND_URL=http://localhost:4000
VITE_API_DATA_URL=...
VITE_API_DATA_URL_POINTS=...
VITE_API_DISEASE_URL=...
VITE_CHATBOT_URL=...
```


### 3º - Arrancar el cliente

```language
yarn dev
```
##### Interfaz activa en:
```language
http://localhost:5173
```

### Arquitectura del Proyecto
El código se organiza de forma modular para facilitar la escalabilidad y el mantenimiento:
- **assets/:** Recursos estáticos, imágenes y estilos globales.
- **components/:** Componentes reutilizables (mapas, formularios, botones).
- **context/:** Gestión de estados globales mediante React Context (Auth, UI).
- **firebase/:** Configuración y métodos del SDK de Firebase.
- **hooks/:** Lógica de negocio extraída en Custom Hooks.
- **pages/:** Vistas principales de la aplicación y sus templates.
- **routes/:** Definición de rutas públicas y privadas (protegidas por rol).

  ### Enrutado y control de acceso

La aplicación implementa control de acceso por rol a nivel de rutas y layout.
Cada rol dispone de:

- Layout propio
- Navegación específica
- Rutas protegidas mediante `PrivateRoutes`

###### Roles implementados:
- ADMIN
- PRODUCER
- DIRECTOR
- ANALYST
- CONSULTANT

### Autenticación y rutas protegidas

La autenticación se gestiona mediante Firebase Auth.
El estado del usuario se mantiene en un `AuthContext` global que controla:

- Usuario autenticado
- Rol asignado
- Persistencia de sesión

Las rutas privadas se protegen mediante un componente `PrivateRoutes`,
que valida el rol antes de renderizar cada sección.

### Roles y Experiencia de Usuario

La interfaz adapta sus vistas, navegación y permisos según el rol autenticado.
El control de acceso se refuerza tanto en frontend (rutas/layouts) como en backend.

#### PRODUCER
- Gestión completa de sus propias parcelas.
- Creación y subida de imágenes 360º.
- Generación de reportes técnicos.
- Comunicación directa vía chat.

#### ANALYST
- Acceso global de lectura a parcelas.
- Análisis técnico y visualización de datos.
- Consulta de reportes y métricas.
- Sin capacidad de modificar parcelas.

#### DIRECTOR
- Supervisión global del sistema.
- Acceso a dashboards agregados.
- Gestión de productores y consultores.
- Validación y descarga de reportes.

#### CONSULTANT
- Acceso limitado a parcelas asignadas.
- Consulta de datos técnicos.
- Comunicación con productores y analistas.
- Sin capacidad de edición.


## Flujo de la aplicación

1. El usuario accede a la aplicación y se autentica mediante Firebase.
2. El backend valida el token y devuelve el rol del usuario.
3. Según el rol, se renderiza un layout específico:
   - **ProducerLayout**
   - **AnalystLayout**
   - **DirectorLayout**
   - **ConsultantLayout**
4. Las rutas están protegidas mediante `PrivateRoutes` y controladas por rol.


### Comunicación con el backend

El frontend consume la API REST de AgroSync **mediante peticiones HTTP
autenticadas con token Firebase**.

La URL base se define mediante la variable de entorno:

```language
- `VITE_BACKEND_URL`
```
Todas las peticiones a rutas protegidas incluyen el token de Firebase,
que es validado por el backend en cada request.


###### Las respuestas del backend determinan:
- **Datos visibles**
- **Accesos permitidos**
- **Mensajes de error**

### Variables de entorno (Frontend)

| Variable | Descripción | Origen |
|---------|-------------|--------|
| `VITE_API_KEY` | Clave pública del proyecto Firebase. | Firebase Console |
| `VITE_AUTH_DOMAIN` | Dominio de autenticación del proyecto Firebase. | Firebase Console |
| `VITE_PROJECT_ID` | ID del proyecto Firebase. | Firebase Console |
| `VITE_STORAGE_BUCKET` | Bucket de almacenamiento Firebase. | Firebase Console |
| `VITE_MESSAGING_SENDER_ID` | Identificador del servicio de mensajería Firebase. | Firebase Console |
| `VITE_APP_ID` | Identificador de la aplicación web Firebase. | Firebase Console |
| `VITE_BACKEND_URL` | URL base de la API REST de AgroSync. | Backend (local / producción) |
| `VITE_API_DATA_URL` | API externa para análisis de datos agrícolas. | Servicio externo (IA agrícola) |
| `VITE_API_DATA_URL_POINTS` | Servicio de análisis de imágenes 360º. | Servicio externo (visión artificial) |
| `VITE_API_DISEASE_URL` | API de detección de enfermedades en cultivos. | Servicio externo (IA agrícola) |
| `VITE_CHATBOT_URL` | Servicio de chatbot para asistencia técnica. | Servicio externo (IA conversacional) |


###### Nota:
Las variables VITE_ son accesibles desde el cliente por diseño.
Toda la lógica sensible, validación de permisos y control de acceso se gestiona exclusivamente en el backend.
Asegúrate de que el archivo .env esté incluido en el .gitignore.
  
### Funcionalidades Principales
🔐 Autenticación: Login seguro y persistencia de sesión vía Firebase.
🗺️ Mapas Interactivos: Integración con Leaflet para navegación geoespacial.
📸 Visualización 360º: Renderizado de imágenes de alta resolución con A-Frame.
💬 Chat en Vivo: Intercambio de mensajes instantáneos mediante Socket.io.
🔔 Sistema de Alertas: Notificaciones visuales sobre estados críticos de cultivos.
📄 Gestor de Reportes: Interfaz para visualizar y descargar documentos PDF.

### Tecnologías
Core: **React, Vite**
Visualización: **Leaflet, A-Frame**
Real-time: **Socket.io-client**
Security: **Firebase Auth, React Router**
Styling: **CSS Modules / Tailwind** (según tu configuración)

### Estado del proyecto
Este frontend forma parte del proyecto AgroSync desarrollado como
aplicación full-stack. El desarrollo continúa con mejoras progresivas
en experiencia de usuario y visualización de datos.
