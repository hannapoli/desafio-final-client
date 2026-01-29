/**
 * Normaliza los archivos o URLs adjuntas para asegurar un formato manejable.
 * 
 * Esta función procesa diferentes entradas (arrays, strings simples o formatos de base de datos)
 * y los convierte en un array de strings limpio. Es útil para manejar las URLs de imágenes
 * o documentos que vienen desde PostgreSQL o inputs de archivos.
 * 
 * @param {string|Array|null} attached - Los datos originales de los archivos adjuntos.
 * @returns {Array<string>|null} Un array con las URLs normalizadas o null si no hay datos.
 */
export function normalizeFileData(attached) {
    if (!attached) return null;

    // Arrays anidados
    if (Array.isArray(attached)) {
        const flattened = attached.flat(Infinity).filter(item => item && typeof item === 'string');
        return flattened.length > 0 ? flattened : null;
    }

    if (typeof attached === 'string') {
        // Manejamos formato de array de PostgreSQL: {url1,url2}
        if (attached.startsWith('{') && attached.endsWith('}')) {
            return attached.slice(1, -1).split(',').map(url => url.trim()).filter(url => url);
        }
        if (attached.includes(',')) {
            return attached.split(',').map(url => url.trim()).filter(url => url);
        }
        // URL
        return [attached];
    }

    return [attached];
};