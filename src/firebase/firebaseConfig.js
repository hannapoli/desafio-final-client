import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Configuración e inicialización de Firebase.
 * 
 * Este módulo centraliza la conexión con los servicios de Firebase 
 * utilizando las variables de entorno definidas en el proyecto.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Inicializamos Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);

// Inicializamos Firebase Authentication
export const auth = getAuth(app);