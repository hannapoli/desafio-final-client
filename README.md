# AGROSYNC FRONTEND - SISTEMA DE GESTIÓN DE CULTIVOS

Este repositorio frontend (client) proporciona servicios para la gestión de campos agrícolas, con mapas interactivos, generación de reportes, visualizador de imágenes en 360º, generación de reportes, comunicación a través de un chat integrado entre los diferentes usuarios, gestión de alarmas y autenticación de usuarios mediante Firebase. Consume las API REST de AgroSync (backend) y datos de cultivo AgroSync


## INSTALACIÓN
1. Clona este repositorio
```bash
git clone https://github.com/hannapoli/desafio-final-client
```
2. Ejecuta los siguientes comandos
```bash
yarn 
yarn dev
```
3. Renombra el archivo llamado .env.template por .env y completa las variables de entorno.

## CARACTERÍSTICAS PRINCIPALES
- Autenticación mediante Firebase
- Protección de rutas
- Gestión de parcelas
- Gestión de reportes
- Gestión de mensajes
- Gestión de alertas
- Gestión de imágenes 360

## TECNOLOGÍAS UTILIZADAS
- React + Vite
- Aframe
- Firebase
- Leaflet
- React dom
- React router
- Socket.io

## VARIABLES DE ENTORNO
```bash
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_BACKEND_URL=
VITE_API_DATA_URL=
```

## ESTRUCTURA DEL PROYECTO
```bash
public/
src/
   assets/
        images/
    components/
        map/
    context/   
    data/
    firebase/
    helpers/
    hooks/
    pages/
        templates/
    routes/
    App.cs
    App.jsx
    index.css
    main.jsx
.env.template
index.html
package.json
README.md
vite.config.js   
```